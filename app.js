
const $ = (id) => document.getElementById(id);
const STORAGE_KEY = 'outlookManagerEntries_v1';
let entries = loadEntries();
let running = false;
let completed = 0;
let progress = 0;
let progressTimer = null;
let logs = [];

function loadEntries() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}
function persist() { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); }
function log(message) {
  logs.unshift({ message, time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) });
  logs = logs.slice(0, 12);
  renderLogs();
}
function renderLogs() {
  const list = $('logList');
  list.innerHTML = '';
  if (!logs.length) {
    const li = document.createElement('li');
    li.textContent = 'No recent activity.';
    list.appendChild(li);
    return;
  }
  logs.forEach(item => {
    const li = document.createElement('li');
    const dot = document.createElement('span'); dot.className = 'log-dot';
    const message = document.createElement('span'); message.textContent = item.message;
    const time = document.createElement('time'); time.textContent = item.time;
    li.append(dot, message, time); list.appendChild(li);
  });
}
function renderEntries() {
  $('totalCount').textContent = entries.length;
  $('emptyState').hidden = entries.length > 0;
  $('tableWrap').hidden = entries.length === 0;
  const rows = $('accountRows');
  rows.innerHTML = '';
  entries.forEach(entry => {
    const tr = document.createElement('tr');
    [entry.label || 'Unlabelled', entry.email, entry.added].forEach(value => {
      const td = document.createElement('td'); td.textContent = value; tr.appendChild(td);
    });
    const action = document.createElement('td');
    const del = document.createElement('button');
    del.className = 'delete-entry'; del.textContent = 'Remove';
    del.setAttribute('aria-label', `Remove ${entry.email}`);
    del.addEventListener('click', () => {
      entries = entries.filter(item => item.id !== entry.id);
      persist(); renderEntries(); log('Removed an account entry.');
    });
    action.appendChild(del); tr.appendChild(action); rows.appendChild(tr);
  });
}
function renderRunner() {
  $('botStatus').textContent = running ? 'Running' : 'Stopped';
  $('statusNote').textContent = running ? 'Demo activity in progress' : 'No automation is running';
  $('statusDot').classList.toggle('running', running);
  $('startBtn').disabled = running;
  $('stopBtn').disabled = !running;
  $('progressFill').style.width = `${progress}%`;
  $('doneCount').textContent = completed;
}
$('accountForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const label = $('accountLabel').value.trim();
  const email = $('emailAddress').value.trim();
  if (!email) return;
  if (entries.some(entry => entry.email.toLowerCase() === email.toLowerCase())) {
    log('That email address is already in the list.');
    return;
  }
  entries.unshift({ id: `${Date.now()}_${Math.random().toString(16).slice(2)}`, label, email, added: new Date().toLocaleDateString() });
  persist(); renderEntries(); $('accountForm').reset(); log('Added an account entry.');
});
$('startBtn').addEventListener('click', () => {
  if (running) return;
  running = true; progress = 0; renderRunner();
  $('runnerMessage').textContent = 'Demo running. No Outlook accounts are being created.';
  log('Started dashboard demo (no account creation).');
  progressTimer = setInterval(() => {
    if (!running) return;
    progress = Math.min(progress + 10, 100);
    renderRunner();
    if (progress >= 100) {
      running = false; completed += 1;
      clearInterval(progressTimer); progressTimer = null;
      renderRunner();
      $('runnerMessage').textContent = 'Demo task completed.';
      log('Demo task completed.');
    }
  }, 500);
});
$('stopBtn').addEventListener('click', () => {
  running = false;
  if (progressTimer) clearInterval(progressTimer);
  progressTimer = null;
  renderRunner();
  $('runnerMessage').textContent = 'Demo stopped.';
  log('Stopped dashboard demo.');
});
$('exportBtn').addEventListener('click', () => {
  const body = [
    'Outlook Management Panel - Account Entries',
    `Exported: ${new Date().toLocaleString()}`,
    '',
    ...entries.map((entry, i) => `${i + 1}. ${entry.label ? entry.label + ' — ' : ''}${entry.email} (added ${entry.added})`),
    '',
    'Note: This export intentionally excludes passwords, recovery codes, and access tokens.'
  ].join('\n');
  const blob = new Blob([body], {type:'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'outlook-account-list.txt';
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  log('Exported account entries to TXT.');
});
$('clearBtn').addEventListener('click', () => {
  if (!entries.length) return;
  if (!confirm('Remove all saved account entries from this browser?')) return;
  entries = []; persist(); renderEntries(); log('Cleared all account entries.');
});
$('clearLogBtn').addEventListener('click', () => { logs = []; renderLogs(); });
renderEntries(); renderRunner(); renderLogs();
