const MODELS = {
  985: {
    id: '985', number: '01', name: 'New Hira 985', eyebrow: 'The high-capacity workhorse', image: 'assets/brochure-985-spread.jpg', caption: 'New Hira 985 / exact brochure spread',
    copy: 'Maximum yield in the shortest time — built for farmers who want more field covered, with less grain loss and low fuel consumption.', width: '4.4', tank: '1,800', walkers: '5', crops: 'Wheat · Paddy · Soyabean · Gram · Sunflower · Pulses',
    specs: [['Effective cutter', '4.28 m'], ['Threshing drum', '1,258 mm'], ['Grain tank', '1,800 kg'], ['Fuel tank', '350 litre'], ['Working width', '5,900 mm'], ['Ground clearance', '250 mm']]
  },
  785: {
    id: '785', number: '02', name: 'New Hira 785', eyebrow: 'The agile field finisher', image: 'assets/brochure-785-spread.jpg', caption: 'New Hira 785 / exact brochure spread',
    copy: 'A compact, capable multicrop combine for smooth field access, small turning radius and a dependable finish across changing conditions.', width: '3.7', tank: '1,600', walkers: '4', crops: 'Wheat · Paddy · Soyabean · Gram · Sunflower · Pulses',
    specs: [['Effective cutter', '3.6 m'], ['Threshing drum', '1,015 mm'], ['Grain tank', '1,600 kg'], ['Fuel tank', '350 litre'], ['Working width', '5,290 mm'], ['Ground clearance', '250 mm']]
  }
};

const STORAGE = {
  bookings: 'fieldcraft_bookings_v1',
  leads: 'fieldcraft_leads_v1',
  visitors: 'fieldcraft_visitors_v1',
  assets: 'fieldcraft_assets_v1',
  settings: 'fieldcraft_settings_v1'
};
const VISITOR_GATE_KEY = 'fieldcraft_visitor_seen_v2';

// Optional cross-device endpoint. Leave blank for GitHub Pages-only mode.
const CONFIG = { analyticsEndpoint: '' };
const OWNER_PIN = '985785';
let currentModel = '985';
let toastTimer;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const readStore = (key, fallback = []) => {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
};
const writeStore = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const uid = (prefix) => `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));
const localDate = (value) => value ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`)) : 'Date flexible';
const eventDate = (value) => new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value));

function postToEndpoint(payload) {
  if (!CONFIG.analyticsEndpoint) return;
  fetch(CONFIG.analyticsEndpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload), keepalive: true }).catch(() => {});
}

function showToast(message) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
}

function trackEvent(type, details = {}) {
  const event = { id: uid('VIS'), type, createdAt: new Date().toISOString(), path: window.location.pathname || '/', referrer: document.referrer || 'direct', device: window.innerWidth < 700 ? 'mobile' : 'desktop', ...details };
  const visitors = readStore(STORAGE.visitors);
  visitors.unshift(event);
  writeStore(STORAGE.visitors, visitors.slice(0, 100));
  if (CONFIG.analyticsEndpoint && navigator.sendBeacon) {
    navigator.sendBeacon(CONFIG.analyticsEndpoint, new Blob([JSON.stringify(event)], { type: 'application/json' }));
  }
}

function storeLead(formData, source = 'visitor-gate') {
  const lead = { id: uid('LEAD'), createdAt: new Date().toISOString(), status: 'new', source, name: formData.get('name') || '', phone: formData.get('phone') || '', location: formData.get('location') || '', interest: formData.get('interest') || 'General enquiry', consent: true };
  const leads = readStore(STORAGE.leads);
  leads.unshift(lead);
  writeStore(STORAGE.leads, leads.slice(0, 100));
  trackEvent('lead_captured', { leadId: lead.id, location: lead.location, interest: lead.interest });
  postToEndpoint({ type: 'lead_captured', id: lead.id, lead });
  return lead;
}

