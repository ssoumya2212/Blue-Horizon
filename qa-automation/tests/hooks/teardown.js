const generateExcelReport = require('../../utilities/excel-report-generator');
const generateHtmlIndex   = require('../../utilities/html-report-index');

// Mocha makes `after` available as a global only once the test suite loads.
// We defer registration via setImmediate so the Mocha context is ready.
setImmediate(() => {
  if (typeof after === 'function') {
    after(async function globalTeardown() {
      this.timeout(30000);
      await generateExcelReport();
      try { await generateHtmlIndex(); } catch {}
    });
  } else {
    // Fallback: generate on process exit
    process.on('exit', () => {
      generateExcelReport().catch(() => {});
    });
  }
});
