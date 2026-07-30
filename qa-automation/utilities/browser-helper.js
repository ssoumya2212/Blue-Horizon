const fs = require('fs-extra');
const path = require('path');
const logger = require('./logger');
const { ensureDir, projectPath } = require('./path-helper');

class BrowserHelper {
  constructor(driver) {
    this.driver = driver;
  }

  async open(url) {
    logger.info(`Opening URL: ${url}`);
    await this.driver.get(url);
  }

  async scrollIntoView(element) {
    await this.driver.executeScript('arguments[0].scrollIntoView({block: "center", inline: "nearest"});', element);
  }

  async execute(script, ...args) {
    return this.driver.executeScript(script, ...args);
  }

  async switchToNewWindow() {
    const handles = await this.driver.getAllWindowHandles();
    await this.driver.switchTo().window(handles[handles.length - 1]);
  }

  async acceptAlertIfPresent() {
    try {
      const alert = await this.driver.switchTo().alert();
      await alert.accept();
      return true;
    } catch {
      return false;
    }
  }

  async dismissAlertIfPresent() {
    try {
      const alert = await this.driver.switchTo().alert();
      await alert.dismiss();
      return true;
    } catch {
      return false;
    }
  }

  async getConsoleLogs() {
    try {
      return await this.driver.manage().logs().get('browser');
    } catch {
      return [];
    }
  }

  async captureScreenshot(fileName) {
    const dir = ensureDir(projectPath('screenshots'));
    const filePath = path.join(dir, fileName);
    const image = await this.driver.takeScreenshot();
    await fs.writeFile(filePath, image, 'base64');
    return filePath;
  }
}

module.exports = BrowserHelper;
