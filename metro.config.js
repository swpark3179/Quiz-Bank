const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// .md 파일을 에셋(텍스트)으로 번들링
config.resolver.assetExts.push('md');

module.exports = config;
