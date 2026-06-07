const API = 'http://127.0.0.1:8181/api';
let sessionToken = localStorage.getItem('admin_token');
let currentFile = null;
let cmEditor = null;

function api(endpoint, options = {}) {
  const headers = { ...options.headers };
  if (sessionToken) headers['X-Session-Token'] = sessionToken;
  if (options.json) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.json);
  }
  return fetch(`${API}${endpoint}`, { ...options, headers }).then(r => {
    if (r.status === 401) { logout(); throw new Error('Session expired'); }
    return r.json().catch(() => null);
  });
}

async function login(password) {
  const result = await api('/auth/login', { method: 'POST', json: { password } });
  if (result.token) {
    sessionToken = result.token;
    localStorage.setItem('admin_token', result.token);
    showDashboard();
  } else {
    document.getElementById('login-error').textContent = result.error || 'Login failed';
    document.getElementById('login-error').classList.remove('hidden');
  }
}

function logout() {
  sessionToken = null;
  localStorage.removeItem('admin_token');
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('dashboard').classList.add('hidden');
}

function handleLogout() { logout(); }

async function showDashboard() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  await Promise.all([loadChapters(), loadMedia(), refreshGitStatus()]);
}

async function refreshGitStatus() {
  try {
    const status = await api('/git/status');
    document.getElementById('git-status-detail').textContent = status.status || 'clean';
    document.getElementById('git-log').textContent = (status.recentCommits || []).join('\n') || 'No commits';
    const indicator = document.getElementById('git-status-indicator').querySelector('.w-2');
    if (status.status && status.status !== 'clean') {
      indicator.className = 'w-2 h-2 rounded-full bg-yellow-500';
      document.getElementById('git-status-text').textContent = 'Uncommitted changes';
      document.getElementById('btn-push').disabled = false;
    } else {
      indicator.className = 'w-2 h-2 rounded-full bg-green-500';
      document.getElementById('git-status-text').textContent = 'Clean';
      document.getElementById('btn-push').disabled = true;
    }
  } catch {
    document.getElementById('git-status-text').textContent = 'Error';
  }
}

async function handleCommitPush() {
  const commitBtn = document.getElementById('btn-push');
  commitBtn.disabled = true;
  commitBtn.textContent = 'Committing...';
  await api('/git/commit', { method: 'POST', json: { message: 'Admin content update' } });
  commitBtn.textContent = 'Pushing...';
  const pushResult = await api('/git/push', { method: 'POST' });
  commitBtn.textContent = pushResult.success ? 'Pushed!' : 'Push failed';
  setTimeout(() => { commitBtn.textContent = 'Commit & Push'; refreshGitStatus(); }, 2000);
}

async function handlePush() {
  const result = await api('/git/push', { method: 'POST' });
  alert(result.success ? 'Pushed successfully!' : 'Push failed: ' + result.message);
  refreshGitStatus();
}

async function loadChapters() {
  const chapters = await api('/chapters');
  const container = document.getElementById('chapter-list');
  container.innerHTML = chapters.map(c => `
    <div class="chapter-card bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-purple-700 transition cursor-pointer flex items-center justify-between group"
      onclick="openEditor('${c.name}')">
      <div class="flex items-center gap-4">
        <span class="text-3xl">${c.locale === 'gr' ? '🇬🇷' : c.locale === 'zh' ? '🇨🇳' : c.locale === 'sp' ? '🇪🇸' : '📄'}</span>
        <div>
          <h3 class="font-semibold text-gray-200 capitalize group-hover:text-purple-400 transition">${c.label}</h3>
          <p class="text-xs text-gray-500 mt-1">${c.name} · ${(c.size / 1024).toFixed(1)} KB · ${new Date(c.modified).toLocaleDateString()}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="event.stopPropagation(); deleteChapter('${c.name}')" title="Delete"
          class="text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition text-lg">🗑️</button>
        <span class="text-gray-600 group-hover:text-purple-400 transition text-xl">→</span>
      </div>
    </div>
  `).join('');
}

