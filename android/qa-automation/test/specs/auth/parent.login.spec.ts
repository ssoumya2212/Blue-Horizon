import { expect } from '@wdio/globals'
import LoginPage from '../../pageobjects/login.page.js'
import DashboardPage from '../../pageobjects/dashboard.page.js'

describe('Parent Authentication Flow', () => {
    it('should login with valid parent credentials', async () => {
        await LoginPage.login('parent@example.com', 'SecurePass123!', 'parent');
        await DashboardPage.headerTitle.waitForDisplayed({ timeout: 10000 });
        await expect(DashboardPage.headerTitle).toBeExisting();
    });

    it('should show error message on invalid parent login', async () => {
        // App is likely to restart or need logout, but assuming a fresh launch per test or we restart app
        // Here we just restart the app for the test
        await driver.activateApp('com.bluehorizon.bus');
        await LoginPage.login('parent@example.com', 'WrongPassword', 'parent');
        await LoginPage.errorMessage.waitForDisplayed({ timeout: 5000 });
        await expect(LoginPage.errorMessage).toHaveText(expect.stringContaining('Invalid credentials'));
    });

    it('should logout parent successfully', async () => {
        await driver.activateApp('com.bluehorizon.bus');
        await LoginPage.login('parent@example.com', 'SecurePass123!', 'parent');
        await DashboardPage.headerTitle.waitForDisplayed({ timeout: 10000 });
        await DashboardPage.logout();
        await LoginPage.btnSubmit.waitForDisplayed({ timeout: 10000 });
        await expect(LoginPage.btnSubmit).toBeExisting();
    });
});
