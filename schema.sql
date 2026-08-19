CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  source TEXT NOT NULL DEFAULT 'website',
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  village TEXT NOT NULL,
  location TEXT NOT NULL,
  crop TEXT NOT NULL,
  acreage REAL,
  preferred_date TEXT,
  flexibility TEXT,
  access TEXT,
  machine TEXT,
  notes TEXT,
  consent INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_crop ON bookings(crop);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON bookings(phone);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  source TEXT NOT NULL DEFAULT 'website',
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT,
  interest TEXT,
  consent INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  event_name TEXT NOT NULL,
  session_id TEXT,
  path TEXT,
  referrer TEXT,
  device TEXT,
  created_at TEXT NOT NULL,
  metadata TEXT NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_name ON events(event_name);
CREATE INDEX IF NOT EXISTS idx_events_session ON events(session_id);

CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  object_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  alt_text TEXT,
  slot TEXT NOT NULL DEFAULT 'gallery',
  kind TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_media_slot_active ON media(slot, active);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at DESC);

CREATE TABLE IF NOT EXISTS request_limits (
  limit_key TEXT PRIMARY KEY,
  hits INTEGER NOT NULL,
  window_started_at TEXT NOT NULL
);
