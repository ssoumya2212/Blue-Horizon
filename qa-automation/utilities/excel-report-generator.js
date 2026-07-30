/**
 * Excel Report Generator — Blue Horizon QA
 * Produces a rich multi-sheet .xlsx with real-time execution data,
 * colour-coded results, summary KPIs, per-module breakdowns, and
 * an execution log sheet. All data comes from the live test-state.
 */
'use strict';

const ExcelJS   = require('exceljs');
const fs        = require('fs-extra');
const path      = require('path');
const state     = require('./test-state');
const { ensureDir, projectPath } = require('./path-helper');

/* ─── Colour palette ─────────────────────────────────────────── */
const COLORS = {
  headerBg   : '1E3A5F',   // dark navy
  headerFont : 'FFFFFF',
  passed     : 'D6F5D6',   // light green
  failed     : 'FFD6D6',   // light red
  skipped    : 'FFF9C4',   // light yellow
  kpiBg      : 'EBF3FF',   // light blue
  sectionBg  : 'D9E8FF',
  borderColor: 'AAAAAA',
  passFont   : '2D7A2D',
  failFont   : 'B00000',
  skipFont   : '7A6000',
};

/* ─── Module → test-type mapping ────────────────────────────── */
const MODULE_TYPE = {
  'Admin Dashboard'            : 'Selenium E2E',
  'Driver Dashboard'           : 'Selenium E2E',
  'Parent Dashboard'           : 'Selenium E2E',
  'Navigation'                 : 'Selenium E2E',
  'UI & Forms Validation'      : 'Selenium E2E',
  'Authentication'             : 'Selenium E2E',
  'UI Validation'              : 'Selenium E2E',
  'Load & Performance'         : 'Load Test',
  'Vulnerability & Security'   : 'Vulnerability',
  'Unit Tests'                 : 'Unit Test',
  'Appium Mobile (Android)'    : 'Appium Mobile',
};

function testType(module) {
  return MODULE_TYPE[module] || 'Other';
}

/* ─── Cell stylers ───────────────────────────────────────────── */
function headerStyle(bold = true) {
  return {
    font       : { bold, color: { argb: COLORS.headerFont }, size: 11 },
    fill       : { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.headerBg } },
    alignment  : { vertical: 'middle', horizontal: 'center', wrapText: true },
    border     : { bottom: { style: 'thin', color: { argb: COLORS.borderColor } } },
  };
}

function statusStyle(status) {
  const map = {
    Passed  : { bg: COLORS.passed,  font: COLORS.passFont },
    Failed  : { bg: COLORS.failed,  font: COLORS.failFont },
    Skipped : { bg: COLORS.skipped, font: COLORS.skipFont },
  };
  const c = map[status] || { bg: 'FFFFFF', font: '000000' };
  return {
    font      : { bold: true, color: { argb: c.font } },
    fill      : { type: 'pattern', pattern: 'solid', fgColor: { argb: c.bg } },
    alignment : { vertical: 'middle', horizontal: 'center' },
  };
}

function cellBorder() {
  const side = { style: 'thin', color: { argb: COLORS.borderColor } };
  return { top: side, left: side, bottom: side, right: side };
}

function applyHeaderRow(sheet) {
  const row = sheet.getRow(1);
  row.height = 30;
  row.eachCell(cell => { Object.assign(cell, headerStyle()); });
  sheet.views = [{ state: 'frozen', ySplit: 1 }];
}

function applyDataRow(row, results) {
  row.eachCell({ includeEmpty: true }, (cell, col) => {
    cell.border = cellBorder();
    cell.alignment = { vertical: 'middle', wrapText: true };
  });

  // Colour status cell (assumed col 5 for all test sheets)
  const statusCell = row.getCell(5);
  if (['Passed', 'Failed', 'Skipped'].includes(statusCell.value)) {
    Object.assign(statusCell, statusStyle(statusCell.value));
  }
}

