# Blue Horizon QA Reporting

This folder contains the testing deliverables for Blue Horizon in one place.
All report-related test assets are kept inside this single folder.

## Contents

- `package.json` - dependencies and script for report generation
- `templates/test-report-data.json` - detailed test matrix data for validation, vulnerability, unit, load, Selenium and Appium sheets
- `scripts/generate-test-report.js` - creates the Excel workbook
- `reports/` - generated Excel output

## Single-folder testing rule

Keep the report source data, report generator and generated Excel file inside `qa-reporting/`.
This is the main folder you can share, archive or upload for testing documentation.

## Generate report

From the project root:

```bash
npm install --prefix qa-reporting
node qa-reporting/scripts/generate-test-report.js
```

Output:

```bash
qa-reporting/reports/Blue_Horizon_Test_Report.xlsx
```

## Included test areas

- Validation testing
- Vulnerability testing
- Unit testing
- Load testing
- Selenium web testing
- Appium mobile testing

## GitHub Actions

The repository also includes workflows for:

- `.github/workflows/web-ci.yml`
- `.github/workflows/qa-report.yml`
- `.github/workflows/mobile-appium.yml`

These workflows can build the web app, generate the Excel QA report, and run mobile CI steps.
