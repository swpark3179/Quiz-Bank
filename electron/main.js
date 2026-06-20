// Electron main process for the Quiz-Bank Windows desktop build.
//
// The app is an Expo Router web app exported as a static site (`expo export
// --platform web` → `dist/`). We serve that static output through a custom
// `app://` scheme instead of `file://` for two reasons:
//   1. The export uses absolute asset paths (e.g. `/_expo/...`), which break
//      under `file://`. A standard scheme resolves them against the host.
//   2. A scheme registered as `secure` is treated as a secure context, which
//      is what expo-sqlite's web (OPFS) implementation needs to persist data.

const { app, protocol, BrowserWindow, Menu, net } = require('electron');
const fs = require('node:fs');
const path = require('node:path');
const url = require('node:url');

// Static export lives next to this file's parent (packaged: resources/app/dist).
const DIST_DIR = path.join(__dirname, '..', 'dist');

// Quiz markdown data is shipped as a separate `quiz-data` folder next to the
// portable .exe so users can update problem sets without re-downloading the
// app. In dev (unpackaged), fall back to the repo's `assets/quiz-data`.
//
// `PORTABLE_EXECUTABLE_DIR` is set by electron-builder's portable target and
// points to the directory of the .exe the user actually launched.
function resolveQuizDataDir() {
  const portableDir = process.env.PORTABLE_EXECUTABLE_DIR;
  if (portableDir) {
    return path.join(portableDir, 'quiz-data');
  }
  if (app.isPackaged) {
    return path.join(path.dirname(process.execPath), 'quiz-data');
  }
  return path.join(__dirname, '..', 'assets', 'quiz-data');
}

const QUIZ_DATA_DIR = resolveQuizDataDir();

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.map': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.wasm': 'application/wasm',
  '.txt': 'text/plain',
};

// Long-cache headers for hashed/static bundle assets. Two warm-start wins:
//   1. Chromium's HTTP cache skips re-reading bytes from disk on later loads.
//   2. V8 code cache for .js responses only kicks in when the response is
//      considered cacheable, which requires a max-age.
// quiz-data is excluded (handled separately with no-store) so problem sets
// can be hot-swapped next to the .exe without an app restart.
const LONG_CACHE = 'public, max-age=31536000, immutable';

// Zoom persistence: stored in userData so it survives reinstalls of a portable
// build (userData lives under %APPDATA% on Windows, not next to the .exe).
const ZOOM_MIN = -3;
const ZOOM_MAX = 5;
const ZOOM_STEP = 0.5;

function settingsPath() {
  return path.join(app.getPath('userData'), 'settings.json');
}

function loadZoomLevel() {
  try {
    const raw = fs.readFileSync(settingsPath(), 'utf8');
    const parsed = JSON.parse(raw);
    const z = Number(parsed.zoomLevel);
    if (Number.isFinite(z) && z >= ZOOM_MIN && z <= ZOOM_MAX) {
      return z;
    }
  } catch {
    // First run or corrupt file — fall through to default.
  }
  return 0;
}

function saveZoomLevel(level) {
  try {
    fs.mkdirSync(path.dirname(settingsPath()), { recursive: true });
    fs.writeFileSync(settingsPath(), JSON.stringify({ zoomLevel: level }));
  } catch {
    // Persisting zoom is best-effort; ignore disk errors.
  }
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

function applyZoom(win, nextLevel) {
  const level = clamp(nextLevel, ZOOM_MIN, ZOOM_MAX);
  win.webContents.setZoomLevel(level);
  saveZoomLevel(level);
}

// Register the custom scheme as standard + secure BEFORE app is ready so that
// the renderer treats `app://local/` as a secure, fetch-capable origin.
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      stream: true,
      corsEnabled: true,
    },
  },
]);