function saveBooking(input, source = 'website') {
  const booking = { id: uid('BOOK'), createdAt: new Date().toISOString(), status: 'new', source, ...input };
  const bookings = readStore(STORAGE.bookings);
  bookings.unshift(booking);
  writeStore(STORAGE.bookings, bookings.slice(0, 250));
  trackEvent('booking_started', { bookingId: booking.id, crop: booking.crop, location: booking.location });
  postToEndpoint({ type: 'booking_created', id: booking.id, booking });
  return booking;
}

function bookingMessage(booking) {
  return [
    'Hello Ram Chand & Sons, I would like to book a New Hira combine harvester.',
    '',
    `Name: ${booking.name || 'Not shared'}`,
    `Phone: ${booking.phone || 'Not shared'}`,
    `Village / district: ${booking.location || 'Not shared'}`,
    `Crop: ${booking.crop || 'Not shared'}`,
    `Preferred date: ${localDate(booking.date)}`,
    `Approx. acreage: ${booking.acreage || 'Not shared'}`,
    `Machine preference: ${booking.machine || 'Help me choose'}`,
    booking.notes ? `Notes: ${booking.notes}` : '',
    '',
    `Booking reference: ${booking.id}`
  ].filter(Boolean).join('\n');
}

function setModel(modelId) {
  const model = MODELS[modelId];
  if (!model) return;
  currentModel = modelId;
  $$('.fleet-tab').forEach((tab) => {
    const active = tab.dataset.modelTab === modelId;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  const image = $('#machineImage');
  if (image) {
    image.classList.add('is-switching');
    setTimeout(() => { image.src = model.image; image.alt = `${model.name} combine harvester product render`; image.classList.remove('is-switching'); }, 180);
  }
  const heroImage = $('#heroMachineImage');
  if (heroImage) {
    heroImage.classList.add('is-switching');
    setTimeout(() => { heroImage.src = model.image; heroImage.alt = `${model.name} combine harvester product render`; heroImage.classList.remove('is-switching'); }, 180);
  }
  const heroModelTag = $('#heroModelTag');
  if (heroModelTag) heroModelTag.textContent = model.id;
  const heroCutter = $('.showcase-card-mini strong');
  if (heroCutter) heroCutter.textContent = `${model.width} m`;
  const heroCutterNote = $('.showcase-card-mini small');
  if (heroCutterNote) heroCutterNote.textContent = `${model.name} working width`;
  const heroBottomline = $('.showcase-bottomline span:last-child');
  if (heroBottomline) heroBottomline.textContent = `${model.number} / 02`;
  $('#machineNumber').textContent = model.number;
  $('#machineCaption').textContent = model.caption;
  $('#machineEyebrow').textContent = model.eyebrow;
  $('#machineTitle').innerHTML = `New Hira <em>${model.id}</em>`;
  $('#machineCopy').textContent = model.copy;
  $('#machineWidth').innerHTML = `${model.width}<span>m</span>`;
  $('#machineTank').innerHTML = `${model.tank}<span>kg</span>`;
  $('#machineWalkers').textContent = model.walkers;
  $('#machineSpecList').innerHTML = model.specs.map(([label, value]) => `<div class="spec-line"><span>${escapeHtml(label)}</span><b>${escapeHtml(value)}</b></div>`).join('');
  const button = $('#machineBookButton');
  if (button) button.dataset.machine = model.name;
}

function handleBookingSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const booking = saveBooking(Object.fromEntries(new FormData(form).entries()));
  const link = $('#whatsappLink');
  link.href = `https://wa.me/919216107700?text=${encodeURIComponent(bookingMessage(booking))}`;
  $('#bookingForm').hidden = true;
  $('#bookingSuccess').hidden = false;
  trackEvent('booking_form_submitted', { bookingId: booking.id });
  showToast('Booking request saved on this device.');
}

function handleQuickBooking(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  $('#bookingForm [name="name"]').value = data.name;
  $('#bookingForm [name="location"]').value = data.location;
  $('#bookingForm [name="crop"]').value = data.crop;
  $('#bookingForm [name="machine"]').value = currentModel === '985' ? 'New Hira 985' : 'New Hira 785';
  document.querySelector('#booking').scrollIntoView({ behavior: 'smooth' });
  trackEvent('quick_booking_opened', { crop: data.crop, location: data.location });
}

function setupVisitorGate() {
  const modal = $('#visitorModal');
  if (!modal || localStorage.getItem(VISITOR_GATE_KEY) === 'yes') return;
  const closeGate = (eventName = '') => {
    localStorage.setItem(VISITOR_GATE_KEY, 'yes');
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    if (eventName) trackEvent(eventName);
  };
  const showGate = () => {
    modal.hidden = false;
    document.body.classList.add('modal-open');
    trackEvent('visitor_gate_shown');
    window.setTimeout(() => $('#leadCaptureForm input[name="name"]')?.focus(), 80);
  };
  window.setTimeout(showGate, 1850);
  $('#skipVisitorGate')?.addEventListener('click', () => closeGate('visitor_gate_skipped'));
  $('#visitorModalClose')?.addEventListener('click', () => closeGate());
  modal.addEventListener('click', (event) => { if (event.target === modal) closeGate('visitor_gate_dismissed'); });
  $('#leadCaptureForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const lead = storeLead(new FormData(event.currentTarget));
    closeGate();
    showToast(`Thanks ${lead.name.split(' ')[0] || ''} — we’ll keep your field in mind.`);
  });
}

