const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type, authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'content-type': 'application/json' } });

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
    const url = new URL(request.url);
    if (url.pathname !== '/events') return json({ ok: false, error: 'Not found' }, 404);

    if (request.method === 'POST') {
      const body = await request.json().catch(() => null);
      if (!body || !body.type) return json({ ok: false, error: 'Invalid event' }, 400);
      const id = body.id || crypto.randomUUID();
      const payload = JSON.stringify(body);
      await env.DB.prepare('INSERT INTO events (id, kind, created_at, payload) VALUES (?, ?, ?, ?)').bind(id, body.type, new Date().toISOString(), payload).run();
      return json({ ok: true, id });
    }

    if (request.method === 'GET') {
      const auth = request.headers.get('authorization') || '';
      if (auth !== `Bearer ${env.ADMIN_TOKEN}`) return json({ ok: false, error: 'Unauthorized' }, 401);
      const limit = Math.min(Number(url.searchParams.get('limit') || 100), 500);
      const results = await env.DB.prepare('SELECT id, kind, created_at, payload FROM events ORDER BY created_at DESC LIMIT ?').bind(limit).all();
      return json({ ok: true, events: results.results });
    }

    return json({ ok: false, error: 'Method not allowed' }, 405);
  }
};
