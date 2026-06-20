const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// expo-sqlite's web (wa-sqlite) implementation imports a `.wasm` binary, so
// Metro must treat `.wasm` as a bundled asset. Required for the web/Electron
// build; native builds are unaffected.
config.resolver.assetExts.push('wasm');

module.exports = config;
