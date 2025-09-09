const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const config = require('../config/default');
const StealthUtils = require('../utils/stealth');

// Add stealth plugin
puppeteer.use(StealthPlugin());

/**
 * PuppeteerAutomation class for bypassing Cloudflare anti-bot verification
 */
class PuppeteerAutomation {
  constructor(options = {}) {
    this.config = this.mergeConfig(config, options);
    this.browser = null;
    this.page = null;
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
      const browserArgs = [...this.config.browser.args];
      
      // Add proxy configuration if enabled
      if (this.config.proxy.enabled && this.config.proxy.server) {
        browserArgs.push(`--proxy-server=${this.config.proxy.server}`);
      }

      this.browser = await puppeteer.launch({
        headless: this.config.browser.headless,
        defaultViewport: this.config.browser.defaultViewport,
        args: browserArgs,
        ignoreDefaultArgs: ['--enable-automation'],
        ignoreHTTPSErrors: true
      });

      this.page = await this.browser.newPage();
      
      // Configure stealth settings
      await this.configureStealth();
      
      console.log('Puppeteer browser initialized with stealth configuration');
    } catch (error) {
      console.error('Failed to initialize Puppeteer browser:', error);
      throw error;
    }
  }

  /**
   * Configure stealth settings for the page
   * @returns {Promise<void>}
   */
  async configureStealth() {
    // Set random user agent if enabled
    if (this.config.stealth.userAgent.enabled) {
      const userAgent = StealthUtils.getRandomUserAgent();
      await this.page.setUserAgent(userAgent);
    }

    // Set random viewport if enabled
    if (this.config.stealth.viewport.enabled) {
      const viewport = this.config.stealth.viewport.randomize 
        ? StealthUtils.getRandomViewport(this.config.stealth.viewport.sizes)
        : this.config.stealth.viewport.sizes[0];
      
      await this.page.setViewport(viewport);
    }

    // Set extra headers
    const headers = StealthUtils.getRandomHeaders();
    await this.page.setExtraHTTPHeaders(headers);

    // Remove webdriver property
    await this.page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
    });

    // Override the plugins property to use a non-empty array
    await this.page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });
    });

    // Override the languages property
    await this.page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
      });
    });

    // Handle proxy authentication if configured
    if (this.config.proxy.enabled && this.config.proxy.username) {
      await this.page.authenticate({
        username: this.config.proxy.username,
        password: this.config.proxy.password
      });
    }
  }

  /**
   * Navigate to URL with Cloudflare bypass
   * @param {string} url Target URL
   * @param {Object} options Navigation options
   * @returns {Promise<void>}
   */
  async goto(url, options = {}) {
    const defaultOptions = {
      waitUntil: 'networkidle2',
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
      const width = this.page.viewport().width;
      const height = this.page.viewport().height;
      
      for (let i = 0; i < 3; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        await this.page.mouse.move(x, y, { steps: 10 });
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
   * Close browser
   * @returns {Promise<void>}
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('Puppeteer browser closed');
    }
  }
}

module.exports = PuppeteerAutomation;