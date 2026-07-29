import { $ } from '@wdio/globals'
import Page from './page.js';

class DashboardPage extends Page {
    public get headerTitle () {
        return $('~dashboard-header');
    }

    public get userProfileIcon () {
        return $('~profile-icon');
    }

    public get logoutButton () {
        return $('~logout-button');
    }

    public async logout () {
        await this.userProfileIcon.click();
        await this.logoutButton.click();
    }
}

export default new DashboardPage();