/* ─── KPI computation ────────────────────────────────────────── */
function computeKpis(results) {
  const total   = results.length;
  const passed  = results.filter(r => r.status === 'Passed').length;
  const failed  = results.filter(r => r.status === 'Failed').length;
  const skipped = results.filter(r => r.status === 'Skipped').length;
  const passRate = total ? ((passed / total) * 100).toFixed(1) + '%' : '0%';

  const durations = results.filter(r => r.durationMs).map(r => r.durationMs);
  const totalMs   = durations.reduce((a, b) => a + b, 0);
  const avgMs     = durations.length ? Math.round(totalMs / durations.length) : 0;
  const maxMs     = durations.length ? Math.max(...durations) : 0;
  const minMs     = durations.length ? Math.min(...durations) : 0;

  const byModule = {};
  results.forEach(r => {
    if (!byModule[r.module]) byModule[r.module] = { passed: 0, failed: 0, skipped: 0, total: 0 };
    byModule[r.module].total++;
    if (r.status === 'Passed')  byModule[r.module].passed++;
    if (r.status === 'Failed')  byModule[r.module].failed++;
    if (r.status === 'Skipped') byModule[r.module].skipped++;
  });

  const byType = {};
  results.forEach(r => {
    const type = testType(r.module);
    if (!byType[type]) byType[type] = { passed: 0, failed: 0, skipped: 0, total: 0 };
    byType[type].total++;
    if (r.status === 'Passed')  byType[type].passed++;
    if (r.status === 'Failed')  byType[type].failed++;
    if (r.status === 'Skipped') byType[type].skipped++;
  });

  return { total, passed, failed, skipped, passRate, totalMs, avgMs, maxMs, minMs, byModule, byType };
}

/* ─── Sheet 1: Executive Summary ────────────────────────────── */
function addSummarySheet(wb, kpis, runMeta) {
  const sheet = wb.addWorksheet('📊 Summary');
  sheet.properties.tabColor = { argb: '1E3A5F' };

  // Title block
  sheet.mergeCells('A1:H1');
  const title = sheet.getCell('A1');
  title.value     = 'BLUE HORIZON — QA TEST EXECUTION REPORT';
  title.font      = { bold: true, size: 16, color: { argb: COLORS.headerFont } };
  title.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.headerBg } };
  title.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(1).height = 36;

  sheet.mergeCells('A2:H2');
  const sub = sheet.getCell('A2');
  sub.value     = `Generated: ${new Date().toLocaleString('en-IN')}  |  Environment: ${runMeta.env}  |  Browser: ${runMeta.browser}`;
  sub.font      = { italic: true, size: 10, color: { argb: '555555' } };
  sub.alignment = { horizontal: 'center' };
  sheet.getRow(2).height = 20;

  // KPI block — row 4
  const kpiHeaders = ['Total Tests', 'Passed', 'Failed', 'Skipped', 'Pass Rate', 'Total Duration', 'Avg Duration', 'Max Duration'];
  const kpiValues  = [
    kpis.total,
    kpis.passed,
    kpis.failed,
    kpis.skipped,
    kpis.passRate,
    `${(kpis.totalMs / 1000).toFixed(1)}s`,
    `${(kpis.avgMs / 1000).toFixed(2)}s`,
    `${(kpis.maxMs / 1000).toFixed(2)}s`,
  ];

  const hdrRow = sheet.addRow(kpiHeaders);  // row 3 (after blank)
  hdrRow.height = 22;
  hdrRow.eachCell(cell => {
    cell.font  = { bold: true, color: { argb: COLORS.headerFont }, size: 11 };
    cell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.headerBg } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border    = cellBorder();
  });

  const valRow = sheet.addRow(kpiValues);
  valRow.height = 28;
  valRow.eachCell((cell, i) => {
    cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.kpiBg } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border    = cellBorder();
    cell.font      = { bold: true, size: 12 };
    // Colour passed/failed KPI cells
    if (i === 2) cell.font = { bold: true, size: 14, color: { argb: COLORS.passFont } };
    if (i === 3) cell.font = { bold: true, size: 14, color: { argb: COLORS.failFont } };
  });

  sheet.addRow([]);

  // Module breakdown table
  const modHdr = sheet.addRow(['Module', 'Test Type', 'Total', 'Passed', 'Failed', 'Skipped', 'Pass Rate', 'Status']);
  modHdr.height = 22;
  modHdr.eachCell(cell => {
    cell.font  = { bold: true, color: { argb: COLORS.headerFont } };
    cell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2E5C8A' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border    = cellBorder();
  });

  Object.entries(kpis.byModule).forEach(([mod, m]) => {
    const rate   = m.total ? ((m.passed / m.total) * 100).toFixed(1) + '%' : '0%';
    const health = m.failed === 0 ? 'PASS' : m.passed === 0 ? 'FAIL' : 'PARTIAL';
    const r      = sheet.addRow([mod, testType(mod), m.total, m.passed, m.failed, m.skipped, rate, health]);
    r.height     = 18;
    r.eachCell((cell, i) => {
      cell.border    = cellBorder();
      cell.alignment = { vertical: 'middle', horizontal: i <= 2 ? 'left' : 'center' };
    });
    const hCell = r.getCell(8);
    Object.assign(hCell, statusStyle(health === 'PASS' ? 'Passed' : health === 'FAIL' ? 'Failed' : 'Skipped'));
  });

  sheet.columns = [
    { width: 32 }, { width: 20 }, { width: 10 },
    { width: 10 }, { width: 10 }, { width: 10 },
    { width: 12 }, { width: 12 },
  ];
}

