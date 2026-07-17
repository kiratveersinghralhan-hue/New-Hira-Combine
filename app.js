const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const CONTACT_PHONE = '919216107700';
const API_BASE = String(window.NEW_HIRA_API_BASE || '').replace(/\/$/, '');
const API_ROOT = API_BASE + '/api';
const SESSION_KEY = 'new_hira_session_v17';
const LEAD_GATE_KEY = 'new_hira_lead_gate_v17';
const PENDING_BOOKINGS_KEY = 'new_hira_pending_bookings_v17';
const ADMIN_TOKEN_KEY = 'new_hira_admin_session_v17';

const MODELS = {
  '985': {
    name: '985',
    image: 'assets/cutout-985-three-quarter.png',
    eyebrow: 'THE HIGH-CAPACITY WORKHORSE',
    description: 'Maximum yield in the shortest time, with a larger cutter bar, five straw walkers and an 1,800 kg wheat grain tank.',
    width: '4.4',
    tank: '1,800',
    walkers: '5',
    brochure: 'assets/brochure-985-specs.jpg',
    specs: [
      ['Effective cutter', '4.28 m'],
      ['Threshing drum', '1,258 mm'],
      ['Working width', '5,900 mm'],
      ['Fuel tank', '350 litre'],
      ['Ground clearance', '250 mm'],
      ['Wheel base', '3,600 mm']
    ]
  },
  '785': {
    name: '785',
    image: 'assets/cutout-785-brochure-model.png',
    eyebrow: 'THE AGILE FIELD FINISHER',
    description: 'A compact multicrop combine for smooth field access, small turning radius and dependable work across changing field conditions.',
    width: '3.7',
    tank: '1,600',
    walkers: '4',
    brochure: 'assets/brochure-785-specs.jpg',
    specs: [
      ['Effective cutter', '3.6 m'],
      ['Threshing drum', '1,015 mm'],
      ['Working width', '5,290 mm'],
      ['Fuel tank', '350 litre'],
      ['Ground clearance', '250 mm'],
      ['Wheel base', '3,600 mm']
    ]
  }
};

const adminState = {
  token: sessionStorage.getItem(ADMIN_TOKEN_KEY) || '',
  bookings: [],
  leads: [],
  media: [],
  page: 1,
  totalPages: 1,
  activeView: 'overview'
};

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function cleanPhone(value) {
  return String(value || '').replace(/\D/g, '').slice(-10);
}

function dateLabel(value) {
  if (!value) return 'Date not set';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

function timeLabel(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date);
}

function showToast(message, duration = 3600) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), duration);
}

function setModalState(open) {
  document.body.classList.toggle('modal-open', Boolean(open));
}

function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = 'SESSION-' + Date.now().toString(36).toUpperCase() + '-' + crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

async function api(path, options = {}, admin = false) {
  const requestOptions = { ...options };
  requestOptions.headers = { ...(options.headers || {}) };
  if (admin && adminState.token) requestOptions.headers.Authorization = 'Bearer ' + adminState.token;
  if (options.body && !(options.body instanceof FormData) && typeof options.body !== 'string') {
    requestOptions.headers['Content-Type'] = 'application/json';
    requestOptions.body = JSON.stringify(options.body);
  }
  const response = await fetch(API_ROOT + path, requestOptions);
  const payload = await response.json().catch(() => ({ ok: false, error: 'The service returned an unreadable response.' }));
  if (!response.ok || payload.ok === false) {
    const error = new Error(payload.error || 'Request failed.');
    error.status = response.status;
    throw error;
  }
  return payload;
}

function deviceType() {
  const width = window.innerWidth;
  if (width < 680) return 'mobile';
  if (width < 1100) return 'tablet';
  return 'desktop';
}

function trackEvent(name, metadata = {}) {
  const payload = {
    eventName: name,
    sessionId: getSessionId(),
    path: location.pathname,
    referrer: document.referrer || '',
    device: deviceType(),
    metadata
  };
  fetch(API_ROOT + '/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true
  }).catch(() => {});
}

function setupLoader() {
  const count = $('#loaderCount');
  let value = 0;
  const timer = window.setInterval(() => {
    value = Math.min(99, value + Math.ceil((100 - value) / 9));
    if (count) count.textContent = String(value).padStart(2, '0');
  }, 90);
  const finish = () => {
    window.clearInterval(timer);
    if (count) count.textContent = '100';
    window.setTimeout(() => {
      $('#siteLoader')?.classList.add('is-hidden');
      document.body.classList.add('is-ready');
      document.dispatchEvent(new Event('newhira:ready'));
    }, 220);
  };
  if (document.readyState === 'complete') window.setTimeout(finish, 950);
  else window.addEventListener('load', () => window.setTimeout(finish, 950), { once: true });
  window.setTimeout(finish, 2400);
}

function setupNavigation() {
  const toggle = $('#menuToggle');
  const nav = $('#siteNav');
  const scrim = $('#navScrim');
  const close = () => {
    toggle?.classList.remove('is-open');
    nav?.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
    if (scrim) scrim.hidden = true;
    document.body.classList.remove('nav-open');
  };
  toggle?.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    toggle.classList.toggle('is-open', open);
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (scrim) scrim.hidden = !open;
    document.body.classList.toggle('nav-open', open);
  });
  scrim?.addEventListener('click', close);
  $$('#siteNav a, #siteNav button').forEach((item) => item.addEventListener('click', close));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
}

