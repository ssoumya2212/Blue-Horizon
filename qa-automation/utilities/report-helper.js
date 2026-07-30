const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const BrowserHelper = require('./browser-helper');
const state = require('./test-state');
const { ensureDir, projectPath } = require('./path-helper');

async function captureFailureArtifacts(driver, testName, error, browser) {
  const browserHelper = new BrowserHelper(driver);
  const failureDir = ensureDir(projectPath('reports', 'failures'));
  const screenshotsDir = ensureDir(path.join(failureDir, 'screenshots'));
  const logsDir = ensureDir(path.join(failureDir, 'logs'));
  const fileBase = `${Date.now()}_${uuidv4()}`;

  const screenshotPath = path.join(screenshotsDir, `${fileBase}.png`);
  const raw = await driver.takeScreenshot();
  await fs.writeFile(screenshotPath, raw, 'base64');

  const consoleLogs = await browserHelper.getConsoleLogs();
  const currentUrl = await driver.getCurrentUrl();
  const failureLogPath = path.join(logsDir, `${fileBase}.json`);

  const payload = {
    testName,
    browser,
    currentUrl,
    failureReason: error.message,
    stack: error.stack,
    consoleLogs,
    timestamp: new Date().toISOString()
  };

  await fs.writeJson(failureLogPath, payload, { spaces: 2 });

  state.pushLog({
    timestamp: new Date().toISOString(),
    testName,
    stepDescription: 'Failure artifact capture',
    result: 'FAILED',
    remarks: error.message
  });

  return { screenshotPath, failureLogPath, currentUrl };
}

module.exports = { captureFailureArtifacts };
