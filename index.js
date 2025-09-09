/**
 * Web Automation JS - Cloudflare Anti-Bot Bypass
 * Main entry point for the automation library
 */

const PuppeteerAutomation = require('./src/puppeteer/automation');
const PlaywrightAutomation = require('./src/playwright/automation');
const StealthUtils = require('./src/utils/stealth');
const config = require('./src/config/default');

module.exports = {
  // Main automation classes
  PuppeteerAutomation,
  PlaywrightAutomation,
  
  // Utilities
  StealthUtils,
  
  // Configuration
  config,
  
  // Factory methods for convenience
  createPuppeteerAutomation: (options = {}) => new PuppeteerAutomation(options),
  createPlaywrightAutomation: (options = {}) => new PlaywrightAutomation(options)
};