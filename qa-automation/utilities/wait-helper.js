const { until } = require('selenium-webdriver');
const config = require('../config/test-config');

class WaitHelper {
  constructor(driver) {
    this.driver = driver;
  }

  async forElementLocated(locator, timeout = config.explicitWait) {
    return this.driver.wait(until.elementLocated(locator), timeout);
  }

  async forElementVisible(locator, timeout = config.explicitWait) {
    const element = await this.forElementLocated(locator, timeout);
    await this.driver.wait(until.elementIsVisible(element), timeout);
    return element;
  }

  async forElementEnabled(element, timeout = config.explicitWait) {
    await this.driver.wait(async () => await element.isEnabled(), timeout);
    return element;
  }

  async forUrlContains(fragment, timeout = config.explicitWait) {
    await this.driver.wait(until.urlContains(fragment), timeout);
  }

  async forTitleContains(fragment, timeout = config.explicitWait) {
    await this.driver.wait(until.titleContains(fragment), timeout);
  }

  async forText(locator, text, timeout = config.explicitWait) {
    await this.driver.wait(until.elementTextContains(await this.forElementLocated(locator), text), timeout);
  }

  async sleep(ms) {
    return this.driver.sleep(ms);
  }
}

module.exports = WaitHelper;
