const PlaywrightAutomation = require('../src/playwright/automation');

/**
 * Example: Basic Playwright automation with Cloudflare bypass
 */
async function basicPlaywrightExample() {
  const automation = new PlaywrightAutomation({
    browserType: 'chromium',
    browser: {
      headless: false // Set to true for production
    }
  });

  try {
    console.log('Initializing Playwright automation...');
    await automation.init();

    console.log('Navigating to target website...');
    await automation.goto('https://nowsecure.nl'); // Known Cloudflare-protected site for testing

    console.log('Taking screenshot...');
    await automation.screenshot('examples/playwright-result.png');

    console.log('Getting page title...');
    const title = await automation.page.title();
    console.log('Page title:', title);

    // Simulate some human interaction
    console.log('Simulating human behavior...');
    await automation.evaluate(() => {
      window.scrollBy(0, 300);
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));

  } catch (error) {
    console.error('Automation failed:', error);
  } finally {
    await automation.close();
  }
}

/**
 * Example: Multi-browser Playwright automation
 */
async function multiBrowserExample() {
  const browsers = ['chromium', 'firefox'];
  
  for (const browserType of browsers) {
    console.log(`\n--- Testing with ${browserType} ---`);
    
    const automation = new PlaywrightAutomation({
      browserType,
      browser: {
        headless: false
      }
    });

    try {
      await automation.init();
      
      await automation.goto('https://httpbin.org/user-agent');
      
      // Get user agent
      const userAgent = await automation.evaluate(() => {
        return document.querySelector('pre').textContent;
      });
      
      console.log(`User Agent for ${browserType}:`, JSON.parse(userAgent)['user-agent']);
      
      await automation.screenshot(`examples/playwright-${browserType}.png`);
      
    } catch (error) {
      console.error(`${browserType} automation failed:`, error);
    } finally {
      await automation.close();
    }
  }
}

/**
 * Example: Advanced form handling with Playwright
 */
async function advancedPlaywrightExample() {
  const automation = new PlaywrightAutomation({
    browserType: 'chromium',
    browser: {
      headless: false
    },
    stealth: {
      userAgent: {
        enabled: true,
        rotate: true
      },
      viewport: {
        enabled: true,
        randomize: true
      }
    }
  });

  try {
    console.log('Initializing advanced Playwright automation...');
    await automation.init();

    console.log('Testing with a search form...');
    await automation.goto('https://duckduckgo.com');

    // Wait for search box
    await automation.waitForSelector('input[name="q"]');

    console.log('Performing search with human-like behavior...');
    
    // Type search query
    await automation.type('input[name="q"]', 'web automation playwright');
    
    // Submit search
    await automation.click('button[type="submit"]');
    
    // Wait for results
    await automation.waitForSelector('article[data-testid="result"]', { timeout: 10000 });

    console.log('Taking screenshot of search results...');
    await automation.screenshot('examples/playwright-search.png');

    // Get first result title
    const firstResult = await automation.evaluate(() => {
      const firstArticle = document.querySelector('article[data-testid="result"]');
      return firstArticle ? firstArticle.querySelector('h2').textContent : 'No results found';
    });
    
    console.log('First search result:', firstResult);

  } catch (error) {
    console.error('Advanced automation failed:', error);
  } finally {
    await automation.close();
  }
}

/**
 * Example: Cloudflare challenge handling
 */
async function cloudflareBypassExample() {
  const automation = new PlaywrightAutomation({
    browserType: 'chromium',
    browser: {
      headless: false
    },
    cloudflare: {
      waitTimeout: 45000, // Longer timeout for challenges
      retryAttempts: 3
    }
  });

  try {
    console.log('Testing Cloudflare bypass capabilities...');
    await automation.init();

    // Test with a known Cloudflare-protected site
    console.log('Attempting to bypass Cloudflare protection...');
    await automation.goto('https://nowsecure.nl');

    // Wait a bit to see if we're through
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Check if we successfully bypassed
    const pageContent = await automation.getContent();
    const hasCloudflare = pageContent.includes('Checking your browser') || 
                         pageContent.includes('DDoS protection by Cloudflare');

    if (!hasCloudflare) {
      console.log('✅ Successfully bypassed Cloudflare protection!');
      await automation.screenshot('examples/cloudflare-bypass-success.png');
    } else {
      console.log('⚠️  Still showing Cloudflare challenge');
      await automation.screenshot('examples/cloudflare-challenge.png');
    }

  } catch (error) {
    console.error('Cloudflare bypass test failed:', error);
  } finally {
    await automation.close();
  }
}

// Run examples
async function runExamples() {
  console.log('=== Running Playwright Examples ===\n');
  
  console.log('1. Basic Example:');
  await basicPlaywrightExample();
  
  console.log('\n2. Multi-Browser Example:');
  await multiBrowserExample();
  
  console.log('\n3. Advanced Example:');
  await advancedPlaywrightExample();
  
  console.log('\n4. Cloudflare Bypass Example:');
  await cloudflareBypassExample();
  
  console.log('\n=== Playwright Examples Completed ===');
}

// Export for use as module or run directly
if (require.main === module) {
  runExamples().catch(console.error);
}

module.exports = {
  basicPlaywrightExample,
  multiBrowserExample,
  advancedPlaywrightExample,
  cloudflareBypassExample,
  runExamples
};