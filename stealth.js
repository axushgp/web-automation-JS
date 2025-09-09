const { chromium } = require('playwright-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

chromium.use(StealthPlugin());

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('Navigating...');
  await page.goto('https://www.whatismybrowser.com/detect/what-is-my-user-agent');

  // Screenshot for sanity check
  await page.screenshot({ path: 'stealth-check.png' });
  console.log('Screenshot saved: stealth-check.png');

  await browser.close();
})();
