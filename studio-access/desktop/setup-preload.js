const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("studioSetup", {
  saveUrl: (url) => ipcRenderer.invoke("studiogate:save-server-url", url),
});
