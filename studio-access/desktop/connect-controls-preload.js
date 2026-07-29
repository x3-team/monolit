const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("connectControls", {
  save: () => ipcRenderer.send("studiogate:connect-save"),
  cancel: () => ipcRenderer.send("studiogate:connect-cancel"),
});
