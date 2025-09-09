const { chromium, firefox, webkit } = require('playwright');
const config = require('../config/default');
const StealthUtils = require('../utils/stealth');

/**
 * PlaywrightAutomation class for bypassing Cloudflare anti-bot verification
 */
class PlaywrightAutomation {
  constructor(options = {}) {
    this.config = this.mergeConfig(config, options);
    this.browser = null;
    this.context = null;
    this.page = null;
    this.browserType = options.browserType || 'chromium';
  }

  /**
   * Deep merge configuration objects
   */
  mergeConfig(defaultConfig, userConfig) {
    const result = JSON.parse(JSON.stringify(defaultConfig));
    
    for (const key in userConfig) {
      if (typeof userConfig[key] === 'object' && userConfig[key] !== null && !Array.isArray(userConfig[key])) {
        result[key] = this.mergeConfig(result[key] || {}, userConfig[key]);
      } else {
        result[key] = userConfig[key];
      }
    }
    
    return result;
  }

  /**
   * Initialize browser with stealth configuration
   * @returns {Promise<void>}
   */
  async init() {
    try {
      const browser = this.getBrowserEngine();
      
      // Prepare launch options
      const launchOptions = {
        headless: this.config.browser.headless,
        args: [...this.config.browser.args]
      };

      // Add proxy configuration if enabled
      if (this.config.proxy.enabled && this.config.proxy.server) {
        launchOptions.proxy = {
          server: this.config.proxy.server,
          username: this.config.proxy.username,
          password: this.config.proxy.password
        };
      }

      this.browser = await browser.launch(launchOptions);

      // Create context with stealth settings
      await this.createContext();

      this.page = await this.context.newPage();

      // Configure stealth settings
      await this.configureStealth();

      console.log(`Playwright ${this.browserType} browser initialized with stealth configuration`);
    } catch (error) {
      console.error('Failed to initialize Playwright browser:', error);
      throw error;
    }
  }

  /**
   * Get browser engine based on type
   * @returns {Object} Browser engine
   */
  getBrowserEngine() {
    switch (this.browserType) {
      case 'firefox':
        return firefox;
      case 'webkit':
        return webkit;
      case 'chromium':
      default:
        return chromium;
    }
  }

  /**
   * Create browser context with stealth settings
   * @returns {Promise<void>}
   */
  async createContext() {
    const contextOptions = {
      ignoreHTTPSErrors: true,
      javaScriptEnabled: true
    };

    // Set random user agent if enabled
    if (this.config.stealth.userAgent.enabled) {
      contextOptions.userAgent = StealthUtils.getRandomUserAgent();
    }

    // Set random viewport if enabled
    if (this.config.stealth.viewport.enabled) {
      const viewport = this.config.stealth.viewport.randomize 
        ? StealthUtils.getRandomViewport(this.config.stealth.viewport.sizes)
        : this.config.stealth.viewport.sizes[0];
      
      contextOptions.viewport = viewport;
    }

    // Set extra headers
    contextOptions.extraHTTPHeaders = StealthUtils.getRandomHeaders();

    this.context = await this.browser.newContext(contextOptions);
  }

