const encoder = new TextEncoder();
const decoder = new TextDecoder();
const BOOKING_STATUSES = new Set(['new', 'contacted', 'confirmed', 'completed', 'cancelled']);
const MEDIA_SLOTS = new Set(['hero', 'booking', 'gallery']);
const MAX_MEDIA_BYTES = 20 * 1024 * 1024;

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = String(env.ALLOWED_ORIGINS || '').split(',').map((item) => item.trim()).filter(Boolean);
  const allowOrigin = !allowed.length ? '*' : (allowed.includes(origin) ? origin : allowed[0]);
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'content-type, authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

function json(request, env, body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(request, env),
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extraHeaders
    }
  });
}

function textValue(value, maxLength = 200) {
  return String(value == null ? '' : value).trim().slice(0, maxLength);
}

function phoneValue(value) {
  return textValue(value, 24).replace(/\D/g, '').slice(-10);
}

function boolValue(value) {
  return value === true || value === 1 || value === '1' || value === 'true' || value === 'on';
}

function numberValue(value, min = 0, max = 100000) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return Math.min(max, Math.max(min, number));
}

function clampInteger(value, fallback, min, max) {
  const number = Number.parseInt(value, 10);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function bookingReference() {
  const date = new Date();
  const ymd = date.toISOString().slice(2, 10).replaceAll('-', '');
  const random = crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase().padStart(6, '0').slice(-6);
  return 'NH-' + ymd + '-' + random;
}

function bytesToBase64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

function stringToBase64Url(value) {
  return bytesToBase64Url(encoder.encode(value));
}

function base64UrlToString(value) {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/');
  const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
  const binary = atob(padded);
  return decoder.decode(Uint8Array.from(binary, (character) => character.charCodeAt(0)));
}

async function hmac(value, secret) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return bytesToBase64Url(new Uint8Array(signature));
}

function safeEqual(left, right) {
  const a = String(left || '');
  const b = String(right || '');
  let mismatch = a.length ^ b.length;
  const length = Math.max(a.length, b.length);
  for (let index = 0; index < length; index += 1) mismatch |= (a.charCodeAt(index % Math.max(1, a.length)) || 0) ^ (b.charCodeAt(index % Math.max(1, b.length)) || 0);
  return mismatch === 0;
}

async function createAdminToken(env) {
  const now = Math.floor(Date.now() / 1000);
  const payload = stringToBase64Url(JSON.stringify({ iat: now, exp: now + 8 * 60 * 60, nonce: crypto.randomUUID() }));
  const signature = await hmac(payload, env.ADMIN_SESSION_SECRET);
  return payload + '.' + signature;
}

async function verifyAdmin(request, env) {
  if (!env.ADMIN_SESSION_SECRET) return false;
  const authorization = request.headers.get('Authorization') || '';
  if (!authorization.startsWith('Bearer ')) return false;
  const token = authorization.slice(7);
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const expected = await hmac(parts[0], env.ADMIN_SESSION_SECRET);
  if (!safeEqual(parts[1], expected)) return false;
  try {
    const payload = JSON.parse(base64UrlToString(parts[0]));
    return Number(payload.exp) > Math.floor(Date.now() / 1000);
  } catch (error) {
    return false;
  }
}

async function hashValue(value, secret) {
  const data = encoder.encode(String(value) + ':' + String(secret));
  const digest = await crypto.subtle.digest('SHA-256', data);
  return bytesToBase64Url(new Uint8Array(digest));
}

async function rateLimit(request, env, scope, maximum, windowSeconds) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const secret = env.RATE_LIMIT_SECRET || env.ADMIN_SESSION_SECRET || 'new-hira';
  const key = scope + ':' + await hashValue(ip, secret);
  const now = new Date();
  const record = await env.DB.prepare('SELECT hits, window_started_at FROM request_limits WHERE limit_key = ?').bind(key).first();
  if (!record || now.getTime() - new Date(record.window_started_at).getTime() >= windowSeconds * 1000) {
    await env.DB.prepare('INSERT INTO request_limits (limit_key, hits, window_started_at) VALUES (?, 1, ?) ON CONFLICT(limit_key) DO UPDATE SET hits = 1, window_started_at = excluded.window_started_at').bind(key, now.toISOString()).run();
    return true;
  }
  if (Number(record.hits) >= maximum) return false;
  await env.DB.prepare('UPDATE request_limits SET hits = hits + 1 WHERE limit_key = ?').bind(key).run();
  return true;
}