function setupScrollEffects() {
  const root = document.documentElement;
  let frame = 0;
  const update = () => {
    const max = Math.max(1, root.scrollHeight - window.innerHeight);
    root.style.setProperty('--scroll-progress', Math.min(100, (window.scrollY / max) * 100) + '%');
    document.body.classList.toggle('is-scrolled', window.scrollY > 30);
    const field = $('.hero-field');
    if (field && window.innerWidth > 680) field.style.setProperty('--hero-shift', Math.min(70, window.scrollY * .12) + 'px');
    frame = 0;
  };
  const requestUpdate = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  update();
}

function setupReveal() {
  const items = $$('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .1, rootMargin: '0px 0px -8% 0px' });
  items.forEach((item, index) => {
    item.style.setProperty('--reveal-delay', Math.min(index % 4, 3) * 80 + 'ms');
    observer.observe(item);
  });
  window.setTimeout(() => {
    items.filter((item) => item.getBoundingClientRect().top < window.innerHeight).forEach((item) => item.classList.add('is-visible'));
  }, 1600);
}

function setupSectionAnalytics() {
  if (!('IntersectionObserver' in window)) return;
  const seen = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || seen.has(entry.target.id)) return;
      seen.add(entry.target.id);
      trackEvent('section_view', { section: entry.target.id });
    });
  }, { threshold: .42 });
  $$('main section[id]').forEach((section) => observer.observe(section));
}

function updateHero(model) {
  const data = MODELS[model];
  const product = $('#heroProduct');
  if (!data || !product) return;
  product.classList.add('is-changing');
  window.setTimeout(() => {
    $('#heroMachine').src = data.image;
    $('#heroMachine').alt = 'New Hira ' + data.name + ' combine harvester';
    $('.hero-model-code').textContent = data.name;
    $('#heroWidth').textContent = data.width + ' M';
    $('#heroTank').textContent = data.tank + ' KG';
    $$('[data-hero-model]').forEach((button) => {
      const active = button.dataset.heroModel === model;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    product.classList.remove('is-changing');
  }, 260);
  trackEvent('hero_model_change', { model });
}

function setupHero() {
  $$('[data-hero-model]').forEach((button) => button.addEventListener('click', () => updateHero(button.dataset.heroModel)));
  const product = $('#heroProduct');
  if (!product || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  product.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const rect = product.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    product.style.setProperty('--hero-x', x * 10 + 'px');
    product.style.setProperty('--hero-y', y * 8 + 'px');
    product.style.setProperty('--hero-ry', x * 5 - 3 + 'deg');
  });
  product.addEventListener('pointerleave', () => {
    product.style.setProperty('--hero-x', '0px');
    product.style.setProperty('--hero-y', '0px');
    product.style.setProperty('--hero-ry', '-3deg');
  });
}

function updateFleet(model, track = true) {
  const data = MODELS[model];
  const stage = $('#fleetStage');
  if (!data || !stage) return;
  stage.classList.add('is-changing');
  window.setTimeout(() => {
    $('#fleetImage').src = data.image;
    $('#fleetImage').alt = 'New Hira ' + data.name + ' combine harvester cutout';
    $('#fleetGiant').textContent = data.name;
    $('#fleetEyebrow').textContent = data.eyebrow;
    $('#fleetName').textContent = data.name;
    $('#fleetDescription').textContent = data.description;
    $('#fleetWidth').innerHTML = escapeHtml(data.width) + '<small>m</small>';
    $('#fleetTank').innerHTML = escapeHtml(data.tank) + '<small>kg</small>';
    $('#fleetWalkers').textContent = data.walkers;
    $('#fleetSpecList').innerHTML = data.specs.map((spec) => '<div><span>' + escapeHtml(spec[0]) + '</span><b>' + escapeHtml(spec[1]) + '</b></div>').join('');
    $('#fleetBook').dataset.machine = 'New Hira ' + data.name;
    $$('[data-model]').forEach((button) => {
      const active = button.dataset.model === model;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    });
    stage.dataset.model = model;
    stage.classList.remove('is-changing');
  }, 290);
  if (track) trackEvent('fleet_model_change', { model });
}

function setupFleet() {
  updateFleet('985', false);
  $$('[data-model]').forEach((button) => button.addEventListener('click', () => updateFleet(button.dataset.model)));
  $('#fleetBook')?.addEventListener('click', (event) => {
    const value = event.currentTarget.dataset.machine || 'New Hira 985';
    const radio = $('#bookingForm input[name="machine"][value="' + value + '"]');
    if (radio) radio.checked = true;
  });
  $('#viewBrochure')?.addEventListener('click', () => {
    const model = $('#fleetStage')?.dataset.model || '985';
    openBrochure(model);
  });
}

function openBrochure(model) {
  const data = MODELS[model] || MODELS['985'];
  $('#brochureImage').src = data.brochure;
  $('#brochureImage').alt = 'New Hira ' + data.name + ' technical brochure';
  $$('[data-brochure-model]').forEach((button) => button.classList.toggle('is-active', button.dataset.brochureModel === model));
  $('#brochureModal').hidden = false;
  setModalState(true);
}

function setupBrochure() {
  $$('[data-brochure-model]').forEach((button) => button.addEventListener('click', () => openBrochure(button.dataset.brochureModel)));
  const close = () => {
    $('#brochureModal').hidden = true;
    setModalState(false);
  };
  $('#brochureClose')?.addEventListener('click', close);
  $('#brochureModal')?.addEventListener('click', (event) => {
    if (event.target === $('#brochureModal')) close();
  });
}

function createPerspectiveCarousel(options) {
  const root = $(options.root);
  if (!root) return null;
  let items = $$(options.item, root);
  let active = 0;
  let timer = 0;
  let startX = 0;
  let deltaX = 0;
  let dragging = false;
  const getItems = () => {
    items = $$(options.item, root);
    return items;
  };
  const classes = ['is-active', 'is-prev', 'is-next', 'is-far-prev', 'is-far-next', 'is-hidden'];
  const update = (next, user = false) => {
    getItems();
    const length = items.length;
    if (!length) return;
    active = (next + length) % length;
    items.forEach((item, index) => {
      classes.forEach((className) => item.classList.remove(className));
      const offset = (index - active + length) % length;
      if (offset === 0) item.classList.add('is-active');
      else if (offset === 1) item.classList.add('is-next');
      else if (offset === length - 1) item.classList.add('is-prev');
      else if (offset === 2) item.classList.add('is-far-next');
      else if (offset === length - 2) item.classList.add('is-far-prev');
      else item.classList.add('is-hidden');
      item.setAttribute('aria-hidden', String(offset !== 0));
    });
    const counter = $(options.counter);
    if (counter) counter.textContent = String(active + 1).padStart(2, '0') + ' / ' + String(length).padStart(2, '0');
    if (options.dots) {
      const dots = $(options.dots);
      if (dots && dots.children.length !== length) {
        dots.innerHTML = items.map((item, index) => '<button type="button" data-carousel-dot="' + index + '" aria-label="Show item ' + (index + 1) + '"></button>').join('');
        $$('[data-carousel-dot]', dots).forEach((dot) => dot.addEventListener('click', () => go(Number(dot.dataset.carouselDot), true)));
      }
      $$('[data-carousel-dot]', dots).forEach((dot, index) => dot.classList.toggle('is-active', index === active));
    }
    if (options.progress) {
      const progress = $(options.progress);
      if (progress) {
        progress.style.animation = 'none';
        progress.offsetHeight;
        progress.style.animation = 'carousel-progress ' + (options.interval / 1000) + 's linear forwards';
      }
    }
    if (user) trackEvent(options.eventName || 'carousel_change', { index: active + 1 });
  };
  const stop = () => window.clearInterval(timer);
  const start = () => {
    stop();
    timer = window.setInterval(() => update(active + 1), options.interval);
  };
  const go = (index, user = false) => {
    update(index, user);
    start();
  };
  $(options.prev, root)?.addEventListener('click', () => go(active - 1, true));
  $(options.next, root)?.addEventListener('click', () => go(active + 1, true));
  root.addEventListener('click', (event) => {
    const item = event.target.closest(options.item);
    if (!item || item.classList.contains('is-active')) return;
    const index = getItems().indexOf(item);
    if (index >= 0) go(index, true);
  });
  root.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    dragging = true;
    startX = event.clientX;
    deltaX = 0;
    root.classList.add('is-dragging');
    root.setPointerCapture?.(event.pointerId);
    stop();
  });
  root.addEventListener('pointermove', (event) => {
    if (dragging) deltaX = event.clientX - startX;
  });
  const finish = (event) => {
    if (!dragging) return;
    dragging = false;
    root.classList.remove('is-dragging');
    root.releasePointerCapture?.(event.pointerId);
    if (Math.abs(deltaX) > 45) go(active + (deltaX < 0 ? 1 : -1), true);
    else start();
  };
  root.addEventListener('pointerup', finish);
  root.addEventListener('pointercancel', finish);
  root.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(active - 1, true);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(active + 1, true);
    }
  });
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', (event) => {
    if (!root.contains(event.relatedTarget)) start();
  });
  update(0);
  start();
  return { update, refresh: () => update(active), destroy: stop };
}

