const { app, BrowserWindow, screen, ipcMain, Tray, Menu, shell } = require('electron');
const path = require('path');
const fs = require('fs');

const WIDGET_W = 340;
const WIDGET_H = 480;
const MARGIN = 16;

const BUDDY_MIN = 70;
const BUDDY_MAX = 280;
const BUDDY_DEFAULT = 130;
const buddyBoxFor = s => ({ w: Math.round(s * 1.55), h: Math.round(s * 1.35) });
const clampBuddy = s => Math.max(BUDDY_MIN, Math.min(BUDDY_MAX, Number(s) || BUDDY_DEFAULT));

let widgetWin = null;
let walkerWin = null;
let buddyWin = null;
let tray = null;

// ---- tiny settings store (remembers modes, sizes, positions) ----
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
let isQuitting = false;

// ---- windows ----
function createWidget() {
  if (widgetWin) { widgetWin.focus(); return; }
  const { workArea } = screen.getPrimaryDisplay();
  widgetWin = new BrowserWindow({
    width: WIDGET_W, height: WIDGET_H,
    x: workArea.x + workArea.width - WIDGET_W - MARGIN,
    y: workArea.y + workArea.height - WIDGET_H - MARGIN,
    frame: false, resizable: false, maximizable: false, fullscreenable: false,
    alwaysOnTop: true, title: 'Mochi', show: false,
  });
  widgetWin.setAlwaysOnTop(true, 'screen-saver');
  widgetWin.setMenu(null);
  widgetWin.once('ready-to-show', () => widgetWin && widgetWin.show());
  widgetWin.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  widgetWin.loadFile('widget.html');
  widgetWin.on('closed', () => { widgetWin = null; updateTray(); });
  updateTray();
}

function createWalker() {
  if (walkerWin) return;
  const { workArea } = screen.getPrimaryDisplay();
  walkerWin = new BrowserWindow({
    x: workArea.x, y: workArea.y, width: workArea.width, height: workArea.height,
    transparent: true, frame: false, resizable: false, movable: false,
    minimizable: false, maximizable: false, fullscreenable: false,
    alwaysOnTop: true, skipTaskbar: true, focusable: false, hasShadow: false,
    title: 'Mochi Walker',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), spellcheck: false },
  });
  walkerWin.setAlwaysOnTop(true, 'screen-saver');
  walkerWin.setMenu(null);
  walkerWin.setIgnoreMouseEvents(true, { forward: true });
  walkerWin.loadFile('walker.html');
  walkerWin.on('closed', () => { walkerWin = null; updateTray(); });
  updateTray();
}

function createBuddy() {
  if (buddyWin) return;
  const { workArea } = screen.getPrimaryDisplay();
  const settings = loadSettings();
  const size = clampBuddy(settings.buddySize);
  const { w: BUDDY_W, h: BUDDY_H } = buddyBoxFor(size);
  const saved = settings.buddyPos;
  let x = workArea.x + workArea.width - BUDDY_W - MARGIN;
  let y = workArea.y + workArea.height - BUDDY_H - MARGIN;
  if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
    const onScreen = screen.getAllDisplays().some(d =>
      saved.x >= d.bounds.x - BUDDY_W && saved.x < d.bounds.x + d.bounds.width &&
      saved.y >= d.bounds.y - BUDDY_H && saved.y < d.bounds.y + d.bounds.height);
    if (onScreen) { x = saved.x; y = saved.y; }
  }
  buddyWin = new BrowserWindow({
    x, y, width: BUDDY_W, height: BUDDY_H,
    transparent: true, frame: false, resizable: false, minimizable: false,
    maximizable: false, fullscreenable: false, alwaysOnTop: true, skipTaskbar: true, hasShadow: false,
    title: 'Mochi Buddy',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), spellcheck: false },
  });
  buddyWin.setAlwaysOnTop(true, 'screen-saver');
  buddyWin.setMenu(null);
  buddyWin.loadFile('buddy.html');
  buddyWin.on('blur', () => stopDrag(true));
  buddyWin.on('closed', () => { buddyWin = null; updateTray(); });
  updateTray();
}

