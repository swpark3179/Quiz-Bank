// Electron main process for the Quiz-Bank Windows desktop build.
//
// The app is an Expo Router web app exported as a static site (`expo export
// --platform web` → `dist/`). We serve that static output through a custom
// `app://` scheme instead of `file://` for two reasons:
//   1. The export uses absolute asset paths (e.g. `/_expo/...`), which break
//      under `file://`. A standard scheme resolves them against the host.
//   2. A scheme registered as `secure` is treated as a secure context, which
//      is what expo-sqlite's web (OPFS) implementation needs to persist data.

const { app, protocol, BrowserWindow, net } = require('electron');
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

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 480,
    minHeight: 640,
    backgroundColor: '#ECEFF4',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL('app://local/');
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
    return new Response(response.body, {
      status: response.status,
      headers,
    });
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
