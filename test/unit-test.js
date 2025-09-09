const { StealthUtils, config } = require('../index');

/**
 * Unit tests that don't require browser installation
 */

function testConfigurationLoading() {
  console.log('Testing configuration loading...');
  
  try {
    // Test that config is properly loaded
    if (config && typeof config === 'object') {
      console.log('✅ Configuration object loaded');
    }
    
    // Test specific config properties
    if (config.browser && Array.isArray(config.browser.args)) {
      console.log('✅ Browser args configuration valid');
    }
    
    if (config.stealth && config.stealth.userAgent) {
      console.log('✅ Stealth configuration valid');
    }
    
    if (config.cloudflare && config.cloudflare.waitTimeout) {
      console.log('✅ Cloudflare configuration valid');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Configuration test failed:', error.message);
    return false;
  }
}

function testStealthUtilsMethods() {
  console.log('Testing StealthUtils methods...');
  
  try {
    // Test user agent generation
    const userAgent1 = StealthUtils.getRandomUserAgent();
    const userAgent2 = StealthUtils.getRandomUserAgent();
    
    if (userAgent1 && userAgent2 && typeof userAgent1 === 'string') {
      console.log('✅ User agent generation works');
    }
    
    // Test viewport generation
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 1366, height: 768 }
    ];
    const viewport = StealthUtils.getRandomViewport(viewports);
    
    if (viewport && viewport.width && viewport.height) {
      console.log('✅ Viewport generation works');
    }
    
    // Test headers generation
    const headers = StealthUtils.getRandomHeaders();
    
    if (headers && headers['Accept'] && headers['Accept-Language']) {
      console.log('✅ Headers generation works');
    }
    
    // Test typing delay
    const delay = StealthUtils.getTypingDelay();
    
    if (typeof delay === 'number' && delay >= 50) {
      console.log('✅ Typing delay generation works');
    }
    
    return true;
  } catch (error) {
    console.error('❌ StealthUtils methods test failed:', error.message);
    return false;
  }
}

function testClassInstantiation() {
  console.log('Testing class instantiation...');
  
  try {
    const { PuppeteerAutomation, PlaywrightAutomation } = require('../index');
    
    // Test Puppeteer class instantiation
    const puppeteerInstance = new PuppeteerAutomation({
      browser: { headless: true }
    });
    
    if (puppeteerInstance && puppeteerInstance.config) {
      console.log('✅ PuppeteerAutomation instantiation works');
    }
    
    // Test Playwright class instantiation
    const playwrightInstance = new PlaywrightAutomation({
      browserType: 'chromium',
      browser: { headless: true }
    });
    
    if (playwrightInstance && playwrightInstance.config) {
      console.log('✅ PlaywrightAutomation instantiation works');
    }
    
    // Test configuration merging
    const customConfig = {
      stealth: {
        timing: {
          minDelay: 2000
        }
      }
    };
    
    const customInstance = new PuppeteerAutomation(customConfig);
    
    if (customInstance.config.stealth.timing.minDelay === 2000) {
      console.log('✅ Configuration merging works');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Class instantiation test failed:', error.message);
    return false;
  }
}

function testModuleExports() {
  console.log('Testing module exports...');
  
  try {
    const exportedModules = require('../index');
    
    // Check all expected exports
    const expectedExports = [
      'PuppeteerAutomation',
      'PlaywrightAutomation',
      'StealthUtils',
      'config',
      'createPuppeteerAutomation',
      'createPlaywrightAutomation'
    ];
    
    for (const exportName of expectedExports) {
      if (exportedModules[exportName]) {
        console.log(`✅ ${exportName} is properly exported`);
      } else {
        throw new Error(`${exportName} is not exported`);
      }
    }
    
    // Test factory methods
    const factoryPuppeteer = exportedModules.createPuppeteerAutomation();
    const factoryPlaywright = exportedModules.createPlaywrightAutomation();
    
    if (factoryPuppeteer && factoryPlaywright) {
      console.log('✅ Factory methods work');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Module exports test failed:', error.message);
    return false;
  }
}

async function runUnitTests() {
  console.log('=== Running Unit Tests (No Browser Required) ===\n');
  
  const results = [];
  
  // Test configuration
  results.push(testConfigurationLoading());
  
  // Test utilities
  results.push(testStealthUtilsMethods());
  
  // Test instantiation
  results.push(testClassInstantiation());
  
  // Test exports
  results.push(testModuleExports());
  
  console.log('\n=== Unit Test Results ===');
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`Passed: ${passed}/${total}`);
  
  if (passed === total) {
    console.log('🎉 All unit tests passed!');
    console.log('\n📝 Note: Browser integration tests require browser installation');
    console.log('   Run "npm run install-browsers" to enable full testing');
    return true;
  } else {
    console.log('⚠️  Some unit tests failed');
    return false;
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runUnitTests()
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
      console.error('Test execution failed:', error);
      process.exit(1);
    });
}

module.exports = {
  testConfigurationLoading,
  testStealthUtilsMethods,
  testClassInstantiation,
  testModuleExports,
  runUnitTests
};