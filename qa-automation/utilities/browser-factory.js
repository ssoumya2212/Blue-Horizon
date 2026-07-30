const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const edge = require('selenium-webdriver/edge');
const config = require('../config/test-config');

async function buildDriver(browserName = config.browser) {
  const browser = String(browserName).toLowerCase();
  let builder = new Builder().forBrowser(browser);

  if (browser === 'chrome') {
    const options = new chrome.Options();
    options.addArguments('--window-size=1600,1000', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage');
    if (config.headless) options.addArguments('--headless=new');
    builder = builder.setChromeOptions(options);
  }

  if (browser === 'firefox') {
    const options = new firefox.Options();
    if (config.headless) options.addArguments('-headless');
    builder = builder.setFirefoxOptions(options);
  }

  if (browser === 'edge') {
    const options = new edge.Options();
    options.addArguments('--window-size=1600,1000');
    if (config.headless) options.addArguments('--headless=new');
    builder = builder.setEdgeOptions(options);
  }

  const driver = await builder.build();
  await driver.manage().setTimeouts({ implicit: config.implicitWait, pageLoad: config.pageLoadTimeout, script: 20000 });
  return driver;
}

module.exports = { buildDriver };