async function readJson(request) {
  const contentType = request.headers.get('Content-Type') || '';
  if (!contentType.includes('application/json')) return null;
  return request.json().catch(() => null);
}

function validateBooking(body) {
  if (!body) return { error: 'Booking details are required.' };
  const booking = {
    name: textValue(body.name, 100),
    phone: phoneValue(body.phone),
    village: textValue(body.village, 100),
    location: textValue(body.location, 140),
    crop: textValue(body.crop, 60),
    acreage: numberValue(body.acreage, 0, 10000),
    date: textValue(body.date || body.preferredDate, 20),
    flexibility: textValue(body.flexibility, 80),
    access: textValue(body.access, 120),
    machine: textValue(body.machine || 'Help me choose', 80),
    notes: textValue(body.notes, 500),
    consent: boolValue(body.consent),
    source: textValue(body.source || 'website', 40)
  };
  if (!booking.name) return { error: 'Name is required.' };
  if (booking.phone.length !== 10) return { error: 'A valid 10-digit phone number is required.' };
  if (!booking.village) return { error: 'Village is required.' };
  if (!booking.location) return { error: 'District or nearby town is required.' };
  if (!booking.crop) return { error: 'Crop is required.' };
  if (!booking.date) return { error: 'Preferred date is required.' };
  return { booking };
}

function bookingFromRow(row) {
  return {
    id: row.id,
    reference: row.reference,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: row.status,
    source: row.source,
    name: row.name,
    phone: row.phone,
    village: row.village,
    location: row.location,
    crop: row.crop,
    acreage: row.acreage,
    date: row.preferred_date,
    flexibility: row.flexibility,
    access: row.access,
    machine: row.machine,
    notes: row.notes,
    consent: Boolean(row.consent)
  };
}

function leadFromRow(row) {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: row.status,
    source: row.source,
    name: row.name,
    phone: row.phone,
    location: row.location,
    interest: row.interest,
    consent: Boolean(row.consent)
  };
}

function mediaUrl(request, key) {
  return new URL(request.url).origin + '/api/media/file/' + encodeURIComponent(key);
}

