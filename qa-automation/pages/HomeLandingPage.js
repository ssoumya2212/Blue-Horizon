const BasePage = require('./BasePage');
const config = require('../config/test-config');

class HomeLandingPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.url = config.baseUrl;
    this.heroHeading    = this.byXpath("//*[contains(., 'Smart.Safe.Reliable.')]");
    this.loginButton    = this.byXpath("//a[contains(@href,'/login')] | //button[contains(.,'Login') or contains(.,'Sign')]");
    this.logoEl         = this.byCss('img[alt*="Blue Horizon"], img[alt*="logo"], .logo, [class*="logo"]');
    this.navBar         = this.byCss('nav, header');
    this.themeToggle    = this.byCss('button[aria-label*="theme" i], button[aria-label*="dark" i], button[aria-label*="light" i]');
    this.footer         = this.byCss('footer, [class*="footer"]');
    this.featureSection = this.byXpath("//*[contains(.,'features') or contains(.,'Features') or contains(.,'Safe') or contains(.,'Reliable')]");
    this.ctaButton      = this.byXpath("//a[contains(.,'Get Started') or contains(.,'Start') or contains(.,'Try')]");
  }

  async navigate() {
    await this.open(this.url);
  }
}

module.exports = HomeLandingPage;
