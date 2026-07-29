const { app, BrowserWindow, ipcMain, session } = require("electron");
const path = require("path");
const Store = require("electron-store");

const store = new Store({
  name: "studiogate",
  defaults: {
    serverUrl: process.env.STUDIOGATE_URL || "",
  },
});

/** @type {BrowserWindow | null} */
let mainWindow = null;

function normalizeUrl(url) {
  return String(url || "")
    .trim()
    .replace(/\/$/, "");
}

function getServerUrl() {
  return normalizeUrl(store.get("serverUrl") || process.env.STUDIOGATE_URL || "");
}

function createSetupWindow() {
  const win = new BrowserWindow({
    width: 520,
    height: 360,
    resizable: false,
    backgroundColor: "#0f1419",
    title: "StudioGate Setup",
    webPreferences: {
      preload: path.join(__dirname, "setup-preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const current = getServerUrl() || "http://localhost:3001";
  win.loadURL(
    "data:text/html," +
      encodeURIComponent(`<!doctype html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;background:#0f1419;color:#eef3f7">
  <div style="padding:28px">
    <h1 style="margin:0 0 8px;font-size:24px">StudioGate</h1>
    <p style="margin:0 0 18px;color:#93a1ae;line-height:1.45">
      Enter your studio link once. After that just log in and click <b>Open Figma</b>.
    </p>
    <label style="display:block;font-size:13px;margin-bottom:6px">Studio link</label>
    <input id="url" value="${current}"
      style="width:100%;box-sizing:border-box;padding:12px;border-radius:10px;border:1px solid #2a3541;background:#171e26;color:#fff;margin-bottom:14px" />
    <button id="save"
      style="width:100%;padding:12px;border:0;border-radius:10px;background:#3dd6c6;color:#042421;font-weight:700;cursor:pointer">
      Continue
    </button>
    <p id="err" style="color:#ff6b6b;font-size:13px;min-height:18px"></p>
  </div>
  <script>
    document.getElementById('save').onclick = async () => {
      const url = document.getElementById('url').value.trim();
      const err = document.getElementById('err');
      err.textContent = '';
      if (!/^https?:\\/\\//i.test(url)) {
        err.textContent = 'Link must start with http:// or https://';
        return;
      }
      await window.studioSetup.saveUrl(url);
    };
  </script>
</body></html>`)
  );
  return win;
}

function createMainWindow(serverUrl) {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    backgroundColor: "#0f1419",
    title: "StudioGate",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  mainWindow.loadURL(`${serverUrl}/login`);
}

async function captureStorage(ses, kind) {
  const cookies = await ses.cookies.get({});
  return {
    cookies: cookies.map((c) => ({
      name: c.name,
      value: c.value,
      domain: c.domain,
      path: c.path,
      secure: c.secure,
      httpOnly: c.httpOnly,
      expirationDate: c.expirationDate,
    })),
    kind,
    capturedAt: new Date().toISOString(),
  };
}

async function connectTool({ toolId, loginUrl, kind }) {
  const partition = `persist:studiogate-connect-${kind}-${Date.now()}`;
  const ses = session.fromPartition(partition, { cache: true });

  const win = new BrowserWindow({
    width: 1200,
    height: 860,
    title: `StudioGate Connect · ${kind}`,
    webPreferences: {
      session: ses,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const controls = new BrowserWindow({
    width: 420,
    height: 190,
    parent: win,
    resizable: false,
    title: "StudioGate Connect",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "connect-controls-preload.js"),
    },
  });

  controls.loadURL(
    "data:text/html," +
      encodeURIComponent(`<!doctype html>
<html><body style="font-family:sans-serif;background:#171e26;color:#eef3f7;padding:16px">
  <h3 style="margin:0 0 8px">Connect ${kind}</h3>
  <p style="margin:0 0 12px;color:#93a1ae;font-size:13px">
    1) Log into the <b>TEAM</b> account<br/>
    2) Wait until files/UI load<br/>
    3) Click Save session
  </p>
  <button id="save" style="background:#3dd6c6;border:0;padding:10px 14px;border-radius:8px;font-weight:700;cursor:pointer">Save session</button>
  <button id="cancel" style="margin-left:8px;background:transparent;border:1px solid #2a3541;color:#eef3f7;padding:10px 14px;border-radius:8px;cursor:pointer">Cancel</button>
  <script>
    document.getElementById('save').onclick = () => window.connectControls.save();
    document.getElementById('cancel').onclick = () => window.connectControls.cancel();
  </script>
</body></html>`)
  );

  await win.loadURL(loginUrl);

  const decision = await new Promise((resolve) => {
    ipcMain.once("studiogate:connect-save", () => resolve("save"));
    ipcMain.once("studiogate:connect-cancel", () => resolve("cancel"));
    win.on("closed", () => resolve("cancel"));
  });

  if (decision !== "save") {
    try { controls.close(); } catch {}
    try { win.close(); } catch {}
    return { ok: false, error: "Connect cancelled" };
  }

  let localStorage = {};
  try {
    localStorage = await win.webContents.executeJavaScript(`(() => {
      const out = {};
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        out[k] = localStorage.getItem(k);
      }
      return out;
    })()`);
  } catch {
    localStorage = {};
  }

  const storage = await captureStorage(ses, kind);
  storage.localStorage = localStorage;
  storage.note = "Captured via StudioGate desktop Connect";

  try { controls.close(); } catch {}
  try { win.close(); } catch {}

  if (!storage.cookies.length) {
    return { ok: false, error: "No cookies captured. Log in fully, then Save." };
  }

  const result = await mainWindow.webContents.executeJavaScript(
    `fetch(${JSON.stringify(`/api/tools/${toolId}/session`)}, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: ${JSON.stringify(JSON.stringify({
        cookies: storage.cookies,
        note: storage.note,
        localStorage: storage.localStorage,
      }))}
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
      const host = String(cookie.domain || "").replace(/^\./, "");
      if (!host) continue;
      const url = `${cookie.secure === false ? "http" : "https"}://${host}${cookie.path || "/"}`;
      await ses.cookies.set({
        url,
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path || "/",
        secure: Boolean(cookie.secure),
        httpOnly: Boolean(cookie.httpOnly),
        expirationDate: cookie.expirationDate,
      });
    } catch {}
  }

  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    title: `${tool.label} · StudioGate`,
    webPreferences: {
      session: ses,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.webContents.on("did-finish-load", async () => {
    if (toolSession.localStorage && typeof toolSession.localStorage === "object") {
      try {
        await win.webContents.executeJavaScript(
          `(() => {
            const data = ${JSON.stringify(toolSession.localStorage)};
            Object.entries(data).forEach(([k,v]) => {
              try { localStorage.setItem(k, v); } catch(e) {}
            });
          })()`
        );
      } catch {}
    }
  });

  await win.loadURL(tool.homeUrl || tool.loginUrl);
  return { ok: true };
}

function boot() {
  const serverUrl = getServerUrl();
  if (!serverUrl) {
    createSetupWindow();
    return;
  }
  createMainWindow(serverUrl);
}

app.whenReady().then(() => {
  ipcMain.handle("studiogate:save-server-url", async (_e, url) => {
    store.set("serverUrl", normalizeUrl(url));
    for (const w of BrowserWindow.getAllWindows()) {
      try { w.close(); } catch {}
    }
    createMainWindow(getServerUrl());
    return { ok: true };
  });

  ipcMain.handle("studiogate:get-server-url", async () => getServerUrl());

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

  boot();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) boot();
});
