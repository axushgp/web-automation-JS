/**
 * Default configuration for web automation with anti-bot bypass
 */

module.exports = {
  // Browser configuration
  browser: {
    headless: false, // Set to true for production
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-features=TranslateUI',
      '--disable-ipc-flooding-protection',
      '--disable-default-apps',
      '--disable-extensions',
      '--disable-component-extensions-with-background-pages',
      '--disable-background-networking',
      '--disable-sync',
      '--metrics-recording-only',
      '--no-report-upload',
      '--disable-features=VizDisplayCompositor'
    ]
  },

  // Stealth configuration
  stealth: {
    userAgent: {
      enabled: true,
      rotate: true
    },
    viewport: {
      enabled: true,
      randomize: true,
      sizes: [
        { width: 1920, height: 1080 },
        { width: 1366, height: 768 },
        { width: 1440, height: 900 },
        { width: 1536, height: 864 },
        { width: 1600, height: 900 }
      ]
    },
    timing: {
      minDelay: 1000,
      maxDelay: 3000,
      clickDelay: 500
    }
  },

  // Cloudflare bypass specific settings
  cloudflare: {
    waitForSelector: 'body',
    waitTimeout: 30000,
    retryAttempts: 3,
    retryDelay: 5000
  },

  // Proxy configuration (optional)
  proxy: {
    enabled: false,
    server: null,
    username: null,
    password: null
  }
};