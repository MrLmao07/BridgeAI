// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Aceasta este linia "magică" care îi permite lui Expo 
// să vadă fișierul tău Clean.db din assets
config.resolver.assetExts.push('db');

module.exports = config;