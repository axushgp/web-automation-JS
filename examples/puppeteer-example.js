const PuppeteerAutomation = require('../src/puppeteer/automation');

/**
 * Example: Basic Puppeteer automation with Cloudflare bypass
 */
async function basicPuppeteerExample() {
  const automation = new PuppeteerAutomation({
    browser: {
      headless: false // Set to true for production
    }
  });

  try {
    console.log('Initializing Puppeteer automation...');
    await automation.init();

    console.log('Navigating to target website...');
    await automation.goto('https://nowsecure.nl'); // Known Cloudflare-protected site for testing

    console.log('Taking screenshot...');
    await automation.screenshot('examples/puppeteer-result.png');

    console.log('Getting page title...');
    const title = await automation.page.title();
    console.log('Page title:', title);

    // Simulate some human interaction
    console.log('Simulating human behavior...');
    await automation.page.evaluate(() => {
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
 * Example: Advanced Puppeteer automation with form interaction
 */
async function advancedPuppeteerExample() {
  const automation = new PuppeteerAutomation({
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
    console.log('Initializing advanced Puppeteer automation...');
    await automation.init();

    console.log('Testing with a form-based site...');
    await automation.goto('https://httpbin.org/forms/post');

    // Wait for page to load
    await automation.page.waitForSelector('form', { timeout: 10000 });

    console.log('Filling form with human-like behavior...');
    
    // Fill customer name
    await automation.type('input[name="custname"]', 'John Doe');
    
    // Fill customer telephone
    await automation.type('input[name="custtel"]', '+1234567890');
    
    // Fill customer email
    await automation.type('input[name="custemail"]', 'john.doe@example.com');
    
    // Select pizza size
    await automation.click('input[value="large"]');
    
    // Add toppings
    await automation.click('input[name="topping"][value="cheese"]');
    await automation.click('input[name="topping"][value="mushroom"]');
    
    // Fill delivery time
    await automation.type('input[name="delivery"]', '12:30');
    
    // Fill comments
    await automation.type('textarea[name="comments"]', 'Please deliver to the main entrance.');

    console.log('Taking screenshot of filled form...');
    await automation.screenshot('examples/puppeteer-form.png');

    console.log('Form filled successfully with stealth techniques!');

  } catch (error) {
    console.error('Advanced automation failed:', error);
  } finally {
    await automation.close();
  }
}

// Run examples
async function runExamples() {
  console.log('=== Running Puppeteer Examples ===\n');
  
  console.log('1. Basic Example:');
  await basicPuppeteerExample();
  
  console.log('\n2. Advanced Example:');
  await advancedPuppeteerExample();
  
  console.log('\n=== Puppeteer Examples Completed ===');
}

// Export for use as module or run directly
if (require.main === module) {
  runExamples().catch(console.error);
}

module.exports = {
  basicPuppeteerExample,
  advancedPuppeteerExample,
  runExamples
};