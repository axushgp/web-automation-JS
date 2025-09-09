# Web Automation JS - Cloudflare Anti-Bot Bypass

A powerful automation project built with **Playwright** and **Puppeteer** that effectively bypasses Cloudflare anti-bot verification using advanced stealth techniques.

## 🚀 Features

- **Dual Engine Support**: Works with both Playwright and Puppeteer
- **Cloudflare Bypass**: Advanced techniques to bypass anti-bot verification
- **Stealth Mode**: Human-like behavior simulation
- **Multi-Browser Support**: Chromium, Firefox, and WebKit
- **User Agent Rotation**: Random user agent generation
- **Proxy Support**: Built-in proxy configuration
- **Human Behavior Simulation**: Random delays, mouse movements, and scrolling
- **Easy Configuration**: Flexible configuration system

## 📦 Installation

```bash
npm install
```

For Playwright browser installation:
```bash
npm run install-browsers
```

## 🛠️ Usage

### Quick Start with Puppeteer

```javascript
const { PuppeteerAutomation } = require('./index');

async function example() {
  const automation = new PuppeteerAutomation({
    browser: { headless: false }
  });

  await automation.init();
  await automation.goto('https://example.com');
  await automation.screenshot('result.png');
  await automation.close();
}

example();
```

### Quick Start with Playwright

```javascript
const { PlaywrightAutomation } = require('./index');

async function example() {
  const automation = new PlaywrightAutomation({
    browserType: 'chromium',
    browser: { headless: false }
  });

  await automation.init();
  await automation.goto('https://example.com');
  await automation.screenshot('result.png');
  await automation.close();
}

example();
```

## 🎯 Anti-Bot Bypass Techniques

This project implements several advanced techniques to bypass Cloudflare and other anti-bot systems:

### 1. **Browser Fingerprint Evasion**
- Removes webdriver properties
- Overrides navigator properties
- Mimics real browser characteristics

### 2. **Human Behavior Simulation**
- Random mouse movements
- Natural typing delays
- Realistic scrolling patterns
- Random viewport sizes

### 3. **Network Level Stealth**
- User agent rotation
- Realistic HTTP headers
- Proxy support
- Request timing variations

### 4. **Advanced Detection Avoidance**
- Plugin spoofing
- Language preferences
- Hardware fingerprint masking
- Permission handling

## 📝 Configuration

The project uses a flexible configuration system. You can customize behavior by passing options:

```javascript
const automation = new PuppeteerAutomation({
  browser: {
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  },
  stealth: {
    userAgent: { enabled: true, rotate: true },
    viewport: { enabled: true, randomize: true },
    timing: { minDelay: 1000, maxDelay: 3000 }
  },
  cloudflare: {
    waitTimeout: 30000,
    retryAttempts: 3
  },
  proxy: {
    enabled: false,
    server: 'http://proxy-server:port',
    username: 'user',
    password: 'pass'
  }
});
```

## 🔧 API Reference

### PuppeteerAutomation

#### Methods

- `init()` - Initialize browser with stealth configuration
- `goto(url, options)` - Navigate to URL with Cloudflare bypass
- `click(selector, options)` - Click element with human-like behavior
- `type(selector, text)` - Type text with realistic delays
- `screenshot(path, options)` - Take screenshot
- `close()` - Close browser

### PlaywrightAutomation

#### Methods

- `init()` - Initialize browser with stealth configuration
- `goto(url, options)` - Navigate to URL with Cloudflare bypass
- `click(selector, options)` - Click element with human-like behavior
- `type(selector, text)` - Type text with realistic delays
- `fill(selector, value)` - Fill form field
- `waitForSelector(selector, options)` - Wait for element
- `screenshot(path, options)` - Take screenshot
- `evaluate(pageFunction, arg)` - Execute JavaScript on page
- `close()` - Close browser

### StealthUtils

Utility functions for stealth operations:

- `getRandomUserAgent()` - Generate random user agent
- `getRandomViewport(sizes)` - Get random viewport size
- `randomDelay(min, max)` - Generate random delay
- `isCloudflareChallenge(page)` - Check for Cloudflare challenge
- `waitForCloudflareBypass(page, timeout)` - Wait for challenge bypass
- `humanScroll(page, amount)` - Simulate human scrolling
- `getRandomHeaders()` - Generate realistic headers

## 🎯 Examples

### Running Examples

```bash
# Run Puppeteer examples
npm run example:puppeteer

# Run Playwright examples
npm run example:playwright

# Run default examples
npm start
```

### Example: Form Automation

```javascript
const automation = new PuppeteerAutomation();
await automation.init();
await automation.goto('https://example.com/form');

// Fill form with human-like behavior
await automation.type('#username', 'john_doe');
await automation.type('#password', 'secure_password');
await automation.click('#login-button');

await automation.close();
```

### Example: Multi-Browser Testing

```javascript
const browsers = ['chromium', 'firefox', 'webkit'];

for (const browserType of browsers) {
  const automation = new PlaywrightAutomation({ browserType });
  await automation.init();
  await automation.goto('https://example.com');
  await automation.screenshot(`result-${browserType}.png`);
  await automation.close();
}
```

## 🛡️ Cloudflare Bypass Strategy

The automation handles Cloudflare challenges through:

1. **Detection**: Automatically detects Cloudflare challenge pages
2. **Waiting**: Patiently waits for challenges to complete
3. **Retry Logic**: Implements retry mechanisms for failed attempts
4. **Stealth Mode**: Uses advanced evasion techniques

Common Cloudflare challenge indicators detected:
- "Just a moment" messages
- "Checking your browser" text
- CF wrapper divs
- Spinner elements

## ⚙️ Advanced Configuration

### Custom User Agents

```javascript
const automation = new PuppeteerAutomation({
  stealth: {
    userAgent: {
      enabled: true,
      custom: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  }
});
```

### Proxy Configuration

```javascript
const automation = new PlaywrightAutomation({
  proxy: {
    enabled: true,
    server: 'http://proxy.example.com:8080',
    username: 'proxy_user',
    password: 'proxy_pass'
  }
});
```

### Custom Timing

```javascript
const automation = new PuppeteerAutomation({
  stealth: {
    timing: {
      minDelay: 2000,
      maxDelay: 5000,
      clickDelay: 800
    }
  }
});
```

## 🔒 Best Practices

1. **Use Realistic Delays**: Don't make requests too quickly
2. **Rotate User Agents**: Use different user agents for different sessions
3. **Handle Errors Gracefully**: Implement proper error handling
4. **Monitor Rate Limits**: Respect website rate limits
5. **Use Proxies**: For high-volume operations, use rotating proxies
6. **Test Regularly**: Anti-bot systems evolve, test your implementations

## 📋 Requirements

- Node.js >= 14.0.0
- NPM or Yarn
- Chrome/Chromium browser (for Puppeteer)
- Additional browsers for Playwright (install with `npm run install-browsers`)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## ⚠️ Disclaimer

This tool is for educational and legitimate automation purposes only. Always respect websites' terms of service and robots.txt files. Use responsibly and ethically.

## 🐛 Troubleshooting

### Common Issues

**Browser not found**: Install browsers using `npm run install-browsers`

**Connection timeout**: Increase timeout values in configuration

**Cloudflare still blocking**: Try different user agents or proxy servers

**Memory issues**: Use headless mode for production environments

### Debug Mode

Enable debug logging by setting headless to false and adding console logs:

```javascript
const automation = new PuppeteerAutomation({
  browser: { headless: false } // See browser actions
});
```

---

For more examples and advanced usage, check the `examples/` directory.
