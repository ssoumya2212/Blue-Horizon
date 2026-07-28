# Blue Horizon QA Test Report Guide

This folder provides an Excel-based QA reporting setup for:

- Validation testing
- Vulnerability testing
- Unit testing
- Load testing
- Selenium web automation reporting
- Appium mobile automation reporting

## Files

- `qa-reporting/templates/test-report-data.json` - source data for the report
- `qa-reporting/scripts/generate-test-report.js` - generates the Excel workbook
- `qa-reporting/reports/Blue_Horizon_Test_Report.xlsx` - generated output

## Generate the Excel report

From the project root:

```bash
cd qa-reporting
npm install
npm run generate-report
```

## What the workbook contains

- `Summary`
- `Validation`
- `Vulnerability`
- `Unit Tests`
- `Load Tests`
- `Selenium`
- `Appium`

## How to use it

1. Update `qa-reporting/templates/test-report-data.json`
2. Replace sample rows with actual executed results
3. Regenerate the workbook
4. Upload the generated `.xlsx` file as a release or workflow artifact

## Recommended evidence to attach

- Selenium screenshots and logs
- Appium screenshots and logs
- MobSF report PDF/HTML
- Load test summary graphs
- Unit test coverage reports
- Build logs from GitHub Actions

## Current repo reality

This repository already has:

- web build support in `web_app`
- Appium automation support in `android/qa-automation`
- an existing Android workflow in `android/.github/workflows/appium.yml`

This repository does not yet clearly contain:

- a committed Selenium test suite
- a committed load-test suite
- a configured unit-test framework for `web_app`

So the report generator includes those sections as structured placeholders that you can fill with real execution results now, and later automate further.
