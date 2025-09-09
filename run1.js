// const { chromium } = require('playwright');

// async function automateJobApplication() {
//     const TARGET_URL = 'https://www.indeed.com/';
//     const REFRESH_INTERVAL_MS = 3000;
//     const JOB_KEYWORDS_TO_FIND = 'Frontend Developer (Remote)';

//     let browser;
//     try {
//         console.log('Launching browser...');
//         browser = await chromium.launch({ headless: false });
//         const page = await browser.newPage();

//         console.log(`Navigating to ${TARGET_URL}...`);
//         await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });

//         let jobFound = false;

//         while (!jobFound) {
//             console.log('Checking for job posting...');
//             const jobElement = page.locator(`text=${JOB_KEYWORDS_TO_FIND}`);
//             const jobCount = await jobElement.count();

//             if (jobCount > 0) {
//                 console.log(`SUCCESS: Job posting "${JOB_KEYWORDS_TO_FIND}" found!`);
//                 jobFound = true;
//                 break;
//             } else {
//                 console.log(`Not found. Waiting ${REFRESH_INTERVAL_MS / 1000}s before refreshing...`);
//                 await page.waitForTimeout(REFRESH_INTERVAL_MS);
//                 await page.reload({ waitUntil: 'domcontentloaded' });
//             }
//         }

//         console.log('Executing action sequence...');

//         // 1. Type into search input
//         const searchInputSelector = 'input#text-input-what';
//         await page.fill(searchInputSelector, 'Frontend Developer');

//         // 2. Click "Find jobs"
//         await page.click('button:has-text("Find jobs")');

//         // 3. Wait for results
//         await page.waitForTimeout(2000);

//         // 4. Click on specific job
//         await page.click(`a:has-text("${JOB_KEYWORDS_TO_FIND}")`);

//         // 5. Wait
//         await page.waitForTimeout(3000);

//         // 6. Click Apply
//         await page.click('#indeed-apply-widget-form-submit-button');

//         console.log('Application process initiated!');
//     } catch (error) {
//         console.error('Error:', error);
//     } finally {
//         if (browser) {
//             console.log('Closing browser...');
//             await browser.close();
//         }
//     }
// }

// automateJobApplication();



// SEARCH WORKS... BUT THEN CLOUDFARE BOT VERIFICATION STARTS UP cuz:
// Playwright launches Chromium with default fingerprints (which r very detectable).
// Continuous reloads every few seconds look like scraping.

const { chromium } = require('playwright');

async function automateJobApplication() {
    const TARGET_URL = 'https://www.indeed.com/';
    const REFRESH_INTERVAL_MS = 3000;
    const JOB_KEYWORDS_TO_FIND = 'Frontend Developer (Remote)';

    let browser;
    try {
        console.log('Launching browser...');
        browser = await chromium.launch({ headless: false });
        const page = await browser.newPage();

        // --- Step 1: Go to Indeed homepage ---
        console.log(`Navigating to ${TARGET_URL}...`);
        await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });

        // --- Step 2: Enter search keywords and click "Find jobs" ---
        const searchInputSelector = 'input#text-input-what';
        await page.fill(searchInputSelector, 'Frontend Developer');
        await page.click('button:has-text("Find jobs")');
        await page.waitForLoadState('domcontentloaded');

        console.log('Search submitted. Now monitoring results page...');

        // --- Step 3: Loop until job found ---
        let jobFound = false;
        while (!jobFound) {
            const jobElement = page.locator(`a:has-text("${JOB_KEYWORDS_TO_FIND}")`);
            const jobCount = await jobElement.count();

            if (jobCount > 0) {
                console.log(`SUCCESS: Job posting "${JOB_KEYWORDS_TO_FIND}" found!`);
                jobFound = true;
                await jobElement.first().click();
                await page.waitForLoadState('domcontentloaded');
            } else {
                console.log(`Not found. Waiting ${REFRESH_INTERVAL_MS / 1000}s before refreshing...`);
                await page.waitForTimeout(REFRESH_INTERVAL_MS);
                await page.reload({ waitUntil: 'domcontentloaded' });
            }
        }

        // --- Step 4: Apply ---
        console.log('Waiting for apply button...');
        const applyButtonSelector = '#indeed-apply-widget-form-submit-button';
        await page.waitForSelector(applyButtonSelector, { timeout: 10000 });
        await page.click(applyButtonSelector);
        console.log('Apply button clicked. Application started.');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (browser) {
            console.log('Closing browser...');
            await browser.close();
        }
    }
}

automateJobApplication();