  /**
   * Configure stealth settings for the page
   * @returns {Promise<void>}
   */
  async configureStealth() {
    // Add stealth scripts
    await this.page.addInitScript(() => {
      // Remove webdriver property
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });

      // Override the plugins property
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });

      // Override the languages property
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
      });

      // Override the platform property
      Object.defineProperty(navigator, 'platform', {
        get: () => 'Win32',
      });

      // Override the hardwareConcurrency property
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        get: () => 4,
      });

      // Override the deviceMemory property
      Object.defineProperty(navigator, 'deviceMemory', {
        get: () => 8,
      });

      // Override the chrome property
      Object.defineProperty(window, 'chrome', {
        get: () => ({
          runtime: {},
          loadTimes: function() {},
          csi: function() {},
          app: {}
        }),
      });

      // Override permissions
      const originalQuery = window.navigator.permissions.query;
      window.navigator.permissions.query = (parameters) => (
        parameters.name === 'notifications' ?
          Promise.resolve({ state: Notification.permission }) :
          originalQuery(parameters)
      );
    });

    // Handle dialog boxes
    this.page.on('dialog', async dialog => {
      console.log(`Dialog appeared: ${dialog.message()}`);
      await dialog.accept();
    });
  }

  /**
   * Navigate to URL with Cloudflare bypass
   * @param {string} url Target URL
   * @param {Object} options Navigation options
   * @returns {Promise<void>}
   */
  async goto(url, options = {}) {
    const defaultOptions = {
      waitUntil: 'networkidle',
      timeout: 30000
    };
    
    const navOptions = { ...defaultOptions, ...options };

    try {
      console.log(`Navigating to: ${url}`);
      
      // Add random delay before navigation
      await StealthUtils.randomDelay(
        this.config.stealth.timing.minDelay,
        this.config.stealth.timing.maxDelay
      );

      await this.page.goto(url, navOptions);

      // Check for Cloudflare challenge
      const isChallenge = await StealthUtils.isCloudflareChallenge(this.page);
      
      if (isChallenge) {
        console.log('Cloudflare challenge detected, waiting for bypass...');
        
        const bypassed = await StealthUtils.waitForCloudflareBypass(
          this.page, 
          this.config.cloudflare.waitTimeout
        );
        
        if (bypassed) {
          console.log('Cloudflare challenge bypassed successfully');
        } else {
          console.warn('Failed to bypass Cloudflare challenge within timeout');
        }
      }

      // Simulate human behavior
      await this.simulateHumanBehavior();
      
    } catch (error) {
      console.error('Navigation failed:', error);
      throw error;
    }
  }

  /**
   * Simulate human-like behavior on the page
   * @returns {Promise<void>}
   */
  async simulateHumanBehavior() {
    try {
      // Random scroll
      await StealthUtils.humanScroll(this.page);
      
      // Random mouse movements
      const viewport = this.page.viewportSize();
      const width = viewport ? viewport.width : 1920;
      const height = viewport ? viewport.height : 1080;
      
      for (let i = 0; i < 3; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        await this.page.mouse.move(x, y);
        await StealthUtils.randomDelay(200, 500);
      }
      
    } catch (error) {
      console.warn('Error during human behavior simulation:', error);
    }
  }

  /**
   * Click element with human-like behavior
   * @param {string} selector CSS selector
   * @param {Object} options Click options
   * @returns {Promise<void>}
   */
  async click(selector, options = {}) {
    try {
      await this.page.waitForSelector(selector, { timeout: 10000 });
      
      // Random delay before click
      await StealthUtils.randomDelay(this.config.stealth.timing.clickDelay, this.config.stealth.timing.clickDelay * 2);
      
      const element = await this.page.$(selector);
      const box = await element.boundingBox();
      
      // Click at random position within element
      const x = box.x + Math.random() * box.width;
      const y = box.y + Math.random() * box.height;
      
      await this.page.mouse.click(x, y, options);
      
    } catch (error) {
      console.error('Click failed:', error);
      throw error;
    }
  }

  /**
   * Type text with human-like delays
   * @param {string} selector CSS selector
   * @param {string} text Text to type
   * @returns {Promise<void>}
   */
  async type(selector, text) {
    try {
      await this.page.waitForSelector(selector, { timeout: 10000 });
      
      await this.page.focus(selector);
      
      // Clear existing text
      await this.page.click(selector, { clickCount: 3 });
      
      // Type with human-like delays
      for (const char of text) {
        await this.page.keyboard.type(char);
        await StealthUtils.randomDelay(StealthUtils.getTypingDelay(), StealthUtils.getTypingDelay() * 2);
      }
      
    } catch (error) {
      console.error('Typing failed:', error);
      throw error;
    }
  }

  /**
   * Fill form field
   * @param {string} selector CSS selector
   * @param {string} value Value to fill
   * @returns {Promise<void>}
   */
  async fill(selector, value) {
    try {
      await this.page.waitForSelector(selector, { timeout: 10000 });
      await this.page.fill(selector, value);
    } catch (error) {
      console.error('Fill failed:', error);
      throw error;
    }
  }

  /**
   * Wait for selector
   * @param {string} selector CSS selector
   * @param {Object} options Wait options
   * @returns {Promise<void>}
   */
  async waitForSelector(selector, options = {}) {
    return await this.page.waitForSelector(selector, { timeout: 10000, ...options });
  }

  /**
   * Take screenshot
   * @param {string} path Screenshot path
   * @param {Object} options Screenshot options
   * @returns {Promise<void>}
   */
  async screenshot(path, options = {}) {
    return await this.page.screenshot({ path, ...options });
  }

  /**
   * Get page content
   * @returns {Promise<string>} Page HTML content
   */
  async getContent() {
    return await this.page.content();
  }

  /**
   * Evaluate JavaScript on page
   * @param {Function} pageFunction Function to evaluate
   * @param {any} arg Arguments to pass
   * @returns {Promise<any>} Evaluation result
   */
  async evaluate(pageFunction, arg) {
    return await this.page.evaluate(pageFunction, arg);
  }

  /**
   * Close browser
   * @returns {Promise<void>}
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('Playwright browser closed');
    }
  }
}

module.exports = PlaywrightAutomation;