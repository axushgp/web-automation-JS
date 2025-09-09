const { PuppeteerAutomation, PlaywrightAutomation, StealthUtils } = require('../index');

/**
 * Simple test to validate the automation implementation
 */

async function testPuppeteerBasic() {
  console.log('Testing Puppeteer basic functionality...');
  const automation = new PuppeteerAutomation({
    browser: { headless: true }
  });

  try {
    await automation.init();
    console.log('✅ Puppeteer initialization successful');
    
    await automation.goto('https://httpbin.org/user-agent');
    console.log('✅ Puppeteer navigation successful');
    
    const content = await automation.getContent();
    if (content.includes('user-agent')) {
      console.log('✅ Puppeteer content retrieval successful');
    }
    
    await automation.close();
    console.log('✅ Puppeteer cleanup successful');
    return true;
  } catch (error) {
    console.error('❌ Puppeteer test failed:', error.message);
    return false;
  }
}

async function testPlaywrightBasic() {
  console.log('Testing Playwright basic functionality...');
  const automation = new PlaywrightAutomation({
    browserType: 'chromium',
    browser: { headless: true }
  });

  try {
    await automation.init();
    console.log('✅ Playwright initialization successful');
    
    await automation.goto('https://httpbin.org/user-agent');
    console.log('✅ Playwright navigation successful');
    
    const content = await automation.getContent();
    if (content.includes('user-agent')) {
      console.log('✅ Playwright content retrieval successful');
    }
    
    await automation.close();
    console.log('✅ Playwright cleanup successful');
    return true;
  } catch (error) {
    console.error('❌ Playwright test failed:', error.message);
    return false;
  }
}

function testStealthUtils() {
  console.log('Testing StealthUtils...');
  
  try {
    const userAgent = StealthUtils.getRandomUserAgent();
    if (userAgent && typeof userAgent === 'string') {
      console.log('✅ Random user agent generation successful');
    }
    
    const viewport = StealthUtils.getRandomViewport([
      { width: 1920, height: 1080 },
      { width: 1366, height: 768 }
    ]);
    if (viewport && viewport.width && viewport.height) {
      console.log('✅ Random viewport generation successful');
    }
    
    const headers = StealthUtils.getRandomHeaders();
    if (headers && typeof headers === 'object') {
      console.log('✅ Random headers generation successful');
    }
    
    return true;
  } catch (error) {
    console.error('❌ StealthUtils test failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('=== Running Basic Tests ===\n');
  
  const results = [];
  
  // Test utilities
  results.push(testStealthUtils());
  
  // Test Puppeteer
  results.push(await testPuppeteerBasic());
  
  // Test Playwright
  results.push(await testPlaywrightBasic());
  
  console.log('\n=== Test Results ===');
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`Passed: ${passed}/${total}`);
  
  if (passed === total) {
    console.log('🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed');
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testPuppeteerBasic,
  testPlaywrightBasic,
  testStealthUtils,
  runTests
};