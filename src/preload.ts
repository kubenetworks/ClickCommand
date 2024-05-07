// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  listShortcuts(...args: any[]) {
    return ipcRenderer.invoke('listShortcuts', ...args);
  },
  createShortcut(...args: any[]) {
    return ipcRenderer.invoke('createShortcut', ...args);
  },
  deleteShortcut(...args: any[]) {
    return ipcRenderer.invoke('deleteShortcut', ...args);
  },

  listCommands(...args: any[]) {
    return ipcRenderer.invoke('listCommands', ...args);
  },
  runCommand(...args: any[]) {
    return ipcRenderer.invoke('runCommand', ...args);
  },

  listRuns(...args: any[]) {
    return ipcRenderer.invoke('listRuns', ...args);
  },

  getConfig(...args: any[]) {
    return ipcRenderer.invoke('getConfig', ...args);
  },
});
