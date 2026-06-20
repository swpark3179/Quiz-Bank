const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// expo-sqlite's web (wa-sqlite) implementation imports a `.wasm` binary, so
// Metro must treat `.wasm` as a bundled asset. Required for the web/Electron
// build; native builds are unaffected.
config.resolver.assetExts.push('wasm');

// On web, react-native-gifted-charts requires react-native-linear-gradient
// (no web support; calls requireNativeComponent) and falls back to
// expo-linear-gradient, which carries a 'use client' directive that throws
// during Expo Router's static export server pass. Redirect to a CSS-gradient
// shim so the first require resolves successfully on both client and SSR.
const linearGradientWebShim = path.resolve(__dirname, 'shims/linear-gradient-web.js');
const upstreamResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'react-native-linear-gradient') {
    return { type: 'sourceFile', filePath: linearGradientWebShim };
  }
  if (typeof upstreamResolveRequest === 'function') {
    return upstreamResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
