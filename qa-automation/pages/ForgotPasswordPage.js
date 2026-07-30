const BasePage = require('./BasePage');
const config = require('../config/test-config');

class ForgotPasswordPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.url = `${config.baseUrl}/forgot-password`;
    this.emailInput = this.byCss('input[type="email"], input[placeholder*="email" i], input[name="email"]');
    this.submitButton = this.byCss('button[type="submit"]');
    this.successMessage = this.byXpath("//*[contains(., 'sent') or contains(., 'check') or contains(., 'email')]");
    this.backToLogin = this.byXpath("//a[contains(., 'Login') or contains(., 'login') or contains(., 'Sign in')]");
    this.errorMessage = this.byCss('.text-destructive, [role="alert"]');
  }

  async navigate() {
    await this.open(this.url);
  }

  async submitEmail(email) {
    await this.type(this.emailInput, email, 'Enter reset email');
    await this.click(this.submitButton, 'Submit forgot password form');
  }
}

module.exports = ForgotPasswordPage;
