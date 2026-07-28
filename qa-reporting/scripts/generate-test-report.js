import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dataPath = path.join(rootDir, 'templates', 'test-report-data.json');
const outDir = path.join(rootDir, 'reports');
const outFile = path.join(outDir, 'Blue_Horizon_Test_Report.xlsx');

const raw = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(raw);

fs.mkdirSync(outDir, { recursive: true });

const workbook = new ExcelJS.Workbook();
workbook.creator = 'Zed QA Reporting';
workbook.created = new Date();
workbook.modified = new Date();

function styleHeaderRow(row) {
  row.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '1F4E78' },
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });
}

function styleDataRows(worksheet, startRow = 2) {
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber < startRow) return;
    row.eachCell((cell) => {
      cell.alignment = { vertical: 'top', wrapText: true };
      cell.border = {
        top: { style: 'thin', color: { argb: 'D9D9D9' } },
        left: { style: 'thin', color: { argb: 'D9D9D9' } },
        bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
        right: { style: 'thin', color: { argb: 'D9D9D9' } },
      };
    });
  });
}

function autoSize(worksheet, min = 14, max = 40) {
  worksheet.columns.forEach((column) => {
    let width = min;
    column.eachCell?.({ includeEmpty: true }, (cell) => {
      const value = cell.value ? String(cell.value) : '';
      width = Math.max(width, Math.min(max, value.length + 2));
    });
    column.width = width;
  });
}

function addTableSheet(name, rows, columns) {
  const ws = workbook.addWorksheet(name);
  ws.columns = columns;
  ws.addRow(columns.map((c) => c.header));
  styleHeaderRow(ws.getRow(1));
  rows.forEach((row) => {
    ws.addRow(columns.map((c) => row[c.key] ?? ''));
  });
  ws.views = [{ state: 'frozen', ySplit: 1 }];
  styleDataRows(ws, 2);
  autoSize(ws);
  return ws;
}

const summary = workbook.addWorksheet('Summary');
summary.columns = [
  { header: 'Field', key: 'field', width: 28 },
  { header: 'Value', key: 'value', width: 60 },
];
summary.addRow(['Project Name', data.project.name]);
summary.addRow(['Version', data.project.version]);
summary.addRow(['Build', data.project.build]);
summary.addRow(['Environment', data.project.environment]);
summary.addRow(['Platforms', data.project.platforms.join(', ')]);
summary.addRow(['Prepared By', data.project.preparedBy]);
summary.addRow(['Reviewed By', data.project.reviewedBy]);
summary.addRow(['Report Date', data.project.reportDate]);
summary.addRow([]);
summary.addRow(['Total Cases', data.summary.totalCases]);
summary.addRow(['Passed', data.summary.passed]);
summary.addRow(['Failed', data.summary.failed]);
summary.addRow(['Blocked', data.summary.blocked]);
summary.addRow(['Not Run', data.summary.notRun]);
summary.addRow(['Overall Status', data.summary.overallStatus]);
summary.addRow(['Notes', data.summary.notes]);
styleHeaderRow(summary.getRow(1));
styleDataRows(summary, 1);
autoSize(summary, 18, 50);

addTableSheet('Validation', data.validationTests, [
  { header: 'ID', key: 'id' },
  { header: 'Module', key: 'module' },
  { header: 'Scenario', key: 'scenario' },
  { header: 'Precondition', key: 'precondition' },
  { header: 'Steps', key: 'steps' },
  { header: 'Expected', key: 'expected' },
  { header: 'Actual', key: 'actual' },
  { header: 'Status', key: 'status' },
  { header: 'Tool', key: 'tool' },
  { header: 'Severity', key: 'severity' },
  { header: 'Owner', key: 'owner' },
  { header: 'Remarks', key: 'remarks' },
]);

addTableSheet('Vulnerability', data.vulnerabilityTests, [
  { header: 'ID', key: 'id' },
  { header: 'Module', key: 'module' },
  { header: 'Check', key: 'check' },
  { header: 'Tool', key: 'tool' },
  { header: 'Severity', key: 'severity' },
  { header: 'CVSS', key: 'cvss' },
  { header: 'Expected', key: 'expected' },
  { header: 'Actual', key: 'actual' },
  { header: 'Status', key: 'status' },
  { header: 'Evidence', key: 'evidence' },
  { header: 'Recommendation', key: 'recommendation' },
]);

addTableSheet('Unit Tests', data.unitTests, [
  { header: 'ID', key: 'id' },
  { header: 'Component', key: 'component' },
  { header: 'Test Case', key: 'testCase' },
  { header: 'Framework', key: 'framework' },
  { header: 'Status', key: 'status' },
  { header: 'Coverage', key: 'coverage' },
  { header: 'Result', key: 'result' },
  { header: 'Remarks', key: 'remarks' },
]);

addTableSheet('Load Tests', data.loadTests, [
  { header: 'ID', key: 'id' },
  { header: 'Endpoint/Flow', key: 'endpointOrFlow' },
  { header: 'Tool', key: 'tool' },
  { header: 'Virtual Users', key: 'virtualUsers' },
  { header: 'Duration', key: 'duration' },
  { header: 'Target', key: 'target' },
  { header: 'P95 Response Time', key: 'responseTimeP95' },
  { header: 'Error Rate', key: 'errorRate' },
  { header: 'Status', key: 'status' },
  { header: 'Remarks', key: 'remarks' },
]);

addTableSheet('Selenium', data.seleniumTests, [
  { header: 'ID', key: 'id' },
  { header: 'Suite', key: 'suite' },
  { header: 'Scenario', key: 'scenario' },
  { header: 'Browser', key: 'browser' },
  { header: 'Environment', key: 'environment' },
  { header: 'Status', key: 'status' },
  { header: 'Evidence', key: 'evidence' },
  { header: 'Remarks', key: 'remarks' },
]);

addTableSheet('Appium', data.appiumTests, [
  { header: 'ID', key: 'id' },
  { header: 'Suite', key: 'suite' },
  { header: 'Scenario', key: 'scenario' },
  { header: 'Device', key: 'device' },
  { header: 'OS Version', key: 'osVersion' },
  { header: 'Status', key: 'status' },
  { header: 'Evidence', key: 'evidence' },
  { header: 'Remarks', key: 'remarks' },
]);

await workbook.xlsx.writeFile(outFile);
console.log(`Excel report generated: ${outFile}`);