function buildMenu(getWindow) {
  // Korean labels match the rest of the app's UI.
  const zoomMenu = {
    label: '보기',
    submenu: [
      {
        label: '확대',
        // CommandOrControl++ covers both '=' and numeric-keypad '+'; the
        // explicit '+' accelerator improves discoverability in the menu.
        accelerator: 'CommandOrControl+=',
        click: () => {
          const win = getWindow();
          if (!win) return;
          applyZoom(win, win.webContents.getZoomLevel() + ZOOM_STEP);
        },
      },
      {
        // Hidden duplicate so Ctrl++ on the main row also works.
        accelerator: 'CommandOrControl+Plus',
        visible: false,
        click: () => {
          const win = getWindow();
          if (!win) return;
          applyZoom(win, win.webContents.getZoomLevel() + ZOOM_STEP);
        },
      },
      {
        label: '축소',
        accelerator: 'CommandOrControl+-',
        click: () => {
          const win = getWindow();
          if (!win) return;
          applyZoom(win, win.webContents.getZoomLevel() - ZOOM_STEP);
        },
      },
      {
        label: '기본 크기',
        accelerator: 'CommandOrControl+0',
        click: () => {
          const win = getWindow();
          if (!win) return;
          applyZoom(win, 0);
        },
      },
      { type: 'separator' },
      { role: 'togglefullscreen', label: '전체 화면' },
    ],
  };
  return Menu.buildFromTemplate([zoomMenu]);
}

function createWindow() {
  const initialZoom = loadZoomLevel();
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 480,
    minHeight: 640,
    backgroundColor: '#ECEFF4',
    autoHideMenuBar: true,
    // Defer showing the window until the renderer has painted its first
    // frame. Without this the user sees a blank white window for the
    // duration of the bundle parse, which reads as "slow startup" even
    // when the actual time-to-interactive hasn't changed.
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.webContents.once('did-finish-load', () => {
    // setZoomLevel must run after the page has loaded; setting it before
    // navigation is silently reset by Chromium. `once` so a later reload
    // doesn't clobber a zoom level the user adjusted in-session.
    win.webContents.setZoomLevel(initialZoom);
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  win.loadURL('app://local/');

  return win;
}

app.whenReady().then(() => {
  protocol.handle('app', async (request) => {
    const { pathname } = new URL(request.url);

    // Decode and strip the leading slash; default to index.html for the root.
    let relativePath = decodeURIComponent(pathname).replace(/^\/+/, '');
    if (relativePath === '') {
      relativePath = 'index.html';
    }

    // `quiz-data/*` is served from a sibling folder next to the .exe so that
    // problem sets can be updated independently of the app binary.
    const isQuizData = relativePath === 'quiz-data' || relativePath.startsWith('quiz-data/');
    const baseDir = isQuizData ? QUIZ_DATA_DIR : DIST_DIR;
    const subPath = isQuizData ? relativePath.replace(/^quiz-data\/?/, '') : relativePath;

    // Resolve within baseDir and guard against path traversal.
    let filePath = path.normalize(path.join(baseDir, subPath));
    if (!filePath.startsWith(baseDir)) {
      return new Response('Forbidden', { status: 403 });
    }

    let ext = path.extname(filePath).toLowerCase();

    // For quiz-data requests we must not fall back to the SPA index.html when
    // the file is missing; surface a real 404 so the renderer can react.
    if (isQuizData) {
      if (!fs.existsSync(filePath)) {
        return new Response('Not Found', { status: 404 });
      }
      const fileUrl = url.pathToFileURL(filePath).toString();
      const response = await net.fetch(fileUrl);
      const headers = new Headers(response.headers);
      headers.set('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
      headers.set('Cache-Control', 'no-store');
      return new Response(response.body, { status: response.status, headers });
    }

    // Expo static export pre-renders routes to <route>.html, but client-side
    // navigation requests extension-less paths. Fall back to index.html so the
    // SPA router can take over (matches typical static-host SPA behaviour).
    if (ext === '') {
      filePath = path.join(DIST_DIR, 'index.html');
      ext = '.html';
    }

    const fileUrl = url.pathToFileURL(filePath).toString();
    const response = await net.fetch(fileUrl);

    if (!response.ok && ext !== '.html') {
      // Missing non-HTML asset: surface a 404 as-is.
      return response;
    }

    const headers = new Headers(response.headers);
    headers.set('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
    // index.html must always be re-validated so a new export is picked up
    // without users wiping cache; other bundle assets are content-hashed by
    // Expo's web export and safe to cache forever.
    if (ext === '.html') {
      headers.set('Cache-Control', 'no-cache');
    } else {
      headers.set('Cache-Control', LONG_CACHE);
    }
    return new Response(response.body, {
      status: response.status,
      headers,
    });
  });

  let mainWindow = createWindow();
  Menu.setApplicationMenu(buildMenu(() => mainWindow));

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