function guessMode(fileName) {
  if (fileName.endsWith('.html')) return 'htmlmixed';
  if (fileName.endsWith('.js')) return 'javascript';
  if (fileName.endsWith('.css')) return 'css';
  return 'xml';
}

async function openEditor(fileName) {
  const data = await api(`/content?file=${encodeURIComponent(fileName)}`);
  if (!data) return alert('Failed to load file');
  currentFile = fileName;
  currentContent = data.content;
  const mode = guessMode(fileName);
  document.getElementById('editor-title').textContent = `Editing: ${fileName}`;
  document.getElementById('editor-mode').textContent = mode.toUpperCase();
  document.getElementById('editor-file-info').textContent = `${fileName} · ${(data.size / 1024).toFixed(1)} KB`;
  document.getElementById('editor-save-status').textContent = '';
  document.getElementById('editor-modal').classList.remove('hidden');

  const container = document.getElementById('editor-container');
  container.innerHTML = '';
  cmEditor = CodeMirror(container, {
    value: data.content,
    mode: mode,
    theme: 'monokai',
    lineNumbers: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    matchTags: { bothTags: true },
    indentUnit: 2,
    tabSize: 2,
    indentWithTabs: false,
    lineWrapping: false,
    extraKeys: { 'Ctrl-Space': 'autocomplete' },
    viewportMargin: Infinity,
  });
  cmEditor.setSize('100%', '100%');
  cmEditor.focus();
}

function closeEditor() {
  document.getElementById('editor-modal').classList.add('hidden');
  if (cmEditor) { cmEditor.toTextArea(); cmEditor = null; }
  currentFile = null;
  currentContent = null;
}

async function handleSave() {
  if (!cmEditor) return;
  const content = cmEditor.getValue();
  const status = document.getElementById('editor-save-status');
  status.textContent = 'Saving...';
  status.className = 'text-yellow-400';
  const result = await api('/content', { method: 'PUT', json: { file: currentFile, content } });
  if (result.success) {
    currentContent = content;
    status.textContent = '✓ Saved locally';
    status.className = 'text-green-400';
    setTimeout(() => { status.textContent = ''; }, 3000);
    refreshGitStatus();
  } else {
    status.textContent = '✗ Save failed: ' + (result.error || 'Unknown error');
    status.className = 'text-red-400';
  }
}

function toggleWordWrap() {
  if (!cmEditor) return;
  const wrap = !cmEditor.getOption('lineWrapping');
  cmEditor.setOption('lineWrapping', wrap);
  document.getElementById('btn-wrap').textContent = wrap ? 'Unwrap' : 'Wrap';
}

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's' && currentFile) {
    e.preventDefault();
    handleSave();
  }
  if (e.key === 'Escape' && currentFile) closeEditor();
});

async function loadMedia() {
  const media = await api('/media');
  const grid = document.getElementById('media-grid');
  if (!media || !media.length) {
    grid.innerHTML = '<p class="text-gray-500 col-span-full text-center py-12">No media files yet. Upload some!</p>';
    return;
  }
  grid.innerHTML = media.map(m => `
    <div class="media-card bg-gray-900 border border-gray-800 rounded-xl overflow-hidden group">
      <div class="aspect-square bg-gray-800 flex items-center justify-center overflow-hidden">
        ${m.type.startsWith('image/')
          ? `<img src="${m.url}" alt="${m.name}" class="w-full h-full object-cover group-hover:scale-105 transition">`
          : `<span class="text-4xl">📁</span>`}
      </div>
      <div class="p-3">
        <p class="text-sm text-gray-300 truncate" title="${m.name}">${m.name}</p>
        <p class="text-xs text-gray-600">${(m.size / 1024).toFixed(1)} KB</p>
        <div class="flex gap-2 mt-2">
          <button onclick="copyMediaUrl('${m.url}')" class="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded">Copy URL</button>
          <button onclick="deleteMedia('${m.name}')" class="text-xs px-2 py-1 bg-red-900 hover:bg-red-800 text-red-300 rounded">Delete</button>
        </div>
      </div>
    </div>
  `).join('');
}