async function loadPublicMedia() {
  try {
    const data = await api('/media?active=1');
    const media = data.media || [];
    const hero = media.find((item) => item.slot === 'hero' && item.kind === 'image');
    const booking = media.find((item) => item.slot === 'booking' && item.kind === 'image');
    if (hero) {
      $('.hero-field').style.backgroundImage = 'linear-gradient(90deg, rgba(7,14,10,.95), rgba(7,14,10,.3)), url("' + hero.url.replaceAll('"', '') + '")';
    }
    if (booking) {
      $('#bookingBackdrop').style.backgroundImage = 'linear-gradient(90deg, rgba(6,13,9,.96), rgba(6,13,9,.55)), url("' + booking.url.replaceAll('"', '') + '")';
    }
    const gallery = media.filter((item) => item.slot === 'gallery').slice(0, 8);
    const stage = $('.field-reel-stage');
    gallery.forEach((item, offset) => {
      const figure = document.createElement('figure');
      figure.className = 'field-frame is-hidden';
      figure.dataset.fieldIndex = String($$('.field-frame', stage).length);
      const visual = item.kind === 'video' ? document.createElement('video') : document.createElement('img');
      visual.src = item.url;
      if (item.kind === 'video') {
        visual.muted = true;
        visual.loop = true;
        visual.playsInline = true;
        visual.autoplay = true;
      } else {
        visual.alt = item.alt || item.title || 'New Hira campaign image';
      }
      const caption = document.createElement('figcaption');
      caption.innerHTML = '<span>CAMPAIGN / ' + String(offset + 1).padStart(2, '0') + '</span><b>' + escapeHtml(item.title || 'Field update') + '</b>';
      figure.append(visual, caption);
      stage.appendChild(figure);
    });
  } catch (error) {
    /* Static GitHub preview: built-in imagery remains available. */
  }
}

