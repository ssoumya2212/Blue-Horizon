const BasePage = require('./BasePage');
const config = require('../config/test-config');

class HomePage extends BasePage {
  constructor(driver) {
    super(driver);
    this.url = config.baseUrl;
    this.loginLink = this.byXpath("//a[contains(., 'Login')]");
    this.heroText = this.byXpath("//*[contains(., 'Smart.Safe.Reliable.')]");
  }

  async navigate() {
    await this.open(this.url);
  }
}

module.exports = HomePage;
