const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('pet', {
  // walker: toggle click-through when hovering the sprite
  setInteractive: on => ipcRenderer.send('pet:interactive', on),
  // close just this window (the app keeps running in the tray)
  close: () => ipcRenderer.send('win:close'),
  // buddy: window dragging (cursor-follow loop lives in the main process)
  dragStart: () => ipcRenderer.send('buddy:dragstart'),
  dragEnd: () => ipcRenderer.send('buddy:dragend'),
  // buddy: resize the window around the sprite
  setBuddySize: s => ipcRenderer.send('buddy:size', s),
  // persisted settings (sizes, positions)
  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: patch => ipcRenderer.send('settings:set', patch),
  // in-app mode control panel: which windows are open, and toggling them
  getModes: () => ipcRenderer.invoke('modes:get'),
  toggleMode: name => ipcRenderer.send('modes:toggle', name),
  onModesChanged: fn => ipcRenderer.on('modes:changed', (_e, modes) => fn(modes)),
});