function setupCarousels() {
  createPerspectiveCarousel({
    root: '#depthCarousel',
    item: '.depth-card',
    prev: '[data-depth-prev]',
    next: '[data-depth-next]',
    counter: '#depthCounter',
    progress: '#depthProgress',
    interval: 5600,
    eventName: 'product_carousel_change'
  });
  createPerspectiveCarousel({
    root: '#fieldReel',
    item: '.field-frame',
    prev: '[data-field-prev]',
    next: '[data-field-next]',
    counter: '#fieldCounter',
    dots: '#fieldDots',
    interval: 6200,
    eventName: 'field_carousel_change'
  });
}

let bookingStep = 0;

function showBookingStep(index) {
  const steps = $$('.booking-step');
  bookingStep = Math.max(0, Math.min(steps.length - 1, index));
  steps.forEach((step, stepIndex) => {
    const active = stepIndex === bookingStep;
    step.hidden = !active;
    step.classList.toggle('is-active', active);
  });
  $$('.booking-stepper i').forEach((item, itemIndex) => item.classList.toggle('is-active', itemIndex <= bookingStep));
  $('#bookingStepLabel').textContent = 'STEP ' + String(bookingStep + 1).padStart(2, '0') + ' OF 03';
  trackEvent('booking_step_view', { step: bookingStep + 1 });
}

function validateStep(step) {
  const fields = $$('input, select, textarea', step).filter((field) => !field.disabled);
  for (const field of fields) {
    if (!field.checkValidity()) {
      field.reportValidity();
      field.focus();
      return false;
    }
    if (field.name === 'phone' && cleanPhone(field.value).length !== 10) {
      field.setCustomValidity('Enter a valid 10-digit mobile number.');
      field.reportValidity();
      field.addEventListener('input', () => field.setCustomValidity(''), { once: true });
      return false;
    }
  }
  return true;
}

function bookingMessage(booking) {
  return [
    'NEW HIRA HARVEST BOOKING',
    '',
    'Reference: ' + booking.reference,
    'Name: ' + booking.name,
    'Phone: ' + booking.phone,
    'Village: ' + booking.village,
    'District / town: ' + booking.location,
    'Crop: ' + booking.crop,
    'Approx. acreage: ' + booking.acreage,
    'Preferred date: ' + dateLabel(booking.date),
    'Date flexibility: ' + booking.flexibility,
    'Field access: ' + booking.access,
    'Machine: ' + booking.machine,
    booking.notes ? 'Notes: ' + booking.notes : '',
    '',
    'Please confirm machine availability and the harvest window.'
  ].filter(Boolean).join('\n');
}

function savePendingBooking(booking) {
  const current = JSON.parse(localStorage.getItem(PENDING_BOOKINGS_KEY) || '[]');
  current.unshift(booking);
  localStorage.setItem(PENDING_BOOKINGS_KEY, JSON.stringify(current.slice(0, 20)));
}

async function submitBooking(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const finalStep = $('.booking-step[data-booking-step="2"]');
  if (!validateStep(finalStep)) return;
  const submit = $('#bookingSubmit');
  submit.disabled = true;
  submit.textContent = 'Sending reservation...';
  const values = Object.fromEntries(new FormData(form).entries());
  values.phone = cleanPhone(values.phone);
  values.source = 'website';
  let booking;
  let shared = true;
  try {
    const response = await api('/bookings', { method: 'POST', body: values });
    booking = response.booking;
  } catch (error) {
    shared = false;
    booking = {
      ...values,
      id: 'LOCAL-' + Date.now().toString(36).toUpperCase(),
      reference: 'NH-' + new Date().toISOString().slice(2, 10).replaceAll('-', '') + '-' + String(Date.now()).slice(-4),
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    savePendingBooking(booking);
  }
  $('#bookingForm').hidden = true;
  $('#bookingSuccess').hidden = false;
  $('#bookingReference').textContent = booking.reference;
  $('#bookingSuccessCopy').textContent = shared
    ? 'The request is saved in the private booking desk. Confirm once on WhatsApp so the team can reply in the same conversation.'
    : 'The Cloudflare booking service is not connected on this host yet. Your request is prepared locally; send it on WhatsApp to reach the desk now.';
  $('#bookingWhatsApp').href = 'https://wa.me/' + CONTACT_PHONE + '?text=' + encodeURIComponent(bookingMessage(booking));
  trackEvent('booking_submitted', { crop: booking.crop, machine: booking.machine, shared });
  showToast(shared ? 'Reservation saved. Reference ' + booking.reference : 'Reservation prepared. Please finish on WhatsApp.');
  submit.disabled = false;
  submit.innerHTML = 'Send reservation <b>&nearr;</b>';
}

function setupBooking() {
  const form = $('#bookingForm');
  if (!form) return;
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const dateField = form.elements.date;
  if (dateField) dateField.min = today.toISOString().slice(0, 10);
  $$('[data-booking-next]').forEach((button) => button.addEventListener('click', () => {
    const step = button.closest('.booking-step');
    if (!validateStep(step)) return;
    showBookingStep(bookingStep + 1);
  }));
  $$('[data-booking-prev]').forEach((button) => button.addEventListener('click', () => showBookingStep(bookingStep - 1)));
  form.addEventListener('submit', submitBooking);
  $('#newBookingButton')?.addEventListener('click', () => {
    form.reset();
    $('#bookingSuccess').hidden = true;
    form.hidden = false;
    showBookingStep(0);
  });
  $('#quickBookingForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    form.elements.name.value = values.name || '';
    form.elements.location.value = values.location || '';
    form.elements.crop.value = values.crop || '';
    showBookingStep(0);
    $('#booking').scrollIntoView({ behavior: 'smooth' });
    trackEvent('quick_booking_started', { crop: values.crop });
  });
  showBookingStep(0);
}