function copyMediaUrl(url) {
  navigator.clipboard.writeText(url).then(() => alert('URL copied: ' + url));
}

async function deleteMedia(name) {
  if (!confirm(`Delete "${name}"?`)) return;
  await api(`/media?file=${encodeURIComponent(name)}`, { method: 'DELETE' });
  loadMedia();
  refreshGitStatus();
}

async function uploadMedia(file) {
  const formData = new FormData();
  formData.append('file', file);
  const progress = document.getElementById('upload-progress');
  progress.classList.remove('hidden');
  progress.textContent = `Uploading ${file.name}...`;
  try {
    const response = await fetch(`${API}/media/upload`, {
      method: 'POST', body: formData,
      headers: { 'X-Session-Token': sessionToken },
    });
    const result = await response.json().catch(() => null);
    if (result && result.name) {
      progress.textContent = `✓ Uploaded ${result.name}`;
      progress.className = 'mb-4 p-3 bg-green-900/30 border border-green-800 rounded-lg text-sm text-green-300';
      loadMedia(); refreshGitStatus();
    } else {
      progress.textContent = '✗ Upload failed';
      progress.className = 'mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-sm text-red-300';
    }
  } catch {
    progress.textContent = '✗ Upload failed (network error)';
    progress.className = 'mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-sm text-red-300';
  }
  setTimeout(() => progress.classList.add('hidden'), 4000);
}

async function deleteChapter(name) {
  if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
  const result = await api('/content/delete', { method: 'POST', json: { file: name } });
  if (result.success) { loadChapters(); refreshGitStatus(); } else { alert('Delete failed: ' + (result.error || 'unknown')); }
}

function showCreateChapterModal() {
  document.getElementById('create-chapter-modal').classList.remove('hidden');
}

function closeCreateChapterModal() {
  document.getElementById('create-chapter-modal').classList.add('hidden');
}

async function createChapter() {
  const num = document.getElementById('new-chapter-num').value.trim();
  const slug = document.getElementById('new-chapter-slug').value.trim();
  const title = document.getElementById('new-chapter-title').value.trim();
  const template = document.getElementById('new-chapter-template').value;
  if (!num || !slug || !title) return alert('All fields required');
  const result = await api('/content/create', { method: 'POST', json: { number: num, slug, title, template } });
  if (result.success) {
    closeCreateChapterModal();
    loadChapters();
    refreshGitStatus();
    openEditor(result.file);
  } else {
    alert('Failed: ' + (result.error || 'unknown'));
  }
}

function showCreateLocaleModal() {
  document.getElementById('create-locale-modal').classList.remove('hidden');
}

function closeCreateLocaleModal() {
  document.getElementById('create-locale-modal').classList.add('hidden');
}

async function createLocale() {
  const lang = document.getElementById('new-locale-lang').value;
  const code = document.getElementById('new-locale-code').value.trim();
  const source = document.getElementById('new-locale-source').value;
  if (!code) return alert('Locale code required');
  const result = await api('/locale/create', { method: 'POST', json: { lang, code, source } });
  if (result.success) {
    closeCreateLocaleModal();
    loadChapters();
    refreshGitStatus();
  } else {
    alert('Failed: ' + (result.error || 'unknown'));
  }
}

function switchTab(tabName) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.nav-btn[data-tab="${tabName}"]`)?.classList.add('active');
  document.querySelectorAll('.tab-content').forEach(t => { t.style.display = 'none'; });
  const tabEl = document.getElementById(`tab-${tabName}`);
  if (tabEl) tabEl.style.display = 'block';
  if (tabName === 'media') loadMedia();
  if (tabName === 'settings') refreshGitStatus();
  if (tabName === 'chapters') loadChapters();
}

document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  login(document.getElementById('password').value);
});

document.getElementById('media-upload').addEventListener('change', (e) => {
  for (const file of e.target.files) uploadMedia(file);
  e.target.value = '';
});

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

(async () => {
  if (sessionToken) {
    const valid = await api('/auth/session');
    if (valid && valid.valid) { showDashboard(); return; }
  }
  document.getElementById('login-screen').classList.remove('hidden');
})();