/* ─── Sheet 2: Test Type Breakdown ─────────────────────────── */
function addTypeBreakdownSheet(wb, kpis) {
  const sheet = wb.addWorksheet('📋 By Test Type');
  sheet.properties.tabColor = { argb: '2E5C8A' };

  sheet.columns = [
    { header: 'Test Type',  key: 'type',    width: 24 },
    { header: 'Total',      key: 'total',   width: 10 },
    { header: 'Passed',     key: 'passed',  width: 10 },
    { header: 'Failed',     key: 'failed',  width: 10 },
    { header: 'Skipped',    key: 'skipped', width: 10 },
    { header: 'Pass Rate',  key: 'rate',    width: 12 },
    { header: 'Coverage',   key: 'pct',     width: 14 },
  ];
  applyHeaderRow(sheet);

  const grandTotal = Object.values(kpis.byType).reduce((a, b) => a + b.total, 0) || 1;
  Object.entries(kpis.byType).forEach(([type, t]) => {
    const rate = t.total ? ((t.passed / t.total) * 100).toFixed(1) + '%' : '0%';
    const pct  = ((t.total / grandTotal) * 100).toFixed(1) + '%';
    const r    = sheet.addRow({ type, total: t.total, passed: t.passed, failed: t.failed, skipped: t.skipped, rate, pct });
    r.height   = 18;
    applyDataRow(r);
  });
}

/* ─── Sheet 3: All Tests (master list) ─────────────────────── */
function addAllTestsSheet(wb, results) {
  const sheet = wb.addWorksheet('🧪 All Tests');
  sheet.properties.tabColor = { argb: '0070C0' };

  sheet.columns = [
    { header: 'Test ID',       key: 'testId',        width: 18 },
    { header: 'Module',        key: 'module',        width: 28 },
    { header: 'Test Type',     key: 'testType',      width: 18 },
    { header: 'Test Name',     key: 'testName',      width: 54 },
    { header: 'Status',        key: 'status',        width: 12 },
    { header: 'Browser',       key: 'browser',       width: 14 },
    { header: 'Duration (ms)', key: 'durationMs',    width: 15 },
    { header: 'Start Time',    key: 'startTime',     width: 24 },
    { header: 'End Time',      key: 'endTime',       width: 24 },
    { header: 'URL',           key: 'url',           width: 40 },
    { header: 'Failure Reason',key: 'failureReason', width: 48 },
  ];
  applyHeaderRow(sheet);

  results.forEach(r => {
    const row = sheet.addRow({
      testId       : r.testId || '',
      module       : r.module || '',
      testType     : testType(r.module),
      testName     : r.testName || '',
      status       : r.status || 'Unknown',
      browser      : r.browser || '',
      durationMs   : r.durationMs || 0,
      startTime    : r.startTime || '',
      endTime      : r.endTime || '',
      url          : r.url || '',
      failureReason: r.failureReason || '',
    });
    row.height = 16;
    applyDataRow(row);
  });
}