function setupLeadGate() {
  const modal = $('#leadModal');
  if (!modal) return;
  const close = (reason) => {
    modal.hidden = true;
    setModalState(false);
    localStorage.setItem(LEAD_GATE_KEY, String(Date.now()));
    if (reason) trackEvent(reason);
  };
  const lastSeen = Number(localStorage.getItem(LEAD_GATE_KEY) || 0);
  const shouldShow = !lastSeen || Date.now() - lastSeen > 7 * 24 * 60 * 60 * 1000;
  if (shouldShow) {
    window.setTimeout(() => {
      if (document.body.classList.contains('modal-open')) return;
      modal.hidden = false;
      setModalState(true);
      trackEvent('lead_gate_shown');
    }, 5200);
  }
  $('#leadClose')?.addEventListener('click', () => close('lead_gate_closed'));
  $('#leadSkip')?.addEventListener('click', () => close('lead_gate_skipped'));
  modal.addEventListener('click', (event) => {
    if (event.target === modal) close('lead_gate_closed');
  });
  $('#leadForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    values.phone = cleanPhone(values.phone);
    values.source = 'welcome_registration';
    if (values.phone.length !== 10) {
      form.elements.phone.setCustomValidity('Enter a valid 10-digit mobile number.');
      form.elements.phone.reportValidity();
      form.elements.phone.addEventListener('input', () => form.elements.phone.setCustomValidity(''), { once: true });
      return;
    }
    const button = $('button[type="submit"]', form);
    button.disabled = true;
    button.textContent = 'Registering...';
    try {
      await api('/leads', { method: 'POST', body: values });
      showToast('Registration saved. The booking desk can now contact you.');
    } catch (error) {
      showToast('Registration service is not connected yet. Please use the booking form or WhatsApp.');
    }
    trackEvent('lead_submitted', { interest: values.interest });
    button.disabled = false;
    button.innerHTML = 'Register my interest <span>&nearr;</span>';
    close();
  });
}

function openDesk() {
  $('#deskModal').hidden = false;
  setModalState(true);
  checkBackend();
  if (adminState.token) enterDesk();
}

function closeDesk() {
  $('#deskModal').hidden = true;
  setModalState(false);
}

async function checkBackend() {
  const status = $('#deskBackendStatus');
  if (!status) return;
  try {
    await api('/health');
    status.textContent = 'Secure Cloudflare service online.';
  } catch (error) {
    status.textContent = 'Cloudflare backend not connected on this preview. Follow the included deployment guide to activate the owner desk.';
  }
}

async function adminApi(path, options = {}) {
  try {
    return await api(path, options, true);
  } catch (error) {
    if (error.status === 401) {
      adminState.token = '';
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
      $('#deskGate').hidden = false;
      $('#deskApp').hidden = true;
      showToast('Owner session expired. Enter the PIN again.');
    }
    throw error;
  }
}

async function enterDesk() {
  $('#deskGate').hidden = true;
  $('#deskApp').hidden = false;
  $('#deskToday').textContent = new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).format(new Date()).toUpperCase();
  switchAdminView(adminState.activeView);
}

async function loginDesk(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const button = $('button[type="submit"]', form);
  button.disabled = true;
  button.textContent = 'Verifying...';
  try {
    const response = await api('/admin/login', { method: 'POST', body: { pin: $('#deskPin').value } });
    adminState.token = response.token;
    sessionStorage.setItem(ADMIN_TOKEN_KEY, response.token);
    form.reset();
    await enterDesk();
    showToast('Owner desk unlocked.');
  } catch (error) {
    showToast(error.message || 'Owner authentication failed.');
    $('#deskPin').focus();
  } finally {
    button.disabled = false;
    button.innerHTML = 'Open operations <span>&nearr;</span>';
  }
}

function switchAdminView(view) {
  adminState.activeView = view;
  $$('[data-admin-tab]').forEach((button) => button.classList.toggle('is-active', button.dataset.adminTab === view));
  $$('[data-admin-view]').forEach((section) => {
    const active = section.dataset.adminView === view;
    section.hidden = !active;
    section.classList.toggle('is-active', active);
  });
  if (view === 'overview') loadOverview();
  if (view === 'bookings') loadBookings();
  if (view === 'leads') loadLeads();
  if (view === 'media') loadMedia();
}