function renderBoard() {
  const board = $('#bookingBoard');
  if (!board) return;
  const bookings = readStore(STORAGE.bookings);
  const filter = $('#bookingFilter')?.value || 'all';
  const visible = filter === 'all' ? bookings : bookings.filter((booking) => booking.status === filter);
  $('#totalBookings').textContent = bookings.length;
  $('#newBookings').textContent = bookings.filter((booking) => booking.status === 'new').length;
  $('#confirmedBookings').textContent = bookings.filter((booking) => booking.status === 'confirmed').length;
  if (!visible.length) { board.innerHTML = '<div class="board-empty">No requests here yet. New WhatsApp bookings will appear after the form is submitted from this browser.</div>'; return; }
  board.innerHTML = visible.map((booking) => `<article class="booking-row" data-booking-id="${escapeHtml(booking.id)}"><div><b>${escapeHtml(booking.name || 'Unnamed farmer')}</b><small>${escapeHtml(booking.phone || 'No phone')} · ${eventDate(booking.createdAt)}</small></div><div><b>${escapeHtml(booking.location || 'Location not shared')}</b><small>${escapeHtml(booking.crop || 'Crop not shared')} · ${localDate(booking.date)}</small></div><div><small>MACHINE</small><b>${escapeHtml(booking.machine || 'Help me choose')}</b></div><div><select data-booking-status aria-label="Change booking status"><option value="new" ${booking.status === 'new' ? 'selected' : ''}>New</option><option value="confirmed" ${booking.status === 'confirmed' ? 'selected' : ''}>Confirmed</option><option value="completed" ${booking.status === 'completed' ? 'selected' : ''}>Completed</option></select></div><button class="row-delete" data-delete-booking type="button" aria-label="Delete ${escapeHtml(booking.name || 'booking')}">×</button></article>`).join('');
  $$('[data-booking-status]', board).forEach((select) => select.addEventListener('change', (event) => updateBookingStatus(event.target.closest('[data-booking-id]').dataset.bookingId, event.target.value)));
  $$('[data-delete-booking]', board).forEach((button) => button.addEventListener('click', () => deleteBooking(button.closest('[data-booking-id]').dataset.bookingId)));
}

function updateBookingStatus(id, status) {
  const bookings = readStore(STORAGE.bookings).map((booking) => booking.id === id ? { ...booking, status } : booking);
  writeStore(STORAGE.bookings, bookings); renderBoard(); showToast(`Booking marked ${status}.`);
}

