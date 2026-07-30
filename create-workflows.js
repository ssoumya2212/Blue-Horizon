const fs = require('fs');
const path = require('path');
const workflowsDir = path.join('c:', 'Users', 'soumy', 'OneDrive', 'Desktop', 'PDD', '.github', 'workflows');

const createWorkflow = (name, title, specs, envSetup = '') => {
  const content = `name: ${title}

on:
  push:
    branches: [main, master, develop]
  pull_request:
    branches: [main, master, develop]
  workflow_dispatch:

jobs:
  test:
    name: ${title}
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: 'qa-automation/package-lock.json'

      - name: Install QA dependencies
        working-directory: qa-automation
        run: npm install
${envSetup}
      - name: Run ${title}
        working-directory: qa-automation
        env:
          TEST_ENV: qa
          BASE_URL: https://bluehorizon.blue-horizon.workers.dev${envSetup.includes('chrome') ? '\n          BROWSER: chrome\n          HEADLESS: true' : ''}
        run: |
          npx mocha \\
${specs.map(s => '            "' + s + '" \\').join('\n')}
            --require tests/hooks/setup.js \\
            --require tests/hooks/teardown.js \\
            --timeout 120000 \\
            --reporter spec
        continue-on-error: true

      - name: Upload Excel Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: ${name}-report
          path: |
            qa-automation/excel/*.xlsx
            qa-automation/reports/*.xlsx
          retention-days: 30
`;
  fs.writeFileSync(path.join(workflowsDir, name + '.yml'), content);
};

const setupChrome = `
      - name: Setup Chrome
        uses: browser-actions/setup-chrome@v1
        with:
          chrome-version: stable
`;

createWorkflow('test-unit', 'Unit Test Suite', ['tests/specs/unit-tests.spec.js']);
createWorkflow('test-load', 'Load Test Suite', ['tests/specs/load-tests.spec.js']);
createWorkflow('test-vulnerability', 'Vulnerability Test Suite', ['tests/specs/vulnerability-tests.spec.js']);
createWorkflow('test-validation', 'Validation Test Suite', ['tests/specs/ui-validation.spec.js', 'tests/specs/ui-forms-validation.spec.js'], setupChrome);
createWorkflow('test-appium', 'Appium Test Suite', ['tests/specs/appium-mobile.spec.js']);
createWorkflow('test-selenium', 'Selenium Test Suite', ['tests/specs/authentication.spec.js', 'tests/specs/navigation.spec.js', 'tests/specs/admin-dashboard.spec.js', 'tests/specs/driver-dashboard.spec.js', 'tests/specs/parent-dashboard.spec.js'], setupChrome);

// Delete old ones
const oldFiles = ['mobile-appium.yml', 'qa-report.yml', 'selenium-e2e.yml'];
for (const f of oldFiles) {
  const p = path.join(workflowsDir, f);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
  }
}

console.log('Workflows created successfully.');
