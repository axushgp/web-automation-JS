const { chromium } = require('playwright');

/**
 * Automates the process of finding and initiating an application for a specific job on Indeed.
 * The script continuously refreshes the page until the desired job posting is detected,
 * then proceeds with a sequence of actions.
 */
async function automateJobApplication() {
    // --- Configuration Variables ---
    const TARGET_URL = 'https://www.indeed.com/';
    const REFRESH_INTERVAL_MS = 3000; // 3 seconds
    const JOB_KEYWORDS_TO_FIND = 'Frontend Developer (Remote)';
    // Selector to initially detect the presence of the job posting anywhere on the page
    const JOB_POSTING_DETECTION_SELECTOR = `:is(a, div, h1, h2, h3):is(:has-text("${JOB_KEYWORDS_TO_FIND}"))`;

    let browser; // Declare browser outside try/catch for finally block access

    try {
        // --- Browser Initialization ---
        console.log('Launching browser...');
        browser = await chromium.launch({ headless: false }); // Set to true for headless operation
        const page = await browser.newPage();
        console.log('Browser launched and new page created.');

        // --- Job Posting Detection Loop ---
        let jobFound = false;
        console.log(`Starting continuous refresh and search for "${JOB_KEYWORDS_TO_FIND}"...`);

        while (!jobFound) {
            console.log(`Navigating to ${TARGET_URL}...`);
            await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });
            console.log('Page loaded.');

            // Check for the job posting using the specified selector
            const jobElement = await page.locator(JOB_POSTING_DETECTION_SELECTOR);
            const isJobVisible = await jobElement.isVisible();

            if (isJobVisible) {
                console.log(`SUCCESS: Job posting "${JOB_KEYWORDS_TO_FIND}" found on the page! Stopping refresh.`);
                jobFound = true; // Set flag to exit the loop
            } else {
                console.log(`Job posting "${JOB_KEYWORDS_TO_FIND}" not found. Waiting for ${REFRESH_INTERVAL_MS / 1000} seconds before refreshing.`);
                await page.waitForTimeout(REFRESH_INTERVAL_MS); // Wait before the next refresh
            }
        }

        // --- Action Sequence (executed only after job is detected) ---
        console.log('Executing action sequence...');

        // 1. TYPE the text "Frontend Developer" into the search input
        const searchInputSelector = 'input#text-input-what';
        console.log(`Waiting for search input: "${searchInputSelector}"`);
        await page.waitForSelector(searchInputSelector, { state: 'visible' });
        console.log(`Typing "Frontend Developer" into "${searchInputSelector}"...`);
        await page.type(searchInputSelector, 'Frontend Developer');
        console.log('Text typed.');

        // 2. CLICK on the "Find jobs" button
        const findJobsButtonSelector = 'button:has-text("Find jobs")';
        console.log(`Waiting for "Find jobs" button: "${findJobsButtonSelector}"`);
        await page.waitForSelector(findJobsButtonSelector, { state: 'visible' });
        console.log(`Clicking on "${findJobsButtonSelector}"...`);
        await page.click(findJobsButtonSelector);
        console.log('"Find jobs" button clicked.');

        // 3. WAIT for a fixed duration of 2000 milliseconds
        console.log('Waiting for 2000 milliseconds for search results to load...');
        await page.waitForTimeout(2000);
        console.log('2000 milliseconds passed.');

        // 4. CLICK on the specific "Frontend Developer (Remote)" job listing
        const jobListingLinkSelector = `a:has-text("${JOB_KEYWORDS_TO_FIND}")`;
        console.log(`Waiting for job listing link: "${jobListingLinkSelector}"`);
        await page.waitForSelector(jobListingLinkSelector, { state: 'visible' });
        console.log(`Clicking on "${jobListingLinkSelector}"...`);
        await page.click(jobListingLinkSelector);
        console.log('Job listing link clicked.');

        // 5. WAIT for a fixed duration of 3000 milliseconds
        console.log('Waiting for 3000 milliseconds for job details page to load...');
        await page.waitForTimeout(3000);
        console.log('3000 milliseconds passed.');

        // 6. CLICK on the "Apply now" or "Submit application" button
        const applyButtonSelector = '#indeed-apply-widget-form-submit-button';
        console.log(`Waiting for apply button: "${applyButtonSelector}"`);
        await page.waitForSelector(applyButtonSelector, { state: 'visible' });
        console.log(`Clicking on "${applyButtonSelector}"...`);
        await page.click(applyButtonSelector);
        console.log('Apply button clicked. Application process initiated (further steps would be needed for full application).');

        console.log('Automation script completed successfully!');

    } catch (error) {
        // --- Error Handling ---
        console.error('An error occurred during automation:', error);
        console.error('Attempting to capture screenshot for debugging...');
        if (browser && browser.pages().length > 0) {
            const page = browser.pages()[0]; // Get the active page
            try {
                await page.screenshot({ path: 'error_screenshot.png' });
                console.log('Screenshot saved as error_screenshot.png');
            } catch (screenshotError) {
                console.error('Failed to capture screenshot:', screenshotError);
            }
        }
    } finally {
        // --- Browser Cleanup ---
        if (browser) {
            console.log('Closing browser...');
            await browser.close();
            console.log('Browser closed.');
        }
    }
}

// --- Execute the automation function ---
automateJobApplication();