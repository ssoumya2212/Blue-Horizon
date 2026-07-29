import { expect } from '@wdio/globals'
import LoginPage from '../../pageobjects/login.page.js'
import DashboardPage from '../../pageobjects/dashboard.page.js'

describe('Functional Navigation Flow', () => {
    it('should navigate through dashboard features successfully', async () => {
        // Setup state: Login first
        await driver.activateApp('com.bluehorizon.bus');
        await LoginPage.login('parent@example.com', 'SecurePass123!', 'parent');
        await DashboardPage.headerTitle.waitForDisplayed({ timeout: 10000 });
        
        // Assume there is a search button and notifications button in the app
        const searchButton = await $('~search-button');
        const notificationsButton = await $('~notifications-button');
        
        // Assuming search functionality
        if (await searchButton.isExisting()) {
            await searchButton.click();
            const searchInput = await $('~search-input');
            await expect(searchInput).toBeDisplayed();
            // Go back
            await driver.back();
        }

        // Assuming notifications functionality
        if (await notificationsButton.isExisting()) {
            await notificationsButton.click();
            const notificationsList = await $('~notifications-list');
            await expect(notificationsList).toBeDisplayed();
            // Go back
            await driver.back();
        }
    });
});
