const BasePage = require('./BasePage');

class AdminDashboardPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.pageTitle = this.byXpath("//*[contains(., 'Admin Overview')]");
    this.addDriverButton = this.byXpath("//button[contains(., 'Add driver')]");
    this.addParentButton = this.byXpath("//button[contains(., 'Add parent')]");
    this.addRouteButton = this.byXpath("//button[contains(., 'Add route')]");
  }
}

module.exports = AdminDashboardPage;
