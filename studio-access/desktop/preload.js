const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("studioGate", {
  connectTool: (payload) => ipcRenderer.invoke("studiogate:connectTool", payload),
  openTool: (toolId) => ipcRenderer.invoke("studiogate:openTool", toolId),
});