function renderOverview(data) {
  const summary = data.summary || {};
  $('#metricBookings').textContent = summary.bookings || 0;
  $('#metricToday').textContent = (summary.todayBookings || 0) + ' today';
  $('#metricNew').textContent = summary.newBookings || 0;
  $('#metricLeads').textContent = summary.leads || 0;
  $('#metricVisits').textContent = summary.visits7d || 0;
  $('#sidebarBookingCount').textContent = summary.newBookings || 0;
  $('#sidebarLeadCount').textContent = summary.leads || 0;

  const activity = data.activity || [];
  const max = Math.max(1, ...activity.map((item) => Math.max(item.visits || 0, item.bookingStarts || 0)));
  $('#activityChart').innerHTML = activity.map((item) => {
    const visits = Math.max(2, ((item.visits || 0) / max) * 100);
    const starts = Math.max(2, ((item.bookingStarts || 0) / max) * 100);
    return '<div class="activity-day"><div class="activity-bars"><i style="height:' + visits + '%" title="' + escapeHtml(item.visits) + ' visits"></i><i style="height:' + starts + '%" title="' + escapeHtml(item.bookingStarts) + ' booking starts"></i></div><span>' + escapeHtml(item.label) + '</span></div>';
  }).join('');

  const crops = data.topCrops || [];
  const cropMax = Math.max(1, ...crops.map((item) => item.count || 0));
  $('#cropRank').innerHTML = crops.length ? crops.map((item) => '<div class="rank-item"><span>' + escapeHtml(item.crop) + '</span><b>' + escapeHtml(item.count) + '</b><i style="--rank-width:' + ((item.count / cropMax) * 100) + '%"></i></div>').join('') : '<div class="board-empty">Crop demand will appear after bookings arrive.</div>';

  const devices = data.devices || [];
  const totalDevices = Math.max(1, devices.reduce((total, item) => total + Number(item.count || 0), 0));
  const mobileCount = devices.filter((item) => item.device === 'mobile').reduce((total, item) => total + Number(item.count || 0), 0);
  const mobilePercent = Math.round((mobileCount / totalDevices) * 100);
  $('#deviceMix').innerHTML = '<div class="device-ring" style="--mobile:' + mobilePercent + '%"><b>' + mobilePercent + '%</b><span>MOBILE</span></div>';

  const recent = data.recentBookings || [];
  $('#recentBookings').innerHTML = recent.length ? recent.map((booking) => '<article class="recent-row"><div><b>' + escapeHtml(booking.name) + '</b><small>' + escapeHtml(booking.phone) + '</small></div><div><b>' + escapeHtml(booking.village || booking.location) + '</b><small>' + escapeHtml(booking.crop) + ' / ' + escapeHtml(booking.acreage || '-') + ' acres</small></div><div><span class="status-pill status-' + escapeHtml(booking.status) + '">' + escapeHtml(booking.status) + '</span></div><small>' + escapeHtml(timeLabel(booking.createdAt)) + '</small></article>').join('') : '<div class="board-empty">New booking requests will appear here.</div>';
}

async function loadOverview() {
  try {
    const data = await adminApi('/admin/overview');
    renderOverview(data);
  } catch (error) {
    if (error.status !== 401) showToast('Could not load overview: ' + error.message);
  }
}

function renderBookings(bookings) {
  const board = $('#bookingBoard');
  if (!bookings.length) {
    board.innerHTML = '<div class="board-empty">No bookings match this filter.</div>';
    return;
  }
  board.innerHTML = bookings.map((booking) => {
    const phone = cleanPhone(booking.phone);
    return '<article class="booking-row" data-booking-id="' + escapeHtml(booking.id) + '"><div><b>' + escapeHtml(booking.name) + '</b><small>' + escapeHtml(booking.reference) + ' / ' + escapeHtml(booking.phone) + '</small></div><div><b>' + escapeHtml(booking.village || '-') + ', ' + escapeHtml(booking.location || '-') + '</b><small>' + escapeHtml(booking.crop) + ' / ' + escapeHtml(booking.acreage || '-') + ' acres / ' + escapeHtml(dateLabel(booking.date)) + '</small></div><div><b>' + escapeHtml(booking.machine || 'Help me choose') + '</b><small>' + escapeHtml(booking.source || 'website') + '</small></div><div><select data-booking-status aria-label="Booking status"><option value="new"' + (booking.status === 'new' ? ' selected' : '') + '>New</option><option value="contacted"' + (booking.status === 'contacted' ? ' selected' : '') + '>Contacted</option><option value="confirmed"' + (booking.status === 'confirmed' ? ' selected' : '') + '>Confirmed</option><option value="completed"' + (booking.status === 'completed' ? ' selected' : '') + '>Completed</option><option value="cancelled"' + (booking.status === 'cancelled' ? ' selected' : '') + '>Cancelled</option></select><small>' + escapeHtml(timeLabel(booking.createdAt)) + '</small></div><div class="row-actions"><a href="https://wa.me/91' + escapeHtml(phone) + '" target="_blank" rel="noopener" title="WhatsApp">W</a><button type="button" data-delete-booking title="Delete booking">&times;</button></div></article>';
  }).join('');
}

async function loadBookings() {
  const status = $('#bookingFilter')?.value || 'all';
  const query = $('#bookingSearch')?.value || '';
  const params = new URLSearchParams({ page: String(adminState.page), limit: '30' });
  if (status !== 'all') params.set('status', status);
  if (query) params.set('q', query);
  try {
    const data = await adminApi('/admin/bookings?' + params.toString());
    adminState.bookings = data.bookings || [];
    adminState.totalPages = data.totalPages || 1;
    renderBookings(adminState.bookings);
    $('#bookingsPage').textContent = 'Page ' + adminState.page + ' of ' + adminState.totalPages;
    $('#bookingsPrev').disabled = adminState.page <= 1;
    $('#bookingsNext').disabled = adminState.page >= adminState.totalPages;
  } catch (error) {
    if (error.status !== 401) showToast('Could not load bookings: ' + error.message);
  }
}

async function updateBookingStatus(id, status) {
  try {
    await adminApi('/admin/bookings/' + encodeURIComponent(id), { method: 'PATCH', body: { status } });
    showToast('Booking moved to ' + status + '.');
    loadBookings();
    loadOverview();
  } catch (error) {
    showToast('Status update failed: ' + error.message);
  }
}

