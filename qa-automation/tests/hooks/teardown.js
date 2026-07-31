const generateExcelReport = require('../../utilities/excel-report-generator');
const generateHtmlIndex   = require('../../utilities/html-report-index');

exports.mochaHooks = {
  afterAll: async function() {
    this.timeout(30000);
    await generateExcelReport();
    try { await generateHtmlIndex(); } catch {}
  }
};
