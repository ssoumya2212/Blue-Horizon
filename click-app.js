const { remote } = require('webdriverio');

async function runTest() {
    // 1. Connect to your running Appium Server
    const driver = await remote({
        hostname: '127.0.0.1',
        port: 4723,
        logLevel: 'error',
        capabilities: {
            "platformName": "Android",
            "appium:automationName": "UiAutomator2"
        }
    });

    try {
        console.log("Connected! Looking for the Blue Horizon app...");

        // 2. We use the exact 'accessibility id' you just pasted!
        const appIcon = await driver.$('~Blue Horizon');
        
        // 3. Force click it
        await appIcon.click();
        console.log("Successfully clicked Blue Horizon!");

        // 4. Pause for a few seconds so you can see it open on your screen
        await driver.pause(4000);

    } catch (error) {
        console.error("Error clicking the app:", error.message);
    } finally {
        // 5. Clean up and close the session
        await driver.deleteSession();
    }
}

runTest();
