#!/usr/bin/env node

/**
 * Demo script showcasing the web automation features
 * This script demonstrates configuration and stealth utilities without requiring browser installation
 */

const { PuppeteerAutomation, PlaywrightAutomation, StealthUtils, config } = require('./index');

console.log('🚀 Web Automation JS - Cloudflare Anti-Bot Bypass Demo\n');

// Display configuration
console.log('📋 Default Configuration:');
console.log('  Browser args:', config.browser.args.length, 'stealth arguments configured');
console.log('  Stealth mode:', config.stealth.userAgent.enabled ? 'Enabled' : 'Disabled');
console.log('  Viewport randomization:', config.stealth.viewport.randomize ? 'Enabled' : 'Disabled');
console.log('  Cloudflare timeout:', config.cloudflare.waitTimeout, 'ms');
console.log();

// Demonstrate StealthUtils
console.log('🥷 Stealth Utilities Demo:');

console.log('\n1. Random User Agents:');
for (let i = 0; i < 3; i++) {
  const ua = StealthUtils.getRandomUserAgent();
  console.log(`   ${i + 1}. ${ua.substring(0, 80)}...`);
}

console.log('\n2. Random Viewports:');
for (let i = 0; i < 3; i++) {
  const viewport = StealthUtils.getRandomViewport(config.stealth.viewport.sizes);
  console.log(`   ${i + 1}. ${viewport.width}x${viewport.height}`);
}

console.log('\n3. Random Headers:');
const headers = StealthUtils.getRandomHeaders();
Object.keys(headers).slice(0, 5).forEach(key => {
  console.log(`   ${key}: ${headers[key]}`);
});

console.log('\n4. Random Delays:');
console.log(`   Min delay: ${config.stealth.timing.minDelay}ms`);
console.log(`   Max delay: ${config.stealth.timing.maxDelay}ms`);
console.log(`   Typing delay: ${StealthUtils.getTypingDelay()}ms`);

// Demonstrate class instantiation
console.log('\n🤖 Automation Classes Demo:');

console.log('\n1. Puppeteer Automation:');
const puppeteerBot = new PuppeteerAutomation({
  browser: { headless: true },
  stealth: {
    userAgent: { enabled: true, rotate: true },
    viewport: { randomize: true }
  }
});
console.log('   ✅ PuppeteerAutomation instance created');
console.log('   📊 Configuration merged successfully');
console.log(`   🎯 Stealth features: ${Object.keys(puppeteerBot.config.stealth).length} categories`);

console.log('\n2. Playwright Automation:');
const playwrightBot = new PlaywrightAutomation({
  browserType: 'chromium',
  browser: { headless: true },
  cloudflare: { waitTimeout: 45000 }
});
console.log('   ✅ PlaywrightAutomation instance created');
console.log('   🌐 Browser type: chromium');
console.log(`   ⏱️  Cloudflare timeout: ${playwrightBot.config.cloudflare.waitTimeout}ms`);

// Demonstrate factory methods
console.log('\n3. Factory Methods:');
const { createPuppeteerAutomation, createPlaywrightAutomation } = require('./index');

const factoryPuppeteer = createPuppeteerAutomation({ browser: { headless: true } });
const factoryPlaywright = createPlaywrightAutomation({ browserType: 'firefox' });

console.log('   ✅ Factory methods working');
console.log('   🏭 createPuppeteerAutomation() ✓');
console.log('   🏭 createPlaywrightAutomation() ✓');

// Show project structure
console.log('\n📁 Project Structure:');
console.log('   📦 web-automation-js/');
console.log('   ├── 📄 index.js (main entry point)');
console.log('   ├── 📂 src/');
console.log('   │   ├── 📂 config/ (configuration management)');
console.log('   │   ├── 📂 puppeteer/ (Puppeteer automation)');
console.log('   │   ├── 📂 playwright/ (Playwright automation)');
console.log('   │   └── 📂 utils/ (stealth utilities)');
console.log('   ├── 📂 examples/ (usage examples)');
console.log('   ├── 📂 test/ (unit tests)');
console.log('   └── 📄 README.md (documentation)');

// Show available scripts
console.log('\n🔧 Available Scripts:');
console.log('   npm start                 - Run Puppeteer examples');
console.log('   npm run example:puppeteer - Run Puppeteer examples');
console.log('   npm run example:playwright- Run Playwright examples');
console.log('   npm test                  - Run unit tests');
console.log('   npm run install-browsers  - Install browser binaries');

// Show anti-bot features
console.log('\n🛡️  Anti-Bot Bypass Features:');
console.log('   ✅ User Agent Rotation');
console.log('   ✅ Viewport Randomization');
console.log('   ✅ Browser Fingerprint Evasion');
console.log('   ✅ Human Behavior Simulation');
console.log('   ✅ Cloudflare Challenge Detection');
console.log('   ✅ Request Timing Variations');
console.log('   ✅ Realistic HTTP Headers');
console.log('   ✅ Proxy Support');
console.log('   ✅ Stealth Plugin Integration');

console.log('\n🎯 Next Steps:');
console.log('   1. Run "npm run install-browsers" to install browser binaries');
console.log('   2. Run "npm run example:puppeteer" to see Puppeteer in action');
console.log('   3. Run "npm run example:playwright" to see Playwright in action');
console.log('   4. Customize configuration in src/config/default.js');
console.log('   5. Check examples/ folder for usage patterns');

console.log('\n🚀 Ready to bypass Cloudflare and other anti-bot systems!');
console.log('   Use responsibly and respect website terms of service.\n');