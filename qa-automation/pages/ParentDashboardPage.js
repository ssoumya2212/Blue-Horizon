const BasePage = require('./BasePage');

class ParentDashboardPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.routeSection = this.byXpath("//*[contains(., 'Route') or contains(., 'route')]");
    this.mapSection = this.byXpath("//*[contains(., 'Tracking') or contains(., 'Map')]");
  }
}

module.exports = ParentDashboardPage;
