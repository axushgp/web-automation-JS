const UserAgent = require('user-agents');

/**
 * Utility functions for stealth operations and anti-bot bypass
 */

class StealthUtils {
  /**
   * Generate a random user agent
   * @returns {string} Random user agent string
   */
  static getRandomUserAgent() {
    const userAgent = new UserAgent();
    return userAgent.toString();
  }

  /**
   * Get random viewport size from predefined list
   * @param {Array} viewportSizes Array of viewport size objects
   * @returns {Object} Random viewport size
   */
  static getRandomViewport(viewportSizes) {
    return viewportSizes[Math.floor(Math.random() * viewportSizes.length)];
  }

  /**
   * Generate random delay between min and max
   * @param {number} min Minimum delay in milliseconds
   * @param {number} max Maximum delay in milliseconds
   * @returns {Promise} Promise that resolves after delay
   */
  static randomDelay(min = 1000, max = 3000) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Generate realistic mouse movement coordinates
   * @param {Object} element Element to move to
   * @returns {Object} Random coordinates within element bounds
   */
  static getRandomCoordinates(element) {
    const box = element.boundingBox();
    return {
      x: box.x + Math.random() * box.width,
      y: box.y + Math.random() * box.height
    };
  }

  /**
   * Check if page is showing Cloudflare challenge
   * @param {Object} page Playwright or Puppeteer page object
   * @returns {Promise<boolean>} True if Cloudflare challenge detected
   */
  static async isCloudflareChallenge(page) {
    try {
      // Check for common Cloudflare indicators
      const cloudflareIndicators = [
        'div[id="cf-wrapper"]',
        'div[class*="cf-browser-verification"]',
        'div[class*="cf-im-under-attack"]',
        'title:has-text("Just a moment")',
        'h1:has-text("Checking your browser")',
        'div[class*="spinner"]'
      ];

      for (const selector of cloudflareIndicators) {
        try {
          const element = await page.$(selector);
          if (element) return true;
        } catch (e) {
          // Continue checking other selectors
        }
      }

      return false;
    } catch (error) {
      console.warn('Error checking for Cloudflare challenge:', error);
      return false;
    }
  }

  /**
   * Wait for Cloudflare challenge to complete
   * @param {Object} page Playwright or Puppeteer page object
   * @param {number} timeout Maximum time to wait in milliseconds
   * @returns {Promise<boolean>} True if challenge was bypassed
   */
  static async waitForCloudflareBypass(page, timeout = 30000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const isChallenge = await this.isCloudflareChallenge(page);
      
      if (!isChallenge) {
        return true;
      }
      
      await this.randomDelay(2000, 4000);
    }
    
    return false;
  }

  /**
   * Generate realistic typing delay
   * @returns {number} Random typing delay in milliseconds
   */
  static getTypingDelay() {
    return Math.floor(Math.random() * 100) + 50;
  }

  /**
   * Simulate human-like page scrolling
   * @param {Object} page Playwright or Puppeteer page object
   * @param {number} scrollAmount Amount to scroll (optional)
   */
  static async humanScroll(page, scrollAmount = null) {
    const amount = scrollAmount || Math.floor(Math.random() * 500) + 200;
    
    await page.evaluate((scrollAmount) => {
      window.scrollBy({
        top: scrollAmount,
        behavior: 'smooth'
      });
    }, amount);
    
    await this.randomDelay(500, 1500);
  }

  /**
   * Generate random headers that mimic real browsers
   * @returns {Object} Headers object
   */
  static getRandomHeaders() {
    const languages = ['en-US,en;q=0.9', 'en-GB,en;q=0.9', 'en;q=0.9'];
    const encodings = ['gzip, deflate, br'];
    
    return {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': languages[Math.floor(Math.random() * languages.length)],
      'Accept-Encoding': encodings[0],
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1'
    };
  }
}

module.exports = StealthUtils;