async function deleteBooking(id) {
  if (!window.confirm('Delete this booking permanently?')) return;
  try {
    await adminApi('/admin/bookings/' + encodeURIComponent(id), { method: 'DELETE' });
    showToast('Booking deleted.');
    loadBookings();
    loadOverview();
  } catch (error) {
    showToast('Delete failed: ' + error.message);
  }
}

async function loadLeads() {
  try {
    const data = await adminApi('/admin/leads?limit=200');
    adminState.leads = data.leads || [];
    const board = $('#leadBoard');
    board.innerHTML = adminState.leads.length ? adminState.leads.map((lead) => {
      const phone = cleanPhone(lead.phone);
      return '<article class="lead-row"><span class="lead-avatar">' + escapeHtml((lead.name || 'L').slice(0, 1).toUpperCase()) + '</span><div><b>' + escapeHtml(lead.name) + '</b><small>' + escapeHtml(lead.phone) + ' / ' + escapeHtml(lead.location || 'Location not shared') + '</small></div><div><b>' + escapeHtml(lead.interest || 'Harvest booking') + '</b><small>' + escapeHtml(lead.source || 'website') + '</small></div><div><b>' + escapeHtml(lead.status || 'new') + '</b><small>' + escapeHtml(timeLabel(lead.createdAt)) + '</small></div><a href="https://wa.me/91' + escapeHtml(phone) + '" target="_blank" rel="noopener">WHATSAPP &nearr;</a></article>';
    }).join('') : '<div class="board-empty">No visitor has registered contact details yet.</div>';
    $('#sidebarLeadCount').textContent = adminState.leads.length;
  } catch (error) {
    if (error.status !== 401) showToast('Could not load leads: ' + error.message);
  }
}

function mediaVisual(item) {
  if (item.kind === 'video') return '<video src="' + escapeHtml(item.url) + '" muted playsinline></video>';
  return '<img src="' + escapeHtml(item.url) + '" alt="' + escapeHtml(item.alt || item.title) + '" />';
}

function renderMedia() {
  const library = $('#mediaLibrary');
  library.innerHTML = adminState.media.length ? adminState.media.map((item) => '<article class="media-card" data-media-id="' + escapeHtml(item.id) + '"><figure>' + mediaVisual(item) + '<span>' + escapeHtml(item.slot) + '</span></figure><div><b>' + escapeHtml(item.title) + '</b><small>' + escapeHtml(item.kind) + ' / ' + (item.active ? 'published' : 'hidden') + '</small><div class="media-actions"><button type="button" data-edit-media>Edit</button><button type="button" data-toggle-media="' + (item.active ? '0' : '1') + '">' + (item.active ? 'Hide' : 'Publish') + '</button><button type="button" data-delete-media>Delete</button></div><div class="media-editor" hidden><input data-media-title value="' + escapeHtml(item.title) + '" maxlength="100" aria-label="Media title" /><input data-media-alt value="' + escapeHtml(item.alt || '') + '" maxlength="180" aria-label="Media description" placeholder="Description / alt text" /><select data-media-slot aria-label="Media placement"><option value="gallery"' + (item.slot === 'gallery' ? ' selected' : '') + '>Campaign gallery</option><option value="hero"' + (item.slot === 'hero' ? ' selected' : '') + '>Hero background</option><option value="booking"' + (item.slot === 'booking' ? ' selected' : '') + '>Booking backdrop</option></select><button type="button" data-save-media>Save changes</button></div></div></article>').join('') : '<div class="board-empty">No uploaded campaign media yet. Built-in website assets remain active.</div>';
}

async function loadMedia() {
  try {
    const data = await adminApi('/admin/media');
    adminState.media = data.media || [];
    renderMedia();
  } catch (error) {
    if (error.status !== 401) showToast('Could not load media: ' + error.message);
  }
}

async function uploadMedia(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const button = $('button[type="submit"]', form);
  const file = form.elements.file.files[0];
  if (!file) return;
  if (file.size > 20 * 1024 * 1024) {
    showToast('Please choose a file smaller than 20 MB.');
    return;
  }
  const body = new FormData(form);
  body.set('active', form.elements.active.checked ? '1' : '0');
  button.disabled = true;
  button.textContent = 'Uploading...';
  try {
    await adminApi('/admin/media', { method: 'POST', body });
    form.reset();
    form.elements.active.checked = true;
    showToast('Campaign asset uploaded.');
    loadMedia();
  } catch (error) {
    showToast('Upload failed: ' + error.message);
  } finally {
    button.disabled = false;
    button.innerHTML = 'Upload to library <span>&uarr;</span>';
  }
}

async function toggleMedia(id, active) {
  try {
    await adminApi('/admin/media/' + encodeURIComponent(id), { method: 'PATCH', body: { active } });
    showToast(active ? 'Asset published.' : 'Asset hidden.');
    loadMedia();
  } catch (error) {
    showToast('Media update failed: ' + error.message);
  }
}

async function updateMediaDetails(card) {
  const id = card.dataset.mediaId;
  const body = {
    title: $('[data-media-title]', card).value,
    alt: $('[data-media-alt]', card).value,
    slot: $('[data-media-slot]', card).value
  };
  if (!body.title.trim()) {
    showToast('Media title cannot be empty.');
    return;
  }
  try {
    await adminApi('/admin/media/' + encodeURIComponent(id), { method: 'PATCH', body });
    showToast('Media details updated.');
    loadMedia();
  } catch (error) {
    showToast('Media edit failed: ' + error.message);
  }
}

