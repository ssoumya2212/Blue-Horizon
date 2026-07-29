import { $ } from '@wdio/globals'
import Page from './page.js';

class LoginPage extends Page {
    /**
     * define selectors using getter methods
     * Since this is likely a Capacitor webview, we might need to switch contexts
     * or use UIAutomator selectors if dealing with native elements.
     * Assuming accessibility ids or webview IDs for now.
     */
    public get inputUsername () {
        return $('~username-input'); // Example using accessibility id
    }

    public get inputPassword () {
        return $('~password-input');
    }

    public get btnSubmit () {
        return $('~login-button');
    }

    public get roleSelector () {
        return $('~role-selector');
    }

    public get errorMessage () {
        return $('~error-message');
    }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    public async login (username: string, password: string, role?: string) {
        if (role) {
            await this.roleSelector.click();
            const roleOption = await $(`~role-option-${role}`);
            await roleOption.click();
        }
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
        await this.btnSubmit.click();
    }
}

export default new LoginPage();
