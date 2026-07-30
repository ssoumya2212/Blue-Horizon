const BasePage = require('./BasePage');
const config = require('../config/test-config');

class NotFoundPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.notFoundText = this.byXpath("//*[contains(.,'404') or contains(.,'not found') or contains(.,'Not Found')]");
    this.homeLink     = this.byXpath("//a[contains(.,'Home') or contains(.,'home') or contains(@href,'/')]");
  }

  async navigateTo(path) {
    await this.open(`${config.baseUrl}/${path}`);
  }
}

module.exports = NotFoundPage;
