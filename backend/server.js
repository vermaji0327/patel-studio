/**
 * server.js — complete backend (updated)
 * - upload.any() to accept files with names like "files" or "files[]"
 * - serves frontend static files + uploads
 * - gallery normalization to match timestamped stored filenames
 * - server-side zip, QR generation, admin bookings endpoint
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const QRCode = require('qrcode');
const archiver = require('archiver');

const PORT = process.env.PORT || 5000;
const ADMIN_KEY = process.env.ADMIN_KEY || 'admin-secret';

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// Relaxed CSP + CORS middleware (development). Adjust for production.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-ADMIN-KEY, X-Requested-With');
  res.setHeader('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval' data:; img-src * data:;");
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// serve frontend static files (gallery.html, upload.html, booking.html etc.)
app.use(express.static(path.join(__dirname, 'frontend')));

// ensure uploads folder
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);
app.use('/uploads', express.static(UPLOAD_DIR));

// multer storage (store with timestamp prefix to avoid collisions)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_'))
});
const upload = multer({ storage });

// sqlite DB
const DB_FILE = path.join(__dirname, 'data.db');
const db = new sqlite3.Database(DB_FILE);

// create tables if not exists
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS bookings (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, phone TEXT, email TEXT, package_name TEXT, date TEXT, time_slot TEXT, qr_token TEXT UNIQUE, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)');
  db.run('CREATE TABLE IF NOT EXISTS galleries (token TEXT PRIMARY KEY, photos TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS photos (id INTEGER PRIMARY KEY AUTOINCREMENT, gallery_token TEXT, filename TEXT, filepath TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)');
});
console.log('📌 SQLite DB ready:', DB_FILE);

// helper: build absolute URL for uploaded file (respects proxies/ngrok forwarded headers)
function absoluteFileUrl(req, filename) {
  const proto = req.headers['x-forwarded-proto'] || req.protocol;
  const forwardedHost = req.headers['x-forwarded-host'] || req.headers['x-forwarded-server'];
  const host = forwardedHost || req.get('host');
  return `${proto}://${host}/uploads/${encodeURIComponent(filename)}`;
}

/**
 * Find stored filename on disk.
 * If `original` exists as-is in uploads => return it.
 * Otherwise search uploads for a file that endsWith(original) and return that stored filename.
 * Returns null if not found.
 */
function findStoredFilename(original) {
  if (!original) return null;
  const asIsPath = path.join(UPLOAD_DIR, original);
  if (fs.existsSync(asIsPath)) return original;

  try {
    const files = fs.readdirSync(UPLOAD_DIR);
    for (const f of files) {
      if (f === original) return f;
      if (f.endsWith('-' + original) || f.endsWith(original)) return f;
    }
  } catch (e) {
    console.error('findStoredFilename read uploads error', e.message);
  }
  return null;
}

/**
 * Normalize any stored gallery entry (string or object or url) to:
 * { displayName: <originalFilenameWithoutTimestamp>, storedFilename: <actual file on disk> }
 * or null if nothing found.
 */
function normalizeStoredItem(item) {
  if (!item) return null;

  if (typeof item === 'string') {
    const stored = findStoredFilename(item);
    if (stored) return { displayName: item, storedFilename: stored };
    const storedAsIs = findStoredFilename(item);
    if (storedAsIs) return { displayName: item.includes('-') ? item.split('-').slice(1).join('-') : item, storedFilename: storedAsIs };
    return null;
  }

  if (typeof item === 'object') {
    const orig = item.filename || null;
    if (orig) {
      const stored = findStoredFilename(orig);
      if (stored) return { displayName: orig, storedFilename: stored };
    }
    if (item.url) {
      try {
        const u = new URL(item.url);
        const base = decodeURIComponent(path.basename(u.pathname));
        const storedFromUrl = findStoredFilename(base) || base;
        if (storedFromUrl && fs.existsSync(path.join(UPLOAD_DIR, storedFromUrl))) {
          const display = base.includes('-') ? base.split('-').slice(1).join('-') : base;
          return { displayName: item.filename || display, storedFilename: storedFromUrl };
        }
      } catch (e) {}
    }
  }

  return null;
}

// -----------------------
// ROUTES
// -----------------------

// create booking
app.post('/api/bookings', (req, res) => {
  const { name, phone, email, packageName, date, timeSlot } = req.body || {};
  if (!name) return res.status(400).json({ error: 'name required' });

  const qrToken = Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  const sql = 'INSERT INTO bookings (name, phone, email, package_name, date, time_slot, qr_token) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.run(sql, [name, phone || '', email || '', packageName || '', date || '', timeSlot || '', qrToken], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    const bookingId = this.lastID;
    db.run('INSERT OR REPLACE INTO galleries (token, photos) VALUES (?, ?)', [qrToken, JSON.stringify([])], (e) => { if (e) console.error('gallery insert err', e.message); });
    const galleryUrl = `${req.protocol}://${req.get('host')}/gallery.html?token=${qrToken}`;
    res.json({ bookingId, qrToken, url: galleryUrl });
  });
});