/* ─── Sheet 4–9: Per-category sheets ───────────────────────── */
function addCategorySheet(wb, name, emoji, color, results) {
  const sheet = wb.addWorksheet(`${emoji} ${name}`);
  sheet.properties.tabColor = { argb: color };

  sheet.columns = [
    { header: 'Test ID',       key: 'testId',        width: 18 },
    { header: 'Module',        key: 'module',        width: 28 },
    { header: 'Test Name',     key: 'testName',      width: 56 },
    { header: 'Browser',       key: 'browser',       width: 14 },
    { header: 'Status',        key: 'status',        width: 12 },
    { header: 'Duration (ms)', key: 'durationMs',    width: 15 },
    { header: 'Start Time',    key: 'startTime',     width: 24 },
    { header: 'Failure Reason',key: 'failureReason', width: 50 },
    { header: 'Screenshot',    key: 'screenshotPath',width: 40 },
  ];
  applyHeaderRow(sheet);

  if (results.length === 0) {
    sheet.addRow({ testId: 'N/A', module: name, testName: 'No tests recorded for this category yet', status: 'Skipped' });
    return;
  }

  results.forEach(r => {
    const row = sheet.addRow({
      testId       : r.testId || '',
      module       : r.module || '',
      testName     : r.testName || '',
      browser      : r.browser || '',
      status       : r.status || 'Unknown',
      durationMs   : r.durationMs || 0,
      startTime    : r.startTime || '',
      failureReason: r.failureReason || '',
      screenshotPath: r.screenshotPath || '',
    });
    row.height = 16;
    applyDataRow(row);
  });
}

/* ─── Sheet: Failed Tests Detail ───────────────────────────── */
function addFailedSheet(wb, results) {
  const failed = results.filter(r => r.status === 'Failed');
  const sheet  = wb.addWorksheet('❌ Failed Tests');
  sheet.properties.tabColor = { argb: 'B00000' };

  sheet.columns = [
    { header: 'Test ID',       key: 'testId',        width: 18 },
    { header: 'Module',        key: 'module',        width: 28 },
    { header: 'Test Type',     key: 'testType',      width: 18 },
    { header: 'Test Name',     key: 'testName',      width: 54 },
    { header: 'Browser',       key: 'browser',       width: 14 },
    { header: 'Failure Reason',key: 'failureReason', width: 56 },
    { header: 'Screenshot',    key: 'screenshotPath',width: 48 },
    { header: 'URL',           key: 'url',           width: 48 },
    { header: 'Duration (ms)', key: 'durationMs',    width: 15 },
    { header: 'Timestamp',     key: 'startTime',     width: 24 },
  ];
  applyHeaderRow(sheet);

  if (failed.length === 0) {
    const r = sheet.addRow({ testId: '—', module: '—', testType: '—', testName: '🎉 All tests passed! No failures recorded.', status: 'Passed' });
    r.getCell(4).font = { bold: true, color: { argb: COLORS.passFont } };
    return;
  }

  failed.forEach(r => {
    const row = sheet.addRow({
      testId       : r.testId || '',
      module       : r.module || '',
      testType     : testType(r.module),
      testName     : r.testName || '',
      browser      : r.browser || '',
      failureReason: r.failureReason || '',
      screenshotPath: r.screenshotPath || '',
      url          : r.url || '',
      durationMs   : r.durationMs || 0,
      startTime    : r.startTime || '',
    });
    row.height = 18;
    row.eachCell(cell => {
      cell.border    = cellBorder();
      cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD6D6' } };
      cell.alignment = { vertical: 'middle', wrapText: true };
    });
  });
}

/* ─── Sheet: Execution Logs ─────────────────────────────────── */
function addExecutionLogsSheet(wb, logs) {
  const sheet = wb.addWorksheet('📝 Execution Logs');
  sheet.properties.tabColor = { argb: '555555' };

  sheet.columns = [
    { header: 'Timestamp',       key: 'timestamp',       width: 28 },
    { header: 'Test Name',       key: 'testName',        width: 44 },
    { header: 'Step Description',key: 'stepDescription', width: 54 },
    { header: 'Result',          key: 'result',          width: 14 },
    { header: 'Remarks',         key: 'remarks',         width: 50 },
  ];
  applyHeaderRow(sheet);

  if (!logs || logs.length === 0) {
    sheet.addRow({ timestamp: new Date().toISOString(), testName: '—', stepDescription: 'No step logs captured', result: 'INFO', remarks: '' });
    return;
  }

  logs.forEach(log => {
    const row = sheet.addRow({
      timestamp      : log.timestamp || '',
      testName       : log.testName || '',
      stepDescription: log.stepDescription || '',
      result         : log.result || '',
      remarks        : log.remarks || '',
    });
    row.height = 15;
    row.eachCell(cell => {
      cell.border    = cellBorder();
      cell.alignment = { vertical: 'middle', wrapText: false };
    });
    const resultCell = row.getCell(4);
    if (resultCell.value === 'PASS') {
      resultCell.font = { bold: true, color: { argb: COLORS.passFont } };
    } else if (resultCell.value === 'FAILED') {
      resultCell.font = { bold: true, color: { argb: COLORS.failFont } };
    }
  });
}

