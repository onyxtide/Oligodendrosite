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

const KNOWN_LOCALES = ['gr', 'zh', 'sp'];

function listChapters() {
  const chapters = [];
  const dir = SITE_ROOT;
  for (const f of fs.readdirSync(dir)) {
    if (f.match(/^\d{2}-.*\.html$/) || f === 'index.html') {
      const filePath = path.join(dir, f);
      const stat = fs.statSync(filePath);
      chapters.push({
        name: f, size: stat.size, modified: stat.mtime.toISOString(), locale: 'en',
        label: f.replace('.html', '').replace(/^\d{2}-/, '').replace(/-/g, ' '),
      });
    }
  }
  for (const loc of KNOWN_LOCALES) {
    const locDir = path.join(SITE_ROOT, loc);
    if (!fs.existsSync(locDir)) continue;
    for (const f of fs.readdirSync(locDir)) {
      if (f.match(/^\d{2}-.*\.html$/) || f === 'index.html') {
        const fp = path.join(locDir, f);
        const stat = fs.statSync(fp);
        const flag = { gr: '🇬🇷', zh: '🇨🇳', sp: '🇪🇸' }[loc] || '';
        chapters.push({
          name: `${loc}/${f}`, size: stat.size, modified: stat.mtime.toISOString(), locale: loc,
          label: `${flag} ${f.replace('.html', '').replace(/^\d{2}-/, '').replace(/-/g, ' ')}`,
        });
      }
    }
  }
  return chapters;
}

function validFileName(fileName) {
  const pattern = new RegExp(`^(\d{2}-.*\.html|index\.html|${KNOWN_LOCALES.map(l => l + '/\d{2}-.*\.html|' + l + '/index\.html').join('|')})$`);
  return pattern.test(fileName);
}

function readChapter(fileName) {
  if (!validFileName(fileName)) return null;
  const filePath = path.join(SITE_ROOT, fileName);
  if (!fs.existsSync(filePath)) return null;
  return { name: fileName, content: fs.readFileSync(filePath, 'utf-8'), size: fs.statSync(filePath).size };
}

function writeChapter(fileName, content) {
  if (!validFileName(fileName)) return false;
  const filePath = path.join(SITE_ROOT, fileName);
  const backupDir = path.join(SITE_ROOT, '.admin-backups');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
  const backupPath = path.join(backupDir, `${fileName.replace(/\//g, '_')}.${Date.now()}.bak`);
  if (fs.existsSync(filePath)) fs.copyFileSync(filePath, backupPath);
  fs.writeFileSync(filePath, content, 'utf-8');
  return true;
}

function createChapter(number, slug, title, template) {
  const fileName = `${number.padStart(2, '0')}-${slug}.html`;
  const filePath = path.join(SITE_ROOT, fileName);
  if (fs.existsSync(filePath)) return { error: 'File already exists' };

  const fullTemplate = template === 'full' ? `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Oligodendrosite</title>
  <meta name="description" content="${title}">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧠</text></svg>">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
  <link rel="stylesheet" href="css/main.css">
</head>
<body class="bg-gray-100 font-sans dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
  <div id="header-placeholder"></div>
  <header class="bg-indigo-700 text-white p-6 shadow-md mb-8">
    <div class="container mx-auto">
      <h1 class="text-3xl md:text-4xl font-bold mb-2">${title}</h1>
      <p class="text-lg opacity-90">New chapter description</p>
    </div>
  </header>
  <main class="container mx-auto p-4 md:p-6">
    <section class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-2xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">Introduction</h2>
      <p class="mb-4">Your content goes here.</p>
    </section>
    <nav class="mb-6 tab-navigation" role="tablist" aria-label="Chapter sections"
      style="--tab-active-color:#4338ca; --tab-active-color-dark:#a5b4fc; --tab-hover-color:#4338ca; --tab-hover-color-dark:#a5b4fc; --tab-active-bg:#e0e7ff; --tab-active-bg-dark:rgba(99,102,241,0.18); --tab-hover-bg:#eef2ff; --tab-hover-bg-dark:rgba(99,102,241,0.12);">
      <button id="tab-topic1" role="tab" aria-selected="true" aria-controls="content-topic1"
        class="tab-button relative px-4 py-2 text-indigo-700 font-medium rounded-lg transition-all duration-300">
        <span class="hidden sm:inline">Topic 1</span><span class="sm:hidden">T1</span>
      </button>
      <button id="tab-topic2" role="tab" aria-selected="false" aria-controls="content-topic2"
        class="tab-button relative px-4 py-2 text-gray-500 font-medium rounded-lg transition-all duration-300 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
        <span class="hidden sm:inline">Topic 2</span><span class="sm:hidden">T2</span>
      </button>
    </nav>
    <section id="content-topic1" class="tab-content active" role="tabpanel" aria-labelledby="tab-topic1">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-2xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">Topic 1</h2>
        <p>Add your content here.</p>
      </div>
    </section>
    <section id="content-topic2" class="tab-content" role="tabpanel" aria-labelledby="tab-topic2">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-2xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">Topic 2</h2>
        <p>Add your content here.</p>
      </div>
    </section>
  </main>
  <div id="footer-placeholder"></div>
  <script src="js/firebase-init.js"></script>
  <script src="js/components.js"></script>
  <script src="js/main.js"></script>
</body>
</html>` : `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Oligodendrosite</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧠</text></svg>">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="css/main.css">
</head>
<body class="bg-gray-100 font-sans dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
  <div id="header-placeholder"></div>
  <header class="bg-indigo-700 text-white p-6 shadow-md mb-8">
    <div class="container mx-auto">
      <h1 class="text-3xl md:text-4xl font-bold mb-2">${title}</h1>
      <p class="text-lg opacity-90">New chapter description</p>
    </div>
  </header>
  <main class="container mx-auto p-4 md:p-6">
    <section class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-2xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">Introduction</h2>
      <p>Your content goes here.</p>
    </section>
  </main>
  <div id="footer-placeholder"></div>
  <script src="js/firebase-init.js"></script>
  <script src="js/components.js"></script>
  <script src="js/main.js"></script>
</body>
</html>`;

  fs.writeFileSync(filePath, fullTemplate, 'utf-8');
  return { success: true, file: fileName };
}