// upload files (attach to gallery token) - accept any file field (files, files[], etc)
app.post('/api/upload', upload.any(), (req, res) => {
  try {
    const token = req.body.token;
    if (!token) return res.status(400).json({ error: 'token required' });
    const files = req.files || [];
    if (!files.length) return res.status(400).json({ error: 'No files uploaded' });

    db.get('SELECT photos FROM galleries WHERE token = ?', [token], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      let current = [];
      if (row && row.photos) {
        try { current = JSON.parse(row.photos); } catch (e) { current = []; }
      }

      const added = [];
      const insertPhoto = db.prepare('INSERT INTO photos (gallery_token, filename, filepath) VALUES (?, ?, ?)');
      for (const f of files) {
        const filename = f.filename; // stored filename on disk (with timestamp prefix)
        const filepath = path.join(UPLOAD_DIR, filename);
        insertPhoto.run(token, f.originalname, filepath);
        const url = absoluteFileUrl(req, filename);
        added.push({ filename: f.originalname, url });
        current.push(f.originalname);
      }
      insertPhoto.finalize();

      db.run('INSERT OR REPLACE INTO galleries (token, photos) VALUES (?, ?)', [token, JSON.stringify(current)], (er) => {
        if (er) console.error('galleries update err', er.message);
      });

      res.json({ token, photos: added });
    });

  } catch (err) {
    console.error('upload error', err);
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
});

// get gallery photos by token -> returns absolute URLs based on the request host/protocol
app.get('/api/galleries/:token', (req, res) => {
  const token = req.params.token;
  db.get('SELECT photos FROM galleries WHERE token = ?', [token], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Gallery not found' });

    let stored = [];
    try { stored = JSON.parse(row.photos || '[]'); } catch (e) { stored = []; }

    const photos = [];
    for (const item of stored) {
      const norm = normalizeStoredItem(item);
      if (!norm) continue;
      const url = absoluteFileUrl(req, norm.storedFilename);
      photos.push({ filename: norm.displayName, url });
    }

    if (!photos.length) return res.status(404).json({ error: 'No photos found on server' });
    res.json({ token, photos });
  });
});

// server-side zip: stream a zip of all gallery images (works for mobile & laptop)
app.get('/api/galleries/:token/zip', (req, res) => {
  const token = req.params.token;
  db.get('SELECT photos FROM galleries WHERE token = ?', [token], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Gallery not found' });

    let stored = [];
    try { stored = JSON.parse(row.photos || '[]'); } catch (e) { stored = []; }

    const filenames = [];
    for (const item of stored) {
      const norm = normalizeStoredItem(item);
      if (norm && norm.storedFilename) filenames.push({ stored: norm.storedFilename, display: norm.displayName || norm.storedFilename });
    }

    if (!filenames.length) return res.status(404).json({ error: 'No photos to zip' });

    const filesToAdd = filenames
      .map(f => ({ path: path.join(UPLOAD_DIR, f.stored), name: f.display }))
      .filter(f => fs.existsSync(f.path));

    if (!filesToAdd.length) return res.status(404).json({ error: 'No photo files found on server' });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="gallery_${token}.zip"`);

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', err => { console.error('archive err', err); try { res.status(500).end(); } catch(e){} });

    archive.pipe(res);
    for (const f of filesToAdd) {
      archive.file(f.path, { name: f.name });
    }
    archive.finalize();
  });
});

// generate QR
app.post('/api/qr/generate', async (req, res) => {
  const { url } = req.body;
  try {
    const dataUrl = await QRCode.toDataURL(url || `${req.protocol}://${req.get('host')}/`);
    res.json({ qrDataUrl: dataUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// admin bookings list (requires X-ADMIN-KEY header)
function requireAdmin(req, res, next){
  const key = req.get('X-ADMIN-KEY') || req.query.admin_key;
  if (!key || key !== ADMIN_KEY) return res.status(401).json({ error: 'admin auth required' });
  next();
}
app.get('/api/admin/bookings', requireAdmin, (req, res) => {
  db.all('SELECT id, name, phone, email, package_name, date, time_slot, qr_token, created_at FROM bookings ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// health
app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log('📁 Frontend folder:', path.join(__dirname, 'frontend'));
  console.log('Try → http://localhost:' + PORT + '/gallery.html');
});

