import { expect } from '@wdio/globals'
import LoginPage from '../../pageobjects/login.page.js'
import DashboardPage from '../../pageobjects/dashboard.page.js'

describe('Driver Authentication Flow', () => {
    it('should login with valid driver credentials', async () => {
        await LoginPage.login('driver@example.com', 'SecurePass123!', 'driver');
        await DashboardPage.headerTitle.waitForDisplayed({ timeout: 10000 });
        await expect(DashboardPage.headerTitle).toBeExisting();
    });

    it('should show error message on invalid driver login', async () => {
        await driver.activateApp('com.bluehorizon.bus');
        await LoginPage.login('driver@example.com', 'WrongPassword', 'driver');
        await LoginPage.errorMessage.waitForDisplayed({ timeout: 5000 });
        await expect(LoginPage.errorMessage).toHaveText(expect.stringContaining('Invalid credentials'));
    });
});
