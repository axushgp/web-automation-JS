// cloudfare verification skipping... stealth added

// Import Playwright Extra with Stealth
const { chromium } = require('playwright-extra');
const stealth = require('playwright-extra-plugin-stealth')();
chromium.use(stealth);

async function automateJobApplication() {
    // --- Config ---
    const TARGET_URL = 'https://www.indeed.com/';
    const JOB_KEYWORDS_SEARCH = 'Frontend Developer';
    const JOB_KEYWORDS_TO_FIND = 'Frontend Developer (Remote)';

    let browser;
    try {
        console.log('Launching browser with stealth...');
        browser = await chromium.launch({ headless: false });
        const context = await browser.newContext();
        const page = await context.newPage();

        // --- Step 1: Go to Indeed ---
        console.log(`Navigating to ${TARGET_URL}...`);
        await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });

        // --- Step 2: Search for job ---
        const searchInputSelector = 'input#text-input-what';
        console.log('Typing into search input...');
        await page.fill(searchInputSelector, JOB_KEYWORDS_SEARCH);
        console.log('Clicking Find jobs button...');
        await page.click('button:has-text("Find jobs")');
        await page.waitForLoadState('domcontentloaded');
        console.log('Search results page loaded.');

        // --- Step 3: Loop until target job is found ---
        const randomDelay = (min, max) =>
            Math.floor(Math.random() * (max - min + 1)) + min;

        let jobFound = false;
        while (!jobFound) {
            console.log(`Checking for "${JOB_KEYWORDS_TO_FIND}"...`);
            const jobElement = page.locator(`a:has-text("${JOB_KEYWORDS_TO_FIND}")`);
            if (await jobElement.count() > 0) {
                console.log(`SUCCESS: Job posting "${JOB_KEYWORDS_TO_FIND}" found!`);
                jobFound = true;
                await jobElement.first().click();
                await page.waitForLoadState('domcontentloaded');
                break;
            }

            // Not found → wait human-like interval before refresh
            const waitTime = randomDelay(15000, 45000); // 15–45s
            console.log(
                `Not found. Waiting ${(waitTime / 1000).toFixed(1)}s before refreshing...`
            );
            await page.waitForTimeout(waitTime);
            await page.reload({ waitUntil: 'domcontentloaded' });
        }

        // --- Step 4: Apply ---
        console.log('Looking for Apply button...');
        const applyButtonSelector = '#indeed-apply-widget-form-submit-button';
        await page.waitForSelector(applyButtonSelector, { timeout: 15000 });
        await page.click(applyButtonSelector);
        console.log('Apply button clicked. Application started.');

    } catch (error) {
        console.error('Error during automation:', error);
    } finally {
        if (browser) {
            console.log('Closing browser...');
            await browser.close();
        }
    }
}

automateJobApplication();
