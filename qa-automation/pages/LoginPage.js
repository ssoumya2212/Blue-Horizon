const BasePage = require('./BasePage');
const config = require('../config/test-config');

class LoginPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.url = `${config.baseUrl}/login`;
    this.email = this.byCss('input[placeholder="Email address"], input[name="email"], input[type="email"]');
    this.password = this.byCss('input[placeholder="Password"], input[name="password"], input[type="password"]');
    this.submit = this.byCss('button[type="submit"]');
    this.errorText = this.byCss('.text-destructive, [role="alert"], .border-destructive');
  }

  async navigate() {
    await this.open(this.url);
  }

  async login(email, password) {
    await this.type(this.email, email, 'Enter login email');
    await this.type(this.password, password, 'Enter login password');
    await this.click(this.submit, 'Submit login form');
  }
}

module.exports = LoginPage;
