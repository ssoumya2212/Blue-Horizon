# Blue Horizon Selenium E2E Framework

Production-ready Node.js + Selenium WebDriver automation framework for a React application.

## Stack

- Node.js
- Selenium WebDriver
- JavaScript (ES6+)
- Mocha
- Chai
- ExcelJS
- Mochawesome
- Winston
- GitHub Actions

## Framework structure

```text
qa-automation/
├── tests/
│   ├── hooks/
│   └── specs/
├── pages/
├── utilities/
├── config/
├── reports/
├── screenshots/
├── logs/
├── excel/
├── data/
├── package.json
└── README.md
```

## Supported browsers

- Chrome
- Firefox
- Edge

Supports headed and headless execution through environment variables.

## Commands

```bash
npm install --prefix qa-automation
npm run --prefix qa-automation discover:forms
npm run --prefix qa-automation test:chrome:headless
npm run --prefix qa-automation report:excel
npm run --prefix qa-automation e2e
```

## Environment variables

- `BASE_URL`
- `BROWSER`
- `HEADLESS`
- `TEST_ENV`
- `IMPLICIT_WAIT`
- `EXPLICIT_WAIT`
- `PAGELOAD_TIMEOUT`
- `RETRY_COUNT`
- `PARALLEL`

## Reporting

### Excel report
Generated at:

- `qa-automation/excel/Blue_Horizon_Master_Test_Report.xlsx`
- duplicate copy in `qa-automation/reports/Blue_Horizon_Master_Test_Report.xlsx`

Sheets:
- Summary
- Validation
- Selenium
- Appium
- Vulnerability
- Unit Tests
- Load Tests
- Failed Tests
- Execution Logs

### HTML report
Mochawesome generates HTML under:

- `qa-automation/reports/html/`

## Failure handling

On failure the framework captures:

- screenshot
- browser console logs
- current URL
- failure reason
- stack trace

Stored under:

- `qa-automation/reports/failures/`

## Dynamic React form discovery

The framework includes a discovery script that scans React routes and components to identify forms and input controls:

```bash
npm run --prefix qa-automation discover:forms
```

Output:

- `qa-automation/data/discovered-forms.json`

This is intended to improve coverage generation beyond only hardcoded tests.

## GitHub Actions

Workflow file:

- `.github/workflows/selenium-e2e.yml`

Artifacts uploaded:

- `E2E_Report.xlsx`
- Mochawesome report
- screenshots
- logs

## Notes

This framework is production-ready as a reusable foundation, but selectors and business-flow assertions may still need project-specific tuning if the target UI changes.