// ---- tray ----
function updateTray() {
  if (!tray) return;
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: '🐾 Mochi', enabled: false },
    { type: 'separator' },
    { label: 'Companion widget', type: 'checkbox', checked: !!widgetWin, click: () => widgetWin ? widgetWin.close() : createWidget() },
    { label: 'Screen walker', type: 'checkbox', checked: !!walkerWin, click: () => walkerWin ? walkerWin.close() : createWalker() },
    { label: 'Still buddy (draggable)', type: 'checkbox', checked: !!buddyWin, click: () => buddyWin ? buddyWin.close() : createBuddy() },
    { type: 'separator' },
    { label: 'Start with Windows', type: 'checkbox', checked: app.getLoginItemSettings().openAtLogin,
      click: item => app.setLoginItemSettings({ openAtLogin: item.checked }) },
    { type: 'separator' },
    { label: 'Quit Mochi', click: () => app.quit() },
  ]));
  if (!isQuitting && app.isReady()) {
    debouncedSave({ lastModes: { widget: !!widgetWin, walker: !!walkerWin, buddy: !!buddyWin } });
  }
}
function createTray() {
  tray = new Tray(path.join(__dirname, 'icon.png'));
  tray.setToolTip('Mochi — click for modes');
  tray.on('click', () => tray.popUpContextMenu());
  updateTray();
}

// ---- IPC ----
ipcMain.on('pet:interactive', (e, on) => {
  const win = BrowserWindow.fromWebContents(e.sender);
  if (win) win.setIgnoreMouseEvents(!on, { forward: true });
});
ipcMain.on('win:close', e => { BrowserWindow.fromWebContents(e.sender)?.close(); });

let dragState = null;
function stopDrag(save) {
  if (!dragState) return;
  clearInterval(dragState.timer);
  const win = dragState.win;
  dragState = null;
  if (save && win && !win.isDestroyed()) {
    const [x, y] = win.getPosition();
    saveSettings({ buddyPos: { x, y } });
  }
}
ipcMain.on('buddy:dragstart', e => {
  const win = BrowserWindow.fromWebContents(e.sender);
  if (!win) return;
  stopDrag(false);
  const cur = screen.getCursorScreenPoint();
  const [wx, wy] = win.getPosition();
  dragState = {
    win, offX: cur.x - wx, offY: cur.y - wy,
    timer: setInterval(() => {
      if (win.isDestroyed()) { stopDrag(false); return; }
      const c = screen.getCursorScreenPoint();
      let nx = c.x - dragState.offX, ny = c.y - dragState.offY;
      const [w, h] = win.getSize();
      const area = screen.getDisplayNearestPoint(c).workArea;
      nx = Math.max(area.x - w + 60, Math.min(nx, area.x + area.width - 60));
      ny = Math.max(area.y - 10, Math.min(ny, area.y + area.height - 50));
      win.setPosition(Math.round(nx), Math.round(ny));
    }, 16),
  };
});
ipcMain.on('buddy:dragend', () => stopDrag(true));
ipcMain.on('buddy:size', (e, size) => {
  const win = BrowserWindow.fromWebContents(e.sender);
  if (!win) return;
  stopDrag(false);
  const s = clampBuddy(size);
  const [x, y] = win.getPosition();
  const [w, h] = win.getSize();
  const { w: W, h: H } = buddyBoxFor(s);
  win.setResizable(true);
  win.setBounds({ x: Math.round(x + (w - W) / 2), y: Math.round(y + (h - H)), width: W, height: H });
  win.setResizable(false);
  const [nx, ny] = win.getPosition();
  debouncedSave({ buddySize: s, buddyPos: { x: nx, y: ny } });
});
ipcMain.handle('settings:get', () => loadSettings());
ipcMain.on('settings:set', (_e, patch) => { if (patch && typeof patch === 'object') debouncedSave(patch); });

// ---- app lifecycle ----
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', (_e, argv) => {
    if (argv.includes('--walker')) createWalker();
    else if (argv.includes('--buddy')) createBuddy();
    else createWidget();
  });

  app.whenReady().then(() => {
    createTray();
    if (process.argv.includes('--walker')) createWalker();
    else if (process.argv.includes('--buddy')) createBuddy();
    else {
      const m = loadSettings().lastModes;
      if (m && (m.widget || m.walker || m.buddy)) {
        if (m.widget) createWidget();
        if (m.walker) createWalker();
        if (m.buddy) createBuddy();
      } else {
        createWidget();
      }
    }
  });

  app.on('window-all-closed', () => {});
  app.on('before-quit', () => { isQuitting = true; stopDrag(false); flushSave(); });
}
