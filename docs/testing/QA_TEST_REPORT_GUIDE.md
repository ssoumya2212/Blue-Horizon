# Blue Horizon QA Test Report Guide

This project now includes a centralized QA reporting package and GitHub Actions workflow setup.

## Main QA folder

Use this folder as the single source for testing artifacts:

- `qa-reporting/`

All report deliverables should stay in this one folder structure.

Inside it:

- `README.md`
- `package.json`
- `templates/test-report-data.json`
- `scripts/generate-test-report.js`
- `reports/Blue_Horizon_Test_Report.xlsx` after generation

This means your Excel report input, generator and output are all grouped together in one testing folder.

## Covered report areas

The Excel workbook includes separate sheets for:

- Summary
- Validation
- Vulnerability
- Unit Tests
- Load Tests
- Selenium
- Appium

## Generate the Excel workbook

From project root:

```bash
npm install --prefix qa-reporting
node qa-reporting/scripts/generate-test-report.js
```

Generated file:

```bash
qa-reporting/reports/Blue_Horizon_Test_Report.xlsx
```

## Current execution truth

This session verified:

- production public home page is reachable at `https://bluehorizon.blue-horizon.workers.dev/`
- local web build passes for `WEB APP`
- workflow files exist for web CI, QA report generation, and mobile CI scaffolding

This session did not fully execute:

- Selenium authenticated flows
- Appium device/emulator tests
- vulnerability scan tools like MobSF or npm audit
- load testing tools like k6/JMeter
- full unit test suite, because a unit-test framework is not yet configured in the app

So the report contains:

- real verified items where available
- blocked/not-run items where execution still requires infrastructure or automation suites

## GitHub Actions workflows

Available workflows:

- `.github/workflows/web-ci.yml`
- `.github/workflows/qa-report.yml`
- `.github/workflows/mobile-appium.yml`

## Recommended next order

1. Push cleaned repository to GitHub
2. Trigger `Web CI`
3. Trigger `QA Report Generator`
4. Download generated Excel artifact
5. Add Selenium/Appium scripts if you want the workbook to fill from actual automated execution logs

## Credentials note

Use the provided credentials only in your authorized QA environment.
Do not commit secrets or passwords into public repositories or CI logs.
