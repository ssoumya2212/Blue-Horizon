const BasePage = require('./BasePage');

class DriverDashboardPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.studentsSection = this.byXpath("//*[contains(., 'Student') or contains(., 'Passengers')]");
    this.tripSection = this.byXpath("//*[contains(., 'Trip') or contains(., 'Route')]");
  }
}

module.exports = DriverDashboardPage;
