const fs = require('fs-extra');
const path = require('path');
const { ensureDir, projectPath } = require('./path-helper');

async function generateHtmlIndex() {
  const reportsDir = ensureDir(projectPath('reports'));
  const htmlDir = ensureDir(path.join(reportsDir, 'html'));
  const indexPath = path.join(reportsDir, 'index.html');
  const content = `<!doctype html>
<html>
<head><meta charset="utf-8"><title>Blue Horizon E2E Reports</title></head>
<body>
  <h1>Blue Horizon E2E Reports</h1>
  <ul>
    <li><a href="html/mochawesome.html">Mochawesome HTML Report</a></li>
    <li><a href="../excel/E2E_Report.xlsx">Excel Report</a></li>
  </ul>
</body>
</html>`;
  await fs.writeFile(indexPath, content, 'utf8');
  console.log(`HTML report index generated: ${indexPath}`);
}

if (require.main === module) {
  generateHtmlIndex().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = generateHtmlIndex;