/* ─── Sheet: Performance Metrics ────────────────────────────── */
function addPerformanceSheet(wb, results) {
  const loadResults = results.filter(r =>
    r.module === 'Load & Performance' || r.testId.startsWith('LOAD')
  );
  const sheet = wb.addWorksheet('⚡ Performance');
  sheet.properties.tabColor = { argb: 'FF8C00' };

  sheet.columns = [
    { header: 'Test ID',         key: 'testId',     width: 18 },
    { header: 'Test Name',       key: 'testName',   width: 58 },
    { header: 'Status',          key: 'status',     width: 12 },
    { header: 'Duration (ms)',   key: 'durationMs', width: 16 },
    { header: 'Duration (s)',    key: 'durationS',  width: 14 },
    { header: 'SLA Threshold',   key: 'sla',        width: 16 },
    { header: 'SLA Met',         key: 'slaMet',     width: 12 },
    { header: 'Failure Reason',  key: 'reason',     width: 40 },
  ];
  applyHeaderRow(sheet);

  const SLA_THRESHOLDS = {
    'Baseline': 3000, 'Concurrent': 8000, 'Burst': 12000,
    'Throughput': 8000, 'Content': 8000,
  };

  loadResults.forEach(r => {
    const dur   = r.durationMs || 0;
    const durS  = (dur / 1000).toFixed(2);
    const sla   = 8000;
    const met   = dur <= sla ? 'Yes' : 'No';
    const row   = sheet.addRow({
      testId: r.testId, testName: r.testName, status: r.status,
      durationMs: dur, durationS: parseFloat(durS), sla: `${sla}ms`, slaMet: met,
      reason: r.failureReason || '',
    });
    row.height = 16;
    applyDataRow(row);
    const metCell = row.getCell(7);
    metCell.font = { bold: true, color: { argb: met === 'Yes' ? COLORS.passFont : COLORS.failFont } };
  });

  if (loadResults.length === 0) {
    sheet.addRow({ testId: 'N/A', testName: 'No load test results recorded yet', status: 'Skipped' });
  }
}

/* ─── Sheet: Security Findings ──────────────────────────────── */
function addSecuritySheet(wb, results) {
  const secResults = results.filter(r =>
    r.module === 'Vulnerability & Security' || r.testId.startsWith('SEC')
  );
  const sheet = wb.addWorksheet('🔒 Security');
  sheet.properties.tabColor = { argb: '7030A0' };

  sheet.columns = [
    { header: 'Test ID',         key: 'testId',    width: 20 },
    { header: 'Test Name',       key: 'testName',  width: 58 },
    { header: 'Category',        key: 'category',  width: 22 },
    { header: 'Status',          key: 'status',    width: 12 },
    { header: 'Risk Level',      key: 'risk',      width: 14 },
    { header: 'Browser',         key: 'browser',   width: 14 },
    { header: 'Failure / Finding', key: 'finding', width: 50 },
  ];
  applyHeaderRow(sheet);

  function riskLevel(id) {
    if (/SEC-00[1-7]/.test(id))  return 'HIGH';
    if (/SEC-0(0[89]|1[0-3])/.test(id)) return 'CRITICAL';
    if (/SEC-01[4-9]/.test(id))  return 'HIGH';
    if (/SEC-02[0-8]/.test(id))  return 'MEDIUM';
    return 'LOW';
  }

  function category(name) {
    if (name.includes('XSS'))        return 'XSS Prevention';
    if (name.includes('SQL') || name.includes('Inject')) return 'Injection';
    if (name.includes('Auth') || name.includes('bypass') || name.includes('session')) return 'Auth Security';
    if (name.includes('Header') || name.includes('HSTS') || name.includes('frame')) return 'HTTP Headers';
    if (name.includes('Redirect') || name.includes('Clickjack')) return 'Open Redirect';
    if (name.includes('Expos') || name.includes('key') || name.includes('password')) return 'Data Exposure';
    return 'General Security';
  }

  secResults.forEach(r => {
    const risk = riskLevel(r.testId);
    const row  = sheet.addRow({
      testId  : r.testId, testName: r.testName,
      category: category(r.testName.toLowerCase()), status: r.status,
      risk, browser: r.browser, finding: r.failureReason || (r.status === 'Passed' ? 'No vulnerability found' : ''),
    });
    row.height = 16;
    applyDataRow(row);
    const riskCell = row.getCell(5);
    const riskColors = { CRITICAL: 'B00000', HIGH: 'FF6600', MEDIUM: 'FF9900', LOW: '2D7A2D' };
    riskCell.font = { bold: true, color: { argb: riskColors[risk] || '000000' } };
  });

  if (secResults.length === 0) {
    sheet.addRow({ testId: 'N/A', testName: 'No security test results recorded yet', status: 'Skipped' });
  }
}

