const { app, BrowserWindow, ipcMain, session, dialog } = require("electron");
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

  mainWindow.loadURL(`${APP_URL}/login`);
}

async function captureStorage(ses, kind) {
  const cookies = await ses.cookies.get({});
  // Best-effort localStorage from an about:blank helper is unreliable across domains.
  // We open a tiny hidden window on the tool origin after login via the connect window itself.
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

/**
 * Admin connects a tool: login in isolated window, press Save when ready.
 */
async function connectTool({ toolId, loginUrl, kind }) {
  const partition = `persist:studiogate-connect-${kind}-${Date.now()}`;
  const ses = session.fromPartition(partition, { cache: true });

  const win = new BrowserWindow({
    width: 1200,
    height: 860,
    title: `StudioGate Connect · ${kind} — log in to TEAM account, then click Save`,
    webPreferences: {
      session: ses,
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "connect-preload.js"),
    },
  });

  // Floating control window with Save / Cancel
  const controls = new BrowserWindow({
    width: 420,
    height: 180,
    parent: win,
    modal: false,
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
    1) Log into the <b>TEAM</b> account (not billing owner)<br/>
    2) Wait until the tool UI loads<br/>
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
    const onSave = () => resolve("save");
    const onCancel = () => resolve("cancel");
    ipcMain.once("studiogate:connect-save", onSave);
    ipcMain.once("studiogate:connect-cancel", onCancel);
    win.on("closed", () => resolve("cancel"));
  });

  if (decision !== "save") {
    try {
      controls.close();
    } catch {}
    try {
      win.close();
    } catch {}
    return { ok: false, error: "Connect cancelled" };
  }

  // Try read localStorage from the tool page
  let localStorage = {};
  try {
    localStorage = await win.webContents.executeJavaScript(`
      (() => {
        const out = {};
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          out[k] = localStorage.getItem(k);
        }
        return out;
      })()
    `);
  } catch {
    localStorage = {};
  }

  const storage = await captureStorage(ses, kind);
  storage.localStorage = localStorage;
  storage.note = "Captured via StudioGate desktop Connect";

  try {
    controls.close();
  } catch {}
  try {
    win.close();
  } catch {}

  if (!storage.cookies.length) {
    return {
      ok: false,
      error: "No cookies captured. Make sure you fully logged in before Save.",
    };
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
    } catch {
      // skip invalid cookie
    }
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
      } catch {
        // ignore
      }
    }
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

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});