async function deleteMedia(id) {
  if (!window.confirm('Delete this media file from Cloudflare storage?')) return;
  try {
    await adminApi('/admin/media/' + encodeURIComponent(id), { method: 'DELETE' });
    showToast('Media file deleted.');
    loadMedia();
  } catch (error) {
    showToast('Media delete failed: ' + error.message);
  }
}

async function createAdminBooking(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const values = Object.fromEntries(new FormData(form).entries());
  values.phone = cleanPhone(values.phone);
  values.source = 'owner_desk';
  try {
    await adminApi('/admin/bookings', { method: 'POST', body: values });
    form.reset();
    $('#adminAddPanel').hidden = true;
    showToast('Booking added to the shared board.');
    loadBookings();
    loadOverview();
  } catch (error) {
    showToast('Could not add booking: ' + error.message);
  }
}

async function exportBookings() {
  try {
    const data = await adminApi('/admin/bookings?limit=1000&page=1');
    const rows = data.bookings || [];
    const columns = ['reference', 'createdAt', 'status', 'name', 'phone', 'village', 'location', 'crop', 'acreage', 'date', 'machine', 'source', 'notes'];
    const quote = (value) => '"' + String(value == null ? '' : value).replaceAll('"', '""') + '"';
    const csv = [columns.join(',')].concat(rows.map((row) => columns.map((column) => quote(row[column])).join(','))).join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    link.download = 'new-hira-bookings-' + new Date().toISOString().slice(0, 10) + '.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    showToast('Export failed: ' + error.message);
  }
}

function setupDesk() {
  $$('[data-open-desk]').forEach((button) => button.addEventListener('click', openDesk));
  $('#deskClose')?.addEventListener('click', closeDesk);
  $('#deskModal')?.addEventListener('click', (event) => {
    if (event.target === $('#deskModal')) closeDesk();
  });
  $('#deskLoginForm')?.addEventListener('submit', loginDesk);
  $('#deskLogout')?.addEventListener('click', () => {
    adminState.token = '';
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    $('#deskApp').hidden = true;
    $('#deskGate').hidden = false;
    showToast('Signed out of owner desk.');
  });
  $$('[data-admin-tab]').forEach((button) => button.addEventListener('click', () => switchAdminView(button.dataset.adminTab)));
  $$('[data-jump-admin]').forEach((button) => button.addEventListener('click', () => switchAdminView(button.dataset.jumpAdmin)));
  $$('[data-admin-refresh]').forEach((button) => button.addEventListener('click', () => switchAdminView(adminState.activeView)));
  $('#adminAddToggle')?.addEventListener('click', () => {
    switchAdminView('bookings');
    $('#adminAddPanel').hidden = !$('#adminAddPanel').hidden;
  });
  $('#adminBookingForm')?.addEventListener('submit', createAdminBooking);
  $('#bookingFilter')?.addEventListener('change', () => {
    adminState.page = 1;
    loadBookings();
  });
  let searchTimer = 0;
  $('#bookingSearch')?.addEventListener('input', () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      adminState.page = 1;
      loadBookings();
    }, 350);
  });
  $('#bookingsPrev')?.addEventListener('click', () => {
    if (adminState.page > 1) {
      adminState.page -= 1;
      loadBookings();
    }
  });
  $('#bookingsNext')?.addEventListener('click', () => {
    if (adminState.page < adminState.totalPages) {
      adminState.page += 1;
      loadBookings();
    }
  });
  $('#bookingBoard')?.addEventListener('change', (event) => {
    const select = event.target.closest('[data-booking-status]');
    if (!select) return;
    const row = select.closest('[data-booking-id]');
    updateBookingStatus(row.dataset.bookingId, select.value);
  });
  $('#bookingBoard')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-delete-booking]');
    if (!button) return;
    deleteBooking(button.closest('[data-booking-id]').dataset.bookingId);
  });
  $('#exportBookings')?.addEventListener('click', exportBookings);
  $('#mediaForm')?.addEventListener('submit', uploadMedia);
  $('#mediaLibrary')?.addEventListener('click', (event) => {
    const card = event.target.closest('[data-media-id]');
    if (!card) return;
    const edit = event.target.closest('[data-edit-media]');
    const save = event.target.closest('[data-save-media]');
    const toggle = event.target.closest('[data-toggle-media]');
    const remove = event.target.closest('[data-delete-media]');
    if (edit) {
      const editor = $('.media-editor', card);
      editor.hidden = !editor.hidden;
    }
    if (save) updateMediaDetails(card);
    if (toggle) toggleMedia(card.dataset.mediaId, toggle.dataset.toggleMedia === '1');
    if (remove) deleteMedia(card.dataset.mediaId);
  });
}

function setupGlobalEscape() {
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (!$('#brochureModal').hidden) {
      $('#brochureModal').hidden = true;
      setModalState(false);
    } else if (!$('#leadModal').hidden) {
      $('#leadModal').hidden = true;
      localStorage.setItem(LEAD_GATE_KEY, String(Date.now()));
      setModalState(false);
    } else if (!$('#deskModal').hidden) {
      closeDesk();
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  setupLoader();
  $('#year').textContent = new Date().getFullYear();
  setupNavigation();
  setupScrollEffects();
  setupReveal();
  setupSectionAnalytics();
  setupHero();
  setupFleet();
  setupBrochure();
  setupBooking();
  setupLeadGate();
  setupDesk();
  setupGlobalEscape();
  await loadPublicMedia();
  setupCarousels();
  trackEvent('page_view', { title: document.title });
});
