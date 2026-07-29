const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("studioGate", {
  connectTool: (payload) => ipcRenderer.invoke("studiogate:connectTool", payload),
  openTool: (toolId, projectId) =>
    ipcRenderer.invoke("studiogate:openTool", { toolId, projectId }),
});