/* ─── Sheet: Mobile (Appium) ────────────────────────────────── */
function addMobileSheet(wb, results) {
  const mobileResults = results.filter(r =>
    r.module === 'Appium Mobile (Android)' || r.testId.startsWith('MOB')
  );
  addCategorySheet(wb, 'Appium Mobile', '📱', '00B050', mobileResults);
}

/* ─── Sheet: Unit Tests ─────────────────────────────────────── */
function addUnitSheet(wb, results) {
  const unitResults = results.filter(r =>
    r.module === 'Unit Tests' || r.testId.startsWith('UNIT')
  );
  addCategorySheet(wb, 'Unit Tests', '🔬', '0070C0', unitResults);
}

/* ─── Sheet: Selenium E2E ───────────────────────────────────── */
function addSeleniumSheet(wb, results) {
  const seleniumModules = [
    'Admin Dashboard', 'Driver Dashboard', 'Parent Dashboard',
    'Navigation', 'UI & Forms Validation', 'Authentication', 'UI Validation',
  ];
  const seleniumResults = results.filter(r => seleniumModules.includes(r.module));
  addCategorySheet(wb, 'Selenium E2E', '🌐', '1E3A5F', seleniumResults);
}

/* ─── Main orchestrator ─────────────────────────────────────── */
async function generateExcelReport() {
  const results  = state.results || [];
  const logs     = state.logs    || [];
  const kpis     = computeKpis(results);

  const runMeta = {
    env    : process.env.TEST_ENV || 'qa',
    browser: process.env.BROWSER  || 'chrome',
    baseUrl: process.env.BASE_URL  || 'https://bluehorizon.blue-horizon.workers.dev',
  };

  const wb = new ExcelJS.Workbook();
  wb.creator     = 'Blue Horizon QA Automation';
  wb.lastModifiedBy = 'Blue Horizon QA';
  wb.created     = new Date();
  wb.modified    = new Date();

  // Build all sheets
  addSummarySheet(wb, kpis, runMeta);
  addTypeBreakdownSheet(wb, kpis);
  addAllTestsSheet(wb, results);
  addSeleniumSheet(wb, results);
  addPerformanceSheet(wb, results);
  addSecuritySheet(wb, results);
  addMobileSheet(wb, results);
  addUnitSheet(wb, results);
  addFailedSheet(wb, results);
  addExecutionLogsSheet(wb, logs);

  // Write file
  const reportDir   = ensureDir(projectPath('excel'));
  const reportsDir  = ensureDir(projectPath('reports'));
  const timestamp   = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const fileName    = `Blue_Horizon_QA_Report_${timestamp}.xlsx`;
  const masterName  = 'Blue_Horizon_Master_Test_Report.xlsx';
  const filePath    = path.join(reportDir, masterName);
  const dupPath     = path.join(reportsDir, masterName);
  const stampedPath = path.join(reportDir, fileName);

  await wb.xlsx.writeFile(filePath);
  await fs.copy(filePath, dupPath);
  await fs.copy(filePath, stampedPath);

  const total   = kpis.total;
  const passed  = kpis.passed;
  const failed  = kpis.failed;
  const skipped = kpis.skipped;

  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║        BLUE HORIZON — QA REPORT GENERATED           ║');
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log(`║  Total  : ${String(total).padEnd(5)} tests                              ║`);
  console.log(`║  Passed : ${String(passed).padEnd(5)} (${kpis.passRate.padEnd(6)})                       ║`);
  console.log(`║  Failed : ${String(failed).padEnd(5)}                                   ║`);
  console.log(`║  Skipped: ${String(skipped).padEnd(5)}                                   ║`);
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log(`║  📄 ${filePath.slice(-50).padEnd(50)} ║`);
  console.log('╚══════════════════════════════════════════════════════╝\n');

  return filePath;
}

if (require.main === module) {
  generateExcelReport().catch(e => { console.error(e); process.exit(1); });
}

module.exports = generateExcelReport;
