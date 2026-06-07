#!/usr/bin/env node
/**
 * Oligodendrosite Admin Server
 * 
 * Local admin server for content editing and media management.
 * Connects to GitHub API for version-controlled file operations.
 * 
 * Usage: node admin/server.js
 * Default port: 8181 (9119, 7171, 5173 are occupied)
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');
const url = require('url');

const PORT = process.env.ADMIN_PORT || 8181;
const SITE_ROOT = path.resolve(__dirname, '..');
const PASSWORD_HASH = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'; // 'password' - change this!
const SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours
const GITHUB_REPO = 'onyxtide/Oligodendrosite';

// Simple session store { token: { expires: timestamp } }
const sessions = {};

// -------- MIME Types --------
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg',
  '.woff2': 'font/woff2',
};

// -------- Helpers --------
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

function sendJSON(res, data, status = 200) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Session-Token',
  });
  res.end(JSON.stringify(data));
}

function sendHTML(res, content, status = 200) {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(content);
}

function sendError(res, message, status = 400) {
  sendJSON(res, { error: message }, status);
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        resolve({ raw: body, json: body ? JSON.parse(body) : null });
      } catch {
        resolve({ raw: body, json: null });
      }
    });
  });
}

function getQuery(req) {
  const parsed = url.parse(req.url, true);
  return { pathname: parsed.pathname, query: parsed.query };
}

function authCheck(req) {
  const token = (req.headers['x-session-token'] || '').replace('Bearer ', '');
  if (!token || !sessions[token]) return false;
  if (Date.now() > sessions[token].expires) {
    delete sessions[token];
    return false;
  }
  sessions[token].expires = Date.now() + SESSION_TIMEOUT;
  return true;
}

// -------- File Operations --------
function listChapters() {
  const chapters = [];
  const dir = SITE_ROOT;
  for (const f of fs.readdirSync(dir)) {
    if (f.match(/^\d{2}-.*\.html$/) || f === 'index.html') {
      const filePath = path.join(dir, f);
      const stat = fs.statSync(filePath);
      chapters.push({
        name: f,
        size: stat.size,
        modified: stat.mtime.toISOString(),
        label: f.replace('.html', '').replace(/^\d{2}-/, '').replace(/-/g, ' '),
      });
    }
  }
  // Also include gr/ versions
  const grDir = path.join(SITE_ROOT, 'gr');
  if (fs.existsSync(grDir)) {
    for (const f of fs.readdirSync(grDir)) {
      if (f.match(/^\d{2}-.*\.html$/) || f === 'index.html') {
        const filePath = path.join(grDir, f);
        const stat = fs.statSync(filePath);
        chapters.push({
          name: `gr/${f}`,
          size: stat.size,
          modified: stat.mtime.toISOString(),
          label: `[GR] ${f.replace('.html', '').replace(/^\d{2}-/, '').replace(/-/g, ' ')}`,
        });
      }
    }
  }
  return chapters;
}

function readChapter(fileName) {
  // Security: only allow html files in root or gr/
  if (!fileName.match(/^(\d{2}-.*\.html|index\.html|gr\/\d{2}-.*\.html|gr\/index\.html)$/)) {
    return null;
  }
  const filePath = path.join(SITE_ROOT, fileName);
  if (!fs.existsSync(filePath)) return null;
  return {
    name: fileName,
    content: fs.readFileSync(filePath, 'utf-8'),
    size: fs.statSync(filePath).size,
  };
}

function writeChapter(fileName, content) {
  if (!fileName.match(/^(\d{2}-.*\.html|index\.html|gr\/\d{2}-.*\.html|gr\/index\.html)$/)) {
    return false;
  }
  const filePath = path.join(SITE_ROOT, fileName);
  // Backup
  const backupDir = path.join(SITE_ROOT, '.admin-backups');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
  const backupPath = path.join(backupDir, `${fileName.replace(/\//g, '_')}.${Date.now()}.bak`);
  if (fs.existsSync(filePath)) {
    fs.copyFileSync(filePath, backupPath);
  }
  fs.writeFileSync(filePath, content, 'utf-8');
  return true;
}

function listMedia() {
  const mediaDir = path.join(SITE_ROOT, 'assets');
  if (!fs.existsSync(mediaDir)) return [];
  return fs.readdirSync(mediaDir)
    .filter(f => !f.startsWith('.'))
    .map(f => {
      const fp = path.join(mediaDir, f);
      const stat = fs.statSync(fp);
      return {
        name: f,
        size: stat.size,
        type: getMimeType(fp),
        modified: stat.mtime.toISOString(),
        url: `/assets/${f}`,
      };
    });
}

function deleteMedia(fileName) {
  if (fileName.includes('..') || fileName.includes('/')) return false;
  const filePath = path.join(SITE_ROOT, 'assets', fileName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
}

function saveMedia(fileName, buffer) {
  if (fileName.includes('..') || fileName.includes('/')) return null;
  const mediaDir = path.join(SITE_ROOT, 'assets');
  if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });
  const filePath = path.join(mediaDir, fileName);
  fs.writeFileSync(filePath, buffer);
  return { name: fileName, size: buffer.length, url: `/assets/${fileName}` };
}

function gitCommit(message) {
  try {
    execSync('git add -A', { cwd: SITE_ROOT, stdio: 'pipe' });
    execSync(`git commit -m "${message}" --allow-empty`, { cwd: SITE_ROOT, stdio: 'pipe' });
    return { success: true, message: 'Changes committed' };
  } catch (e) {
    return { success: false, message: e.stderr?.toString() || e.message };
  }
}

function gitPush() {
  try {
    execSync('git push origin main', { cwd: SITE_ROOT, stdio: 'pipe', timeout: 30000 });
    return { success: true, message: 'Pushed to GitHub' };
  } catch (e) {
    return { success: false, message: e.stderr?.toString() || e.message };
  }
}

function gitStatus() {
  try {
    const status = execSync('git status --porcelain', { cwd: SITE_ROOT, stdio: 'pipe' }).toString();
    const log = execSync('git log --oneline -5', { cwd: SITE_ROOT, stdio: 'pipe' }).toString();
    return { status: status || 'clean', recentCommits: log.trim().split('\n').filter(Boolean) };
  } catch (e) {
    return { status: 'error', recentCommits: [] };
  }
}

// -------- GitHub OAuth Proxy --------
function githubOAuthProxy(code) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      client_id: 'Iv1.b5074e0b6c61d0e1',
      client_secret: '80edc13aca7cd9ff607ae5e565a2bcd0d143a29e',
      code: code,
    });
    const req = https.request({
      hostname: 'github.com',
      path: '/login/oauth/access_token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    }, (res) => {
      let body = '';
      res.on('data', (d) => { body += d; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve(parsed);
        } catch {
          reject(new Error('Failed to parse GitHub response'));
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// -------- Router --------
async function handleRequest(req, res) {
  const { pathname, query } = getQuery(req);

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Session-Token',
    });
    return res.end();
  }

  // -------- Auth endpoints (no auth required) --------
  if (pathname === '/api/auth/login') {
    const { json } = await parseBody(req);
    if (!json || !json.password) return sendError(res, 'Password required');
    const hash = crypto.createHash('sha256').update(json.password).digest('hex');
    if (hash !== PASSWORD_HASH) return sendError(res, 'Invalid password', 401);
    const token = crypto.randomBytes(32).toString('hex');
    sessions[token] = { expires: Date.now() + SESSION_TIMEOUT };
    return sendJSON(res, { token, expires: sessions[token].expires });
  }

  if (pathname === '/api/auth/github') {
    const code = query.code;
    if (!code) return sendError(res, 'Missing OAuth code');
    try {
      const result = await githubOAuthProxy(code);
      if (result.error) return sendError(res, result.error_description || result.error, 400);
      return sendJSON(res, result);
    } catch (e) {
      return sendError(res, e.message, 500);
    }
  }

  if (pathname === '/api/auth/session') {
    return sendJSON(res, { valid: authCheck(req) });
  }

  // -------- Static files for /admin/ (no auth required) --------
  if (pathname.startsWith('/admin/')) {
    const adminPath = path.join(__dirname, pathname.replace('/admin/', ''));
    if (fs.existsSync(adminPath) && fs.statSync(adminPath).isFile()) {
      const ext = path.extname(adminPath);
      res.writeHead(200, { 'Content-Type': getMimeType(adminPath) });
      return res.end(fs.readFileSync(adminPath));
    }
  }

  // -------- Protected API endpoints (auth required) --------
  if (pathname.startsWith('/api/') && pathname !== '/api/auth/login' && pathname !== '/api/auth/github' && pathname !== '/api/auth/session') {
    if (!authCheck(req)) {
      return sendError(res, 'Unauthorized', 401);
    }
  }

  // Chapters
  if (pathname === '/api/chapters' && req.method === 'GET') {
    return sendJSON(res, listChapters());
  }

  if (pathname === '/api/content' && req.method === 'GET') {
    const file = query.file;
    if (!file) return sendError(res, 'Missing file parameter');
    const data = readChapter(file);
    if (!data) return sendError(res, 'File not found', 404);
    return sendJSON(res, data);
  }

  if (pathname === '/api/content' && req.method === 'PUT') {
    const { json } = await parseBody(req);
    if (!json || !json.file || json.content === undefined) {
      return sendError(res, 'Missing file or content');
    }
    if (!writeChapter(json.file, json.content)) {
      return sendError(res, 'Invalid file path', 400);
    }
    return sendJSON(res, { success: true, message: 'File saved' });
  }

  // Media
  if (pathname === '/api/media' && req.method === 'GET') {
    return sendJSON(res, listMedia());
  }

  if (pathname === '/api/media' && req.method === 'DELETE') {
    const file = query.file;
    if (!file) return sendError(res, 'Missing file parameter');
    if (!deleteMedia(file)) return sendError(res, 'File not found', 404);
    return sendJSON(res, { success: true, message: `Deleted ${file}` });
  }

  if (pathname === '/api/media/upload' && req.method === 'POST') {
    const boundary = (req.headers['content-type'] || '').match(/boundary=(.+)/);
    if (!boundary) return sendError(res, 'Multipart required');
    const { raw } = await parseBody(req);
    const boundaryStr = '--' + boundary[1];
    const parts = raw.split(boundaryStr).filter(p => p.includes('filename='));
    if (!parts.length) return sendError(res, 'No file found');
    const part = parts[0];
    const headerEnd = part.indexOf('\r\n\r\n');
    const headers = part.substring(0, headerEnd);
    const fileData = part.substring(headerEnd + 4).replace(/\r\n$/, '').replace(/\r\n--$/, '');
    const filenameMatch = headers.match(/filename="(.+?)"/);
    if (!filenameMatch) return sendError(res, 'No filename');
    const filename = filenameMatch[1];
    let buffer;
    if (headers.includes('Content-Transfer-Encoding: base64')) {
      buffer = Buffer.from(fileData.trim(), 'base64');
    } else {
      buffer = Buffer.from(fileData, 'binary');
    }
    const result = saveMedia(filename, buffer);
    if (!result) return sendError(res, 'Failed to save file', 500);
    return sendJSON(res, result);
  }

  // Git operations
  if (pathname === '/api/git/status' && req.method === 'GET') {
    return sendJSON(res, gitStatus());
  }

  if (pathname === '/api/git/commit' && req.method === 'POST') {
    const { json } = await parseBody(req);
    const message = (json && json.message) || 'Admin update';
    return sendJSON(res, gitCommit(message));
  }

  if (pathname === '/api/git/push' && req.method === 'POST') {
    return sendJSON(res, gitPush());
  }

  // Default: serve admin login page
  const loginPath = path.join(__dirname, 'index.html');
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(fs.readFileSync(loginPath));
}

// -------- Start Server --------
const server = http.createServer(handleRequest);
server.listen(PORT, '127.0.0.1', () => {
  console.log(`
╔══════════════════════════════════════════╗
║   🧠 Oligodendrosite Admin Server      ║
║   http://127.0.0.1:${PORT}/admin/          ║
║   Default password: "password"          ║
║   Change PASSWORD_HASH in server.js     ║
╚══════════════════════════════════════════╝
  `);
});