function deleteBooking(id) {
  if (!window.confirm('Remove this booking from the local board?')) return;
  writeStore(STORAGE.bookings, readStore(STORAGE.bookings).filter((booking) => booking.id !== id)); renderBoard(); showToast('Booking removed from this device.');
}

function renderLeads() {
  const leads = readStore(STORAGE.leads);
  const visitors = readStore(STORAGE.visitors);
  $('#leadCount').textContent = leads.length;
  $('#leadCountSummary').textContent = leads.length;
  $('#visitorCount').textContent = visitors.length;
  $('#pulseCount').textContent = visitors.filter((item) => Date.now() - new Date(item.createdAt).getTime() < 24 * 60 * 60 * 1000).length;
  $('#leadBoard').innerHTML = leads.length ? leads.map((lead) => `<article class="lead-row"><div class="lead-avatar">${escapeHtml((lead.name || 'F').slice(0, 1).toUpperCase())}</div><div><b>${escapeHtml(lead.name || 'Unknown visitor')}</b><small>${escapeHtml(lead.phone || 'No phone')} · ${escapeHtml(lead.location || 'Location not shared')}</small></div><div><small>INTEREST</small><b>${escapeHtml(lead.interest)}</b></div><div><small>${eventDate(lead.createdAt)}</small><a href="https://wa.me/91${escapeHtml((lead.phone || '').replace(/\D/g, '').slice(-10))}" target="_blank" rel="noopener">WhatsApp ↗</a></div></article>`).join('') : '<div class="board-empty">No signups yet. Visitors who complete the welcome form will appear here.</div>';
  $('#visitorPulseBoard').innerHTML = visitors.length ? visitors.slice(0, 14).map((visitor) => `<div class="pulse-row"><span class="pulse-dot"></span><div><b>${escapeHtml(visitor.type.replaceAll('_', ' '))}</b><small>${escapeHtml(visitor.device)} · ${eventDate(visitor.createdAt)}</small></div><span>${escapeHtml(visitor.path)}</span></div>`).join('') : '<div class="board-empty">Visitor pulses will appear as people explore this browser.</div>';
}

function renderAssets() {
  const assets = readStore(STORAGE.assets);
  $('#assetBoard').innerHTML = assets.length ? assets.map((asset) => `<article class="asset-card"><div class="asset-preview">${asset.type.startsWith('video') ? `<video src="${asset.dataUrl}" muted></video>` : `<img src="${asset.dataUrl}" alt="${escapeHtml(asset.name)}" />`}</div><div><b>${escapeHtml(asset.name)}</b><small>${escapeHtml(asset.slot)} · ${Math.round(asset.size / 1024)} KB</small></div><button type="button" data-delete-asset="${escapeHtml(asset.id)}">Remove</button></article>`).join('') : '<div class="board-empty">No custom assets uploaded. The default brochure imagery is active.</div>';
  $$('[data-delete-asset]', $('#assetBoard')).forEach((button) => button.addEventListener('click', () => { writeStore(STORAGE.assets, readStore(STORAGE.assets).filter((asset) => asset.id !== button.dataset.deleteAsset)); renderAssets(); applyCustomAssets(); showToast('Asset removed.'); }));
}

function applyCustomAssets() {
  const assets = readStore(STORAGE.assets);
  const hero = assets.find((asset) => asset.slot === 'Hero backdrop');
  const poster = assets.find((asset) => asset.slot === 'Booking poster');
  if (hero) $('.hero-backdrop').style.backgroundImage = `linear-gradient(90deg, rgba(16,23,19,.97) 0%, rgba(16,23,19,.8) 40%, rgba(16,23,19,.2) 100%), url("${hero.dataUrl}")`;
  if (poster) $('.booking-bg').style.backgroundImage = `linear-gradient(90deg, var(--ink) 10%, transparent), url("${poster.dataUrl}")`;
}

