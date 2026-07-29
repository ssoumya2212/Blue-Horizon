import { expect } from '@wdio/globals'
import LoginPage from '../../pageobjects/login.page.js'
import DashboardPage from '../../pageobjects/dashboard.page.js'

describe('Admin Authentication Flow', () => {
    it('should login with valid admin credentials', async () => {
        await LoginPage.login('admin@example.com', 'SecurePass123!', 'admin');
        await DashboardPage.headerTitle.waitForDisplayed({ timeout: 10000 });
        await expect(DashboardPage.headerTitle).toBeExisting();
    });

    it('should show error message on invalid admin login', async () => {
        await driver.activateApp('com.bluehorizon.bus');
        await LoginPage.login('admin@example.com', 'WrongPassword', 'admin');
        await LoginPage.errorMessage.waitForDisplayed({ timeout: 5000 });
        await expect(LoginPage.errorMessage).toHaveText(expect.stringContaining('Invalid credentials'));
    });
});
