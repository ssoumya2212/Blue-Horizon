const { By } = require('selenium-webdriver');
const WaitHelper = require('../utilities/wait-helper');
const BrowserHelper = require('../utilities/browser-helper');
const retry = require('../utilities/retry-helper');
const state = require('../utilities/test-state');

class BasePage {
  constructor(driver) {
    this.driver = driver;
    this.wait = new WaitHelper(driver);
    this.browser = new BrowserHelper(driver);
  }

  byCss(selector) {
    return By.css(selector);
  }

  byXpath(selector) {
    return By.xpath(selector);
  }

  async open(url) {
    await this.browser.open(url);
  }

  async find(locator) {
    return this.wait.forElementVisible(locator);
  }

  async click(locator, stepDescription = 'Click element') {
    const element = await this.find(locator);
    await this.browser.scrollIntoView(element);
    await retry(async () => element.click(), 2, 300);
    state.pushLog({ timestamp: new Date().toISOString(), testName: global.currentTestName || 'Unknown', stepDescription, result: 'PASS', remarks: '' });
  }

  async type(locator, value, stepDescription = 'Type into field') {
    const element = await this.find(locator);
    await element.clear();
    await element.sendKeys(value);
    state.pushLog({ timestamp: new Date().toISOString(), testName: global.currentTestName || 'Unknown', stepDescription, result: 'PASS', remarks: value ? 'Value entered' : 'Empty value entered' });
  }

  async getText(locator) {
    const element = await this.find(locator);
    return element.getText();
  }

  async isDisplayed(locator) {
    try {
      const element = await this.find(locator);
      return element.isDisplayed();
    } catch {
      return false;
    }
  }
}

module.exports = BasePage;
