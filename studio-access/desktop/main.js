const { app, BrowserWindow, ipcMain, session } = require("electron");
const path = require("path");

const APP_URL = process.env.STUDIOGATE_URL || "http://localhost:3001";

/** @type {BrowserWindow | null} */
let mainWindow = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    backgroundColor: "#0f1419",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(`${APP_URL}/app`);
}

/**
 * Admin connects a tool: login in isolated window, then capture cookies.
 */
async function connectTool({ toolId, loginUrl, kind }) {
  const partition = `persist:studiogate-connect-${kind}`;
  const ses = session.fromPartition(partition, { cache: true });

  const win = new BrowserWindow({
    width: 1100,
    height: 800,
    title: `Connect ${kind}`,
    webPreferences: {
      session: ses,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  await win.loadURL(loginUrl);

  // Wait until user closes the window after logging in
  await new Promise((resolve) => {
    win.on("closed", resolve);
  });

  const cookies = await ses.cookies.get({});
  if (!cookies.length) {
    return { ok: false, error: "No cookies captured. Log in, then close the window." };
  }

  const payload = {
    cookies: cookies.map((c) => ({
      name: c.name,
      value: c.value,
      domain: c.domain,
      path: c.path,
      secure: c.secure,
      httpOnly: c.httpOnly,
      expirationDate: c.expirationDate,
    })),
    note: "Captured via StudioGate desktop",
  };

  // Use main window cookies (auth) to call API
  const result = await mainWindow.webContents.executeJavaScript(
    `fetch(${JSON.stringify(`/api/tools/${toolId}/session`)}, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: ${JSON.stringify(JSON.stringify(payload))}
    }).then(r => r.json().then(data => ({ status: r.status, data })))`
  );

  if (result.status >= 400) {
    return { ok: false, error: result.data?.error || "Failed to save session" };
  }
  return { ok: true };
}

async function openTool(toolId) {
  const result = await mainWindow.webContents.executeJavaScript(
    `fetch(${JSON.stringify(`/api/tools/${toolId}/session`)}, {
      credentials: 'include'
    }).then(r => r.json().then(data => ({ status: r.status, data })))`
  );

  if (result.status >= 400) {
    return { ok: false, error: result.data?.error || "Cannot open tool" };
  }

  const { tool, session: toolSession, partition } = result.data;
  const ses = session.fromPartition(partition, { cache: true });
  await ses.clearStorageData();

  for (const cookie of toolSession.cookies || []) {
    try {
      const url =
        (cookie.secure === false ? "http://" : "https://") +
        String(cookie.domain || "")
          .replace(/^\./, "") +
        (cookie.path || "/");
      await ses.cookies.set({
        url,
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path || "/",
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        expirationDate: cookie.expirationDate,
      });
    } catch (e) {
      // skip invalid cookie domain combos
    }
  }

  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    title: `${tool.label} · StudioGate`,
    webPreferences: {
      session: ses,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  await win.loadURL(tool.homeUrl || tool.loginUrl);
  return { ok: true };
}

app.whenReady().then(() => {
  createMainWindow();

  ipcMain.handle("studiogate:connectTool", async (_event, payload) => {
    try {
      return await connectTool(payload);
    } catch (e) {
      return { ok: false, error: e.message || "Connect failed" };
    }
  });

  ipcMain.handle("studiogate:openTool", async (_event, toolId) => {
    try {
      return await openTool(toolId);
    } catch (e) {
      return { ok: false, error: e.message || "Open failed" };
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
