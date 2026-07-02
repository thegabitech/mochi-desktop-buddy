const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('pet', {
  // toggle click-through when hovering the sprite/menu
  setInteractive: on => ipcRenderer.send('pet:interactive', on),
  // close the window (the app keeps running in the tray)
  close: () => ipcRenderer.send('win:close'),
  // persisted settings (mode, size)
  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: patch => ipcRenderer.send('settings:set', patch),
});