function mediaFromRow(request, row) {
  return {
    id: row.id,
    title: row.title,
    alt: row.alt_text,
    slot: row.slot,
    kind: row.kind,
    mime: row.mime_type,
    size: row.size_bytes,
    active: Boolean(row.active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    url: mediaUrl(request, row.object_key)
  };
}

async function insertBooking(env, booking) {
  const id = crypto.randomUUID();
  const reference = bookingReference();
  const now = new Date().toISOString();
  await env.DB.prepare('INSERT INTO bookings (id, reference, created_at, updated_at, status, source, name, phone, village, location, crop, acreage, preferred_date, flexibility, access, machine, notes, consent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(id, reference, now, now, 'new', booking.source, booking.name, booking.phone, booking.village, booking.location, booking.crop, booking.acreage, booking.date, booking.flexibility, booking.access, booking.machine, booking.notes, booking.consent ? 1 : 0)
    .run();
  return { id, reference, createdAt: now, updatedAt: now, status: 'new', ...booking };
}

async function publicBooking(request, env) {
  if (!await rateLimit(request, env, 'booking', 12, 3600)) return json(request, env, { ok: false, error: 'Too many booking attempts. Please call the booking desk.' }, 429);
  const validation = validateBooking(await readJson(request));
  if (validation.error) return json(request, env, { ok: false, error: validation.error }, 400);
  if (!validation.booking.consent) return json(request, env, { ok: false, error: 'Contact consent is required.' }, 400);
  const booking = await insertBooking(env, validation.booking);
  return json(request, env, { ok: true, booking }, 201);
}

async function publicLead(request, env) {
  if (!await rateLimit(request, env, 'lead', 12, 3600)) return json(request, env, { ok: false, error: 'Too many registration attempts. Please try later.' }, 429);
  const body = await readJson(request);
  const lead = {
    name: textValue(body && body.name, 100),
    phone: phoneValue(body && body.phone),
    location: textValue(body && body.location, 140),
    interest: textValue(body && body.interest, 100),
    source: textValue(body && body.source || 'website', 40),
    consent: boolValue(body && body.consent)
  };
  if (!lead.name || lead.phone.length !== 10 || !lead.consent) return json(request, env, { ok: false, error: 'Name, valid phone number and contact consent are required.' }, 400);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await env.DB.prepare('INSERT INTO leads (id, created_at, updated_at, status, source, name, phone, location, interest, consent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(id, now, now, 'new', lead.source, lead.name, lead.phone, lead.location, lead.interest, 1)
    .run();
  return json(request, env, { ok: true, lead: { id, createdAt: now, updatedAt: now, status: 'new', ...lead } }, 201);
}

async function publicEvent(request, env) {
  if (!await rateLimit(request, env, 'event', 180, 600)) return json(request, env, { ok: true, limited: true }, 202);
  const body = await readJson(request);
  const eventName = textValue(body && body.eventName, 80);
  if (!eventName) return json(request, env, { ok: false, error: 'Event name is required.' }, 400);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const metadata = JSON.stringify(body && typeof body.metadata === 'object' ? body.metadata : {}).slice(0, 4000);
  await env.DB.prepare('INSERT INTO events (id, event_name, session_id, path, referrer, device, created_at, metadata) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(id, eventName, textValue(body.sessionId, 120), textValue(body.path, 300), textValue(body.referrer, 500), textValue(body.device, 30), now, metadata)
    .run();
  return json(request, env, { ok: true, id }, 201);
}

async function publicMedia(request, env, url) {
  const activeOnly = url.searchParams.get('active') !== '0';
  const query = activeOnly
    ? 'SELECT * FROM media WHERE active = 1 ORDER BY created_at DESC LIMIT 100'
    : 'SELECT * FROM media ORDER BY created_at DESC LIMIT 100';
  const result = await env.DB.prepare(query).all();
  return json(request, env, { ok: true, media: result.results.map((row) => mediaFromRow(request, row)) }, 200, { 'Cache-Control': 'public, max-age=60' });
}

async function serveMedia(request, env, path) {
  if (!env.MEDIA) return json(request, env, { ok: false, error: 'Media storage is not configured.' }, 503);
  const prefix = '/api/media/file/';
  const key = decodeURIComponent(path.slice(prefix.length));
  const object = await env.MEDIA.get(key);
  if (!object) return json(request, env, { ok: false, error: 'Media not found.' }, 404);
  const headers = new Headers(corsHeaders(request, env));
  object.writeHttpMetadata(headers);
  headers.set('ETag', object.httpEtag);
  headers.set('Cache-Control', 'public, max-age=86400');
  return new Response(object.body, { headers });
}

async function adminLogin(request, env) {
  if (!env.ADMIN_PIN || !env.ADMIN_SESSION_SECRET) return json(request, env, { ok: false, error: 'Owner authentication secrets are not configured.' }, 503);
  if (!await rateLimit(request, env, 'admin-login', 5, 900)) return json(request, env, { ok: false, error: 'Too many PIN attempts. Wait 15 minutes before trying again.' }, 429);
  const body = await readJson(request);
  const pin = textValue(body && body.pin, 12);
  if (!safeEqual(pin, env.ADMIN_PIN)) return json(request, env, { ok: false, error: 'Owner PIN does not match.' }, 401);
  const token = await createAdminToken(env);
  return json(request, env, { ok: true, token, expiresIn: 8 * 60 * 60 });
}

function dayKey(date) {
  return date.toISOString().slice(0, 10);
}

async function adminOverview(request, env) {
  const now = new Date();
  const today = dayKey(now);
  const since = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
  since.setHours(0, 0, 0, 0);
  const statements = [
    env.DB.prepare('SELECT COUNT(*) AS count FROM bookings'),
    env.DB.prepare("SELECT COUNT(*) AS count FROM bookings WHERE status = 'new'"),
    env.DB.prepare('SELECT COUNT(*) AS count FROM bookings WHERE substr(created_at, 1, 10) = ?').bind(today),
    env.DB.prepare('SELECT COUNT(*) AS count FROM leads'),
    env.DB.prepare("SELECT COUNT(DISTINCT session_id) AS count FROM events WHERE event_name = 'page_view' AND created_at >= ?").bind(since.toISOString()),
    env.DB.prepare("SELECT substr(created_at, 1, 10) AS day, COUNT(DISTINCT CASE WHEN event_name = 'page_view' THEN session_id END) AS visits, SUM(CASE WHEN event_name = 'booking_step_view' THEN 1 ELSE 0 END) AS booking_starts FROM events WHERE created_at >= ? GROUP BY substr(created_at, 1, 10) ORDER BY day").bind(since.toISOString()),
    env.DB.prepare('SELECT crop, COUNT(*) AS count FROM bookings GROUP BY crop ORDER BY count DESC LIMIT 5'),
    env.DB.prepare("SELECT device, COUNT(DISTINCT session_id) AS count FROM events WHERE event_name = 'page_view' AND created_at >= ? GROUP BY device").bind(since.toISOString()),
    env.DB.prepare('SELECT * FROM bookings ORDER BY created_at DESC LIMIT 6')
  ];
  const results = await env.DB.batch(statements);
  const scalar = (index) => Number(results[index].results[0] && results[index].results[0].count || 0);
  const activityMap = new Map(results[5].results.map((item) => [item.day, item]));
  const activity = [];
  for (let offset = 0; offset < 7; offset += 1) {
    const date = new Date(since.getTime() + offset * 24 * 60 * 60 * 1000);
    const key = dayKey(date);
    const item = activityMap.get(key) || {};
    activity.push({
      day: key,
      label: new Intl.DateTimeFormat('en', { weekday: 'short' }).format(date).toUpperCase(),
      visits: Number(item.visits || 0),
      bookingStarts: Number(item.booking_starts || 0)
    });
  }
  return json(request, env, {
    ok: true,
    summary: { bookings: scalar(0), newBookings: scalar(1), todayBookings: scalar(2), leads: scalar(3), visits7d: scalar(4) },
    activity,
    topCrops: results[6].results.map((item) => ({ crop: item.crop, count: Number(item.count) })),
    devices: results[7].results.map((item) => ({ device: item.device || 'unknown', count: Number(item.count) })),
    recentBookings: results[8].results.map(bookingFromRow)
  });
}

async function adminBookings(request, env, url) {
  const page = clampInteger(url.searchParams.get('page'), 1, 1, 100000);
  const limit = clampInteger(url.searchParams.get('limit'), 30, 1, 1000);
  const status = textValue(url.searchParams.get('status'), 20);
  const search = textValue(url.searchParams.get('q'), 100);
  const where = [];
  const bindings = [];
  if (status && BOOKING_STATUSES.has(status)) {
    where.push('status = ?');
    bindings.push(status);
  }
  if (search) {
    where.push('(name LIKE ? OR phone LIKE ? OR village LIKE ? OR location LIKE ? OR reference LIKE ?)');
    const like = '%' + search + '%';
    bindings.push(like, like, like, like, like);
  }
  const whereSql = where.length ? ' WHERE ' + where.join(' AND ') : '';
  const countStatement = env.DB.prepare('SELECT COUNT(*) AS count FROM bookings' + whereSql).bind(...bindings);
  const dataStatement = env.DB.prepare('SELECT * FROM bookings' + whereSql + ' ORDER BY created_at DESC LIMIT ? OFFSET ?').bind(...bindings, limit, (page - 1) * limit);
  const results = await env.DB.batch([countStatement, dataStatement]);
  const total = Number(results[0].results[0] && results[0].results[0].count || 0);
  return json(request, env, { ok: true, bookings: results[1].results.map(bookingFromRow), page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) });
}

async function adminCreateBooking(request, env) {
  const validation = validateBooking(await readJson(request));
  if (validation.error) return json(request, env, { ok: false, error: validation.error }, 400);
  validation.booking.consent = true;
  validation.booking.source = validation.booking.source || 'owner_desk';
  const booking = await insertBooking(env, validation.booking);
  return json(request, env, { ok: true, booking }, 201);
}

async function adminUpdateBooking(request, env, id) {
  const body = await readJson(request);
  const status = textValue(body && body.status, 20);
  if (!BOOKING_STATUSES.has(status)) return json(request, env, { ok: false, error: 'Invalid booking status.' }, 400);
  const result = await env.DB.prepare('UPDATE bookings SET status = ?, updated_at = ? WHERE id = ?').bind(status, new Date().toISOString(), id).run();
  if (!result.meta.changes) return json(request, env, { ok: false, error: 'Booking not found.' }, 404);
  return json(request, env, { ok: true });
}

async function adminDeleteBooking(request, env, id) {
  const result = await env.DB.prepare('DELETE FROM bookings WHERE id = ?').bind(id).run();
  if (!result.meta.changes) return json(request, env, { ok: false, error: 'Booking not found.' }, 404);
  return json(request, env, { ok: true });
}

async function adminLeads(request, env, url) {
  const limit = clampInteger(url.searchParams.get('limit'), 200, 1, 500);
  const result = await env.DB.prepare('SELECT * FROM leads ORDER BY created_at DESC LIMIT ?').bind(limit).all();
  return json(request, env, { ok: true, leads: result.results.map(leadFromRow) });
}

async function adminMedia(request, env) {
  const result = await env.DB.prepare('SELECT * FROM media ORDER BY created_at DESC LIMIT 200').all();
  return json(request, env, { ok: true, media: result.results.map((row) => mediaFromRow(request, row)) });
}

function safeFileName(value) {
  return textValue(value, 100).toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'asset';
}

async function adminUploadMedia(request, env) {
  if (!env.MEDIA) return json(request, env, { ok: false, error: 'R2 media storage is not configured.' }, 503);
  const form = await request.formData().catch(() => null);
  if (!form) return json(request, env, { ok: false, error: 'Invalid upload form.' }, 400);
  const file = form.get('file');
  if (!file || typeof file.arrayBuffer !== 'function') return json(request, env, { ok: false, error: 'Choose an image or video file.' }, 400);
  if (file.size > MAX_MEDIA_BYTES) return json(request, env, { ok: false, error: 'Media files must be 20 MB or smaller.' }, 413);
  const type = textValue(file.type, 100).toLowerCase();
  const allowed = type.startsWith('image/') || type === 'video/mp4' || type === 'video/webm';
  if (!allowed) return json(request, env, { ok: false, error: 'Only JPG, PNG, WebP, MP4 and WebM media are supported.' }, 400);
  const title = textValue(form.get('title'), 100);
  const alt = textValue(form.get('alt'), 180);
  const slotValue = textValue(form.get('slot'), 20);
  const slot = MEDIA_SLOTS.has(slotValue) ? slotValue : 'gallery';
  if (!title) return json(request, env, { ok: false, error: 'Campaign title is required.' }, 400);
  const id = crypto.randomUUID();
  const key = 'campaign/' + new Date().toISOString().slice(0, 10) + '/' + id + '-' + safeFileName(file.name);
  const kind = type.startsWith('video/') ? 'video' : 'image';
  const bytes = await file.arrayBuffer();
  await env.MEDIA.put(key, bytes, { httpMetadata: { contentType: type } });
  const now = new Date().toISOString();
  await env.DB.prepare('INSERT INTO media (id, object_key, title, alt_text, slot, kind, mime_type, size_bytes, active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(id, key, title, alt, slot, kind, type, file.size, boolValue(form.get('active')) ? 1 : 0, now, now)
    .run();
  const row = await env.DB.prepare('SELECT * FROM media WHERE id = ?').bind(id).first();
  return json(request, env, { ok: true, media: mediaFromRow(request, row) }, 201);
}

async function adminUpdateMedia(request, env, id) {
  const body = await readJson(request);
  const row = await env.DB.prepare('SELECT * FROM media WHERE id = ?').bind(id).first();
  if (!row) return json(request, env, { ok: false, error: 'Media not found.' }, 404);
  const title = body && body.title != null ? textValue(body.title, 100) : row.title;
  const alt = body && body.alt != null ? textValue(body.alt, 180) : row.alt_text;
  const requestedSlot = body && body.slot != null ? textValue(body.slot, 20) : row.slot;
  const slot = MEDIA_SLOTS.has(requestedSlot) ? requestedSlot : row.slot;
  const active = body && body.active != null ? (boolValue(body.active) ? 1 : 0) : row.active;
  await env.DB.prepare('UPDATE media SET title = ?, alt_text = ?, slot = ?, active = ?, updated_at = ? WHERE id = ?').bind(title, alt, slot, active, new Date().toISOString(), id).run();
  return json(request, env, { ok: true });
}

async function adminDeleteMedia(request, env, id) {
  const row = await env.DB.prepare('SELECT object_key FROM media WHERE id = ?').bind(id).first();
  if (!row) return json(request, env, { ok: false, error: 'Media not found.' }, 404);
  if (env.MEDIA) await env.MEDIA.delete(row.object_key);
  await env.DB.prepare('DELETE FROM media WHERE id = ?').bind(id).run();
  return json(request, env, { ok: true });
}

async function handle(request, env) {
  if (!env.DB) return json(request, env, { ok: false, error: 'D1 database binding DB is not configured.' }, 503);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(request, env) });
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  if (path === '/api/health' && request.method === 'GET') return json(request, env, { ok: true, service: 'new-hira-fieldcraft', version: '17' });
  if (path === '/api/bookings' && request.method === 'POST') return publicBooking(request, env);
  if (path === '/api/leads' && request.method === 'POST') return publicLead(request, env);
  if (path === '/api/events' && request.method === 'POST') return publicEvent(request, env);
  if (path === '/api/media' && request.method === 'GET') return publicMedia(request, env, url);
  if (path.startsWith('/api/media/file/') && request.method === 'GET') return serveMedia(request, env, path);
  if (path === '/api/admin/login' && request.method === 'POST') return adminLogin(request, env);

  if (path.startsWith('/api/admin/')) {
    if (!await verifyAdmin(request, env)) return json(request, env, { ok: false, error: 'Owner authorization is required.' }, 401);
    if (path === '/api/admin/overview' && request.method === 'GET') return adminOverview(request, env);
    if (path === '/api/admin/bookings' && request.method === 'GET') return adminBookings(request, env, url);
    if (path === '/api/admin/bookings' && request.method === 'POST') return adminCreateBooking(request, env);
    if (path === '/api/admin/leads' && request.method === 'GET') return adminLeads(request, env, url);
    if (path === '/api/admin/media' && request.method === 'GET') return adminMedia(request, env);
    if (path === '/api/admin/media' && request.method === 'POST') return adminUploadMedia(request, env);

    const bookingMatch = path.match(/^\/api\/admin\/bookings\/([^/]+)$/);
    if (bookingMatch && request.method === 'PATCH') return adminUpdateBooking(request, env, decodeURIComponent(bookingMatch[1]));
    if (bookingMatch && request.method === 'DELETE') return adminDeleteBooking(request, env, decodeURIComponent(bookingMatch[1]));
    const mediaMatch = path.match(/^\/api\/admin\/media\/([^/]+)$/);
    if (mediaMatch && request.method === 'PATCH') return adminUpdateMedia(request, env, decodeURIComponent(mediaMatch[1]));
    if (mediaMatch && request.method === 'DELETE') return adminDeleteMedia(request, env, decodeURIComponent(mediaMatch[1]));
  }

  return json(request, env, { ok: false, error: 'Route not found.' }, 404);
}

export default {
  async fetch(request, env) {
    try {
      return await handle(request, env);
    } catch (error) {
      console.error('New Hira API error', error);
      return json(request, env, { ok: false, error: 'The booking service could not complete this request.' }, 500);
    }
  }
};