function exportBookings() {
  const rows = readStore(STORAGE.bookings);
  const headers = ['id', 'createdAt', 'status', 'source', 'name', 'phone', 'location', 'crop', 'date', 'acreage', 'machine', 'notes'];
  const csv = [headers.join(','), ...rows.map((row) => headers.map((header) => `"${String(row[header] || '').replaceAll('"', '""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `fieldcraft-bookings-${new Date().toISOString().slice(0, 10)}.csv`; link.click(); URL.revokeObjectURL(link.href);
  showToast('Booking board exported.');
}

function setupDesk() {
  const modal = $('#deskModal');
  $$('[data-open-desk]').forEach((button) => button.addEventListener('click', () => { modal.hidden = false; document.body.classList.add('modal-open'); $('#deskGate').hidden = false; $('#deskApp').hidden = true; $('#deskPin').focus(); }));
  $$('[data-close-desk]').forEach((button) => button.addEventListener('click', () => { modal.hidden = true; document.body.classList.remove('modal-open'); }));
  modal?.addEventListener('click', (event) => { if (event.target === modal) { modal.hidden = true; document.body.classList.remove('modal-open'); } });
  $('#deskLoginForm')?.addEventListener('submit', (event) => { event.preventDefault(); if ($('#deskPin').value !== OWNER_PIN) { showToast('That owner PIN does not match.'); return; } $('#deskGate').hidden = true; $('#deskApp').hidden = false; $('#deskPin').value = ''; renderBoard(); renderLeads(); renderAssets(); });
  $('#bookingFilter')?.addEventListener('change', renderBoard);
  $('#deskAddBooking')?.addEventListener('click', () => { $('#deskAddForm').hidden = false; $('#deskAddForm').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); });
  $('#cancelDeskAdd')?.addEventListener('click', () => { $('#deskAddForm').hidden = true; });
  $('#operatorBookingForm')?.addEventListener('submit', (event) => { event.preventDefault(); saveBooking(Object.fromEntries(new FormData(event.currentTarget).entries()), 'owner desk'); event.currentTarget.reset(); $('#deskAddForm').hidden = true; renderBoard(); showToast('Booking added to the field list.'); });
  $('#exportBookings')?.addEventListener('click', exportBookings);
  $$('.desk-tab').forEach((tab) => tab.addEventListener('click', () => { $$('.desk-tab').forEach((item) => item.classList.toggle('is-active', item === tab)); $$('.desk-view').forEach((view) => view.hidden = view.id !== `deskView-${tab.dataset.deskView}`); if (tab.dataset.deskView === 'leads') renderLeads(); if (tab.dataset.deskView === 'content') renderAssets(); }));
  $('#assetUploadForm')?.addEventListener('submit', handleAssetUpload);
  $('#brandSettingsForm')?.addEventListener('submit', saveBrandSettings);
}

function handleAssetUpload(event) {
  event.preventDefault();
  const file = $('#assetFile').files[0];
  if (!file) return showToast('Choose an image or video first.');
  if (file.size > 1500000) return showToast('For GitHub-ready browser storage, keep the file under 1.5 MB.');
  const reader = new FileReader();
  reader.onload = () => { const assets = readStore(STORAGE.assets); assets.unshift({ id: uid('ASSET'), createdAt: new Date().toISOString(), name: file.name, type: file.type, size: file.size, slot: $('#assetSlot').value, dataUrl: reader.result }); writeStore(STORAGE.assets, assets.slice(0, 8)); event.currentTarget.reset(); renderAssets(); applyCustomAssets(); showToast('Asset saved to this browser.'); };
  reader.readAsDataURL(file);
}

function saveBrandSettings(event) {
  event.preventDefault();
  const settings = Object.fromEntries(new FormData(event.currentTarget).entries());
  writeStore(STORAGE.settings, settings);
  showToast('Brand settings saved for this browser.');
}

function setupMobileNav() {
  const toggle = $('#menuToggle'); const nav = $('#siteNav');
  const close = () => { toggle?.classList.remove('is-open'); nav?.classList.remove('is-open'); toggle?.setAttribute('aria-expanded', 'false'); document.body.classList.remove('nav-open'); };
  toggle?.addEventListener('click', () => { const open = !nav.classList.contains('is-open'); toggle.classList.toggle('is-open', open); nav.classList.toggle('is-open', open); toggle.setAttribute('aria-expanded', String(open)); document.body.classList.toggle('nav-open', open); });
  $$('#siteNav a, #siteNav button').forEach((item) => item.addEventListener('click', close));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
}

function setupReveal() {
  const items = $$('.reveal');
  const showInView = () => {
    const viewportBottom = window.innerHeight * .95;
    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < viewportBottom && rect.bottom > -40) item.classList.add('is-visible');
    });
  };
  let started = false;
  const start = () => {
    if (started) { showInView(); return; }
    started = true;
    showInView();
    if (typeof window.IntersectionObserver !== 'function') {
      window.addEventListener('scroll', showInView, { passive: true });
      window.addEventListener('resize', showInView, { passive: true });
      return;
    }
    const observer = new window.IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: .12, rootMargin: '0px 0px -8% 0px' });
    items.forEach((item, index) => { item.style.setProperty('--reveal-delay', `${Math.min(index % 5, 4) * 75}ms`); observer.observe(item); });
  };
  if (document.body.classList.contains('is-ready')) start();
  else document.addEventListener('fieldcraft:ready', start, { once: true });
  window.setTimeout(() => { start(); showInView(); }, 1450);
}

function setupScrollPolish() {
  const root = document.documentElement;
  let frame = 0;
  const update = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(100, Math.max(0, (window.scrollY / max) * 100));
    root.style.setProperty('--scroll-progress', `${progress}%`);
    document.body.classList.toggle('is-scrolled', window.scrollY > 28);
    const backdrop = $('.hero-backdrop');
    if (backdrop) backdrop.style.setProperty('--hero-shift', `${Math.min(window.scrollY * .12, 72)}px`);
    frame = 0;
  };
  const requestUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  update();
}

function setupParallax() {
  const showcase = $('#heroShowcase');
  if (!showcase) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tiltAmplitude = reducedMotion ? .95 : 2.4;
  const depthAmplitude = reducedMotion ? .7 : 1.8;
  let pointerActive = false;
  let phase = 0;
  let frame = 0;
  const setTilt = (x, y) => { showcase.style.setProperty('--tilt-x', `${y}deg`); showcase.style.setProperty('--tilt-y', `${x}deg`); };
  const tick = () => {
    if (!pointerActive) {
      phase += .012;
      setTilt(Math.sin(phase) * tiltAmplitude, Math.cos(phase * .82) * depthAmplitude);
    }
    frame = requestAnimationFrame(tick);
  };
  showcase.addEventListener('pointermove', (event) => { pointerActive = true; const rect = showcase.getBoundingClientRect(); const x = (event.clientX - rect.left) / rect.width - .5; const y = (event.clientY - rect.top) / rect.height - .5; setTilt(y * -5, x * 7); });
  showcase.addEventListener('pointerleave', () => { pointerActive = false; });
  tick();
  window.addEventListener('pagehide', () => cancelAnimationFrame(frame), { once: true });
}

function setupFieldGallery() {
  const gallery = $('#fieldGallery');
  if (!gallery) return;
  const slides = $$('.gallery-slide', gallery);
  const thumbs = $$('.gallery-thumb', gallery);
  const dots = $('#galleryDots');
  const counter = $('#galleryCounter');
  const progress = $('#galleryProgress');
  const fallback = 'assets/brochure-985-spread.jpg';
  let active = 0;
  let timer;
  let progressTimer;

  gallery.querySelectorAll('img').forEach((image) => {
    image.addEventListener('error', () => {
      if (image.dataset.fallbackApplied) return;
      image.dataset.fallbackApplied = 'true';
      image.src = fallback;
    });
  });

  if (dots) {
    dots.innerHTML = slides.map((_, index) => `<button type="button" class="gallery-dot${index === 0 ? ' is-active' : ''}" data-gallery-dot="${index}" aria-label="Show field photo ${index + 1}" aria-pressed="${index === 0}"></button>`).join('');
  }

  const restartProgress = () => {
    if (!progress) return;
    progress.style.animation = 'none';
    progress.offsetHeight;
    progress.style.animation = 'gallery-progress 4.8s linear forwards';
  };

  const update = (next, announce = true) => {
    active = (next + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      const current = index === active;
      slide.classList.toggle('is-active', current);
      slide.setAttribute('aria-hidden', String(!current));
    });
    thumbs.forEach((thumb, index) => {
      const current = index === active;
      thumb.classList.toggle('is-active', current);
      thumb.setAttribute('aria-current', current ? 'true' : 'false');
    });
    $$('.gallery-dot', gallery).forEach((dot, index) => {
      const current = index === active;
      dot.classList.toggle('is-active', current);
      dot.setAttribute('aria-pressed', String(current));
    });
    if (counter) counter.textContent = `${String(active + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    if (announce) gallery.classList.add('is-updating');
    window.setTimeout(() => gallery.classList.remove('is-updating'), 420);
    restartProgress();
  };

  const restart = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => update(active + 1), 4800);
  };
  const go = (index) => { update(index); restart(); };

  thumbs.forEach((thumb, index) => thumb.addEventListener('click', () => go(index)));
  $$('.gallery-dot', gallery).forEach((dot, index) => dot.addEventListener('click', () => go(index)));
  $('[data-gallery-prev]', gallery)?.addEventListener('click', () => go(active - 1));
  $('[data-gallery-next]', gallery)?.addEventListener('click', () => go(active + 1));
  gallery.addEventListener('mouseenter', () => { window.clearInterval(timer); if (progress) progress.style.animationPlayState = 'paused'; });
  gallery.addEventListener('mouseleave', () => { restart(); if (progress) progress.style.animationPlayState = 'running'; });
  gallery.addEventListener('focusin', () => { window.clearInterval(timer); if (progress) progress.style.animationPlayState = 'paused'; });
  gallery.addEventListener('focusout', (event) => { if (!gallery.contains(event.relatedTarget)) { restart(); if (progress) progress.style.animationPlayState = 'running'; } });
  gallery.addEventListener('touchstart', () => { window.clearInterval(timer); if (progress) progress.style.animationPlayState = 'paused'; }, { passive: true });
  gallery.addEventListener('touchend', () => { restart(); if (progress) progress.style.animationPlayState = 'running'; }, { passive: true });
  update(0, false);
  restart();
  window.addEventListener('pagehide', () => { window.clearInterval(timer); window.clearTimeout(progressTimer); }, { once: true });
}

document.addEventListener('DOMContentLoaded', () => {
  $('#year').textContent = new Date().getFullYear();
  setTimeout(() => {
    $('#siteLoader')?.classList.add('is-hidden');
    document.body.classList.add('is-ready');
    if (typeof window.IntersectionObserver !== 'function') $$('.reveal').forEach((item) => item.classList.add('is-visible'));
    document.dispatchEvent(new Event('fieldcraft:ready'));
  }, 1250);
  setModel(currentModel); setupMobileNav(); setupReveal(); setupScrollPolish(); setupParallax(); setupFieldGallery(); setupVisitorGate(); setupDesk(); applyCustomAssets();
  trackEvent('page_view');
  $$('.fleet-tab').forEach((tab) => tab.addEventListener('click', () => setModel(tab.dataset.modelTab)));
  $('#bookingForm')?.addEventListener('submit', handleBookingSubmit);
  $('#quickBookingForm')?.addEventListener('submit', handleQuickBooking);
  $('#newBookingButton')?.addEventListener('click', () => { $('#bookingSuccess').hidden = true; $('#bookingForm').hidden = false; $('#bookingForm').reset(); });
  $('#machineBookButton')?.addEventListener('click', () => { $('#bookingForm [name="machine"]').value = `${MODELS[currentModel].name}`; });
});
