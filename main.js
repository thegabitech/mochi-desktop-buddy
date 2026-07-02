const { app, BrowserWindow, screen, ipcMain, Tray, Menu, shell } = require('electron');
const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

let petWin = null;
let tray = null;

// ---- tiny settings store (remembers mode, size) ----
const settingsFile = () => path.join(app.getPath('userData'), 'settings.json');
function loadSettings() {
  try { return JSON.parse(fs.readFileSync(settingsFile(), 'utf8')); }
  catch { return {}; }
}
function saveSettings(patch) {
  const s = Object.assign(loadSettings(), patch);
  try { fs.writeFileSync(settingsFile(), JSON.stringify(s)); } catch {}
}
let pendingPatch = null, saveTimer = null;
function debouncedSave(patch) {
  pendingPatch = Object.assign(pendingPatch || {}, patch);
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { saveSettings(pendingPatch); pendingPatch = null; }, 400);
}
function flushSave() {
  clearTimeout(saveTimer);
  if (pendingPatch) { saveSettings(pendingPatch); pendingPatch = null; }
}

// ---- context awareness: react to what's happening on the PC ----
// Polls a PowerShell helper every few seconds for (a) whether a painting app
// is focused, or (b) whether something is actively playing via Windows'
// system-wide "now playing" media session (same source as the volume-flyout
// media widget -- picks up Spotify, browser tabs, Windows Media Player...).
// Nothing here reads file contents or leaves the machine.
let lastContext = null;
let contextTimer = null;
function pollContext() {
  execFile('powershell.exe',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(__dirname, 'context-check.ps1')],
    { timeout: 8000, windowsHide: true },
    (err, stdout) => {
      let ctx = null;
      if (!err && stdout) {
        try { ctx = JSON.parse(stdout).context || null; } catch {}
      }
      if (ctx !== lastContext) {
        lastContext = ctx;
        if (petWin && !petWin.isDestroyed()) petWin.webContents.send('context:update', ctx);
      }
      contextTimer = setTimeout(pollContext, 6000);
    });
}

// Mochi lives on one transparent full-screen overlay: she roams (Walking) or
// stays put (Standing), toggled by double-clicking her. Click-through
// everywhere except on her, so she never blocks work.
function createPet() {
  if (petWin) { petWin.focus(); return; }
  const { workArea } = screen.getPrimaryDisplay();
  petWin = new BrowserWindow({
    x: workArea.x, y: workArea.y, width: workArea.width, height: workArea.height,
    transparent: true, frame: false, resizable: false, movable: false,
    minimizable: false, maximizable: false, fullscreenable: false,
    alwaysOnTop: true, skipTaskbar: true, focusable: false, hasShadow: false,
    title: 'Mochi',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), spellcheck: false },
  });
  petWin.setAlwaysOnTop(true, 'screen-saver');
  petWin.setMenu(null);
  petWin.setIgnoreMouseEvents(true, { forward: true });
  petWin.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  petWin.loadFile('pet.html');
  petWin.on('closed', () => { petWin = null; clearTimeout(contextTimer); updateTray(); });
  petWin.webContents.once('did-finish-load', () => { lastContext = null; pollContext(); });
  updateTray();
}

// ---- tray ----
function updateTray() {
  if (!tray) return;
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: '🐾 Mochi', enabled: false },
    { type: 'separator' },
    { label: 'Show Mochi', type: 'checkbox', checked: !!petWin, click: () => petWin ? petWin.close() : createPet() },
    { type: 'separator' },
    { label: 'Start with Windows', type: 'checkbox', checked: app.getLoginItemSettings().openAtLogin,
      click: item => app.setLoginItemSettings({ openAtLogin: item.checked }) },
    { type: 'separator' },
    { label: 'Quit Mochi', click: () => app.quit() },
  ]));
}
function createTray() {
  tray = new Tray(path.join(__dirname, 'icon.png'));
  tray.setToolTip('Mochi — click to show/hide');
  tray.on('click', () => tray.popUpContextMenu());
  updateTray();
}

// ---- IPC ----
ipcMain.on('pet:interactive', (e, on) => {
  const win = BrowserWindow.fromWebContents(e.sender);
  if (win) win.setIgnoreMouseEvents(!on, { forward: true });
});
ipcMain.on('win:close', e => { BrowserWindow.fromWebContents(e.sender)?.close(); });
ipcMain.handle('settings:get', () => loadSettings());
ipcMain.on('settings:set', (_e, patch) => { if (patch && typeof patch === 'object') debouncedSave(patch); });

// ---- app lifecycle ----
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => { if (petWin) petWin.focus(); else createPet(); });

  app.whenReady().then(() => {
    createTray();
    createPet();
  });

  app.on('window-all-closed', () => {});
  app.on('before-quit', () => { flushSave(); });
}
