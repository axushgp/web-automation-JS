// WORKS !!! loads up indeed, searches for "frontend developer"job, and then keeps refreshing ONLY the result page (instead of going to homepage)

const { chromium } = require('playwright-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// Enable stealth
chromium.use(StealthPlugin());

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const SEARCH_TERM = 'Frontend Developer';
  const TARGET_JOB = 'Frontend Developer (Remote)';  // exact match you want

  console.log('Opening Indeed...');
  await page.goto('https://www.indeed.com/', { waitUntil: 'domcontentloaded' });

  // --- Step 1: Perform the search once ---
  console.log(`Searching for "${SEARCH_TERM}"...`);
  await page.waitForSelector('input#text-input-what', { state: 'visible' });
  await page.fill('input#text-input-what', SEARCH_TERM);
  await page.click('button[type="submit"]'); // "Find jobs" button

  // Wait for results to load
  await page.waitForTimeout(3000);

  // --- Step 2: Loop on the results page until job appears ---
  let jobFound = false;
  while (!jobFound) {
    console.log('Checking results page...');
    const jobElement = page.locator(`a:has-text("${TARGET_JOB}")`).first();

    if (await jobElement.isVisible().catch(() => false)) {
      console.log(`SUCCESS: Found job "${TARGET_JOB}". Clicking...`);
      await jobElement.click();
      jobFound = true;

      // --- Step 3: Apply if possible ---
      await page.waitForTimeout(3000);
      const applyBtn = '#indeed-apply-widget-form-submit-button';

      if (await page.locator(applyBtn).isVisible().catch(() => false)) {
        console.log('Clicking Apply...');
        await page.click(applyBtn);
        console.log('Application started!');
      } else {
        console.log('Apply button not found — job may redirect externally.');
      }
    } else {
      console.log(`Job "${TARGET_JOB}" not found. Refreshing results...`);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
    }
  }

  await browser.close();
})();