function deleteChapterFile(fileName) {
  if (!validFileName(fileName)) return false;
  const filePath = path.join(SITE_ROOT, fileName);
  if (!fs.existsSync(filePath)) return false;
  const backupDir = path.join(SITE_ROOT, '.admin-backups');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
  fs.copyFileSync(filePath, path.join(backupDir, `${fileName.replace(/\//g, '_')}.deleted.${Date.now()}.bak`));
  fs.unlinkSync(filePath);
  return true;
}

function createLocale(code, sourceLocale) {
  const langNames = { zh: 'Chinese', sp: 'Spanish' };
  const locDir = path.join(SITE_ROOT, code);
  const componentsDir = path.join(locDir, 'components');
  if (fs.existsSync(locDir)) return { error: `Locale '${code}' already exists` };

  fs.mkdirSync(locDir, { recursive: true });
  fs.mkdirSync(componentsDir, { recursive: true });

  if (sourceLocale === 'gr' || sourceLocale === 'en') {
    const sourceDir = sourceLocale === 'en' ? SITE_ROOT : path.join(SITE_ROOT, sourceLocale);
    for (const f of fs.readdirSync(sourceDir)) {
      if (f.match(/^\d{2}-.*\.html$/) || f === 'index.html') {
        const srcPath = path.join(sourceDir, f);
        let content = fs.readFileSync(srcPath, 'utf-8');
        content = content.replace(/lang="[^"]*"/, `lang="${code}"`);
        content = content.replace(/href="\.\.?\/(css|js|assets|components|gr)\//g, `href="../$1/`);
        content = content.replace(/src="\.\.?\/(css|js|assets|components|gr)\//g, `src="../$1/`);
        content = content.replace(/href="(\.\.\/)?gr\//g, `href="../${code}/`);
        fs.writeFileSync(path.join(locDir, f), content, 'utf-8');
      }
    }
    const sourceCompDir = path.join(sourceDir, 'components');
    if (fs.existsSync(sourceCompDir)) {
      for (const f of fs.readdirSync(sourceCompDir)) {
        fs.copyFileSync(path.join(sourceCompDir, f), path.join(componentsDir, f));
      }
    }
  } else {
    const indexContent = `<!DOCTYPE html>
<html lang="${code}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Oligodendrosite - ${langNames[code] || code.toUpperCase()}</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧠</text></svg>">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="../css/main.css">
</head>
<body class="bg-gray-100 font-sans dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
  <div id="header-placeholder"></div>
  <header class="bg-indigo-700 text-white p-6 shadow-md mb-8">
    <div class="container mx-auto">
      <h1 class="text-3xl md:text-4xl font-bold mb-2">Oligodendrosite - ${langNames[code] || code.toUpperCase()}</h1>
      <p class="text-lg opacity-90">${langNames[code] || code.toUpperCase()} homepage</p>
    </div>
  </header>
  <main class="container mx-auto p-4 md:p-6">
    <section class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-2xl font-bold mb-4">${langNames[code] || code.toUpperCase()} Translation</h2>
      <p>This locale needs translation. Edit this page in the admin panel.</p>
    </section>
  </main>
  <div id="footer-placeholder"></div>
  <script src="../js/firebase-init.js"></script>
  <script src="../js/components.js"></script>
  <script src="../js/main.js"></script>
</body>
</html>`;
    fs.writeFileSync(path.join(locDir, 'index.html'), indexContent, 'utf-8');
    const headerContent = fs.readFileSync(path.join(SITE_ROOT, 'gr', 'components', 'header.html'), 'utf-8')
      .replace(/\/gr\//g, `/${code}/`);
    fs.writeFileSync(path.join(componentsDir, 'header.html'), headerContent, 'utf-8');
    const footerContent = fs.readFileSync(path.join(SITE_ROOT, 'gr', 'components', 'footer.html'), 'utf-8')
      .replace(/\/gr\//g, `/${code}/`);
    fs.writeFileSync(path.join(componentsDir, 'footer.html'), footerContent, 'utf-8');
  }
  return { success: true, locale: code };
}

function readChapter(fileName) { return null; }
function writeChapter(fileName, content) { return false; }

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

  if (pathname === '/api/content/create' && req.method === 'POST') {
    const { json } = await parseBody(req);
    if (!json || !json.number || !json.slug || !json.title) {
      return sendError(res, 'Missing number, slug, or title');
    }
    const result = createChapter(json.number, json.slug, json.title, json.template || 'full');
    if (result.error) return sendError(res, result.error, 409);
    return sendJSON(res, result);
  }

  if (pathname === '/api/content/delete' && req.method === 'POST') {
    const { json } = await parseBody(req);
    if (!json || !json.file) return sendError(res, 'Missing file');
    if (!deleteChapterFile(json.file)) return sendError(res, 'File not found or invalid', 404);
    return sendJSON(res, { success: true, message: `Deleted ${json.file}` });
  }

  if (pathname === '/api/locale/create' && req.method === 'POST') {
    const { json } = await parseBody(req);
    if (!json || !json.code) return sendError(res, 'Missing locale code');
    const result = createLocale(json.code, json.source || 'none');
    if (result.error) return sendError(res, result.error, 409);
    return sendJSON(res, result);
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
