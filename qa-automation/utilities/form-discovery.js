const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const { projectPath, ensureDir } = require('./path-helper');

function extractForms(content, filePath) {
  const results = [];
  const inputRegex = /<(Input|input|select|textarea)([\s\S]*?)>/g;
  let match;
  while ((match = inputRegex.exec(content))) {
    const raw = match[0];
    const nameMatch = raw.match(/name=\"([^\"]+)\"|name=\{\"([^\"]+)\"\}/);
    const idMatch = raw.match(/id=\"([^\"]+)\"/);
    const typeMatch = raw.match(/type=\"([^\"]+)\"/);
    const required = /required/.test(raw);
    results.push({
      sourceFile: filePath,
      element: match[1],
      name: nameMatch ? nameMatch[1] || nameMatch[2] : '',
      id: idMatch ? idMatch[1] : '',
      type: typeMatch ? typeMatch[1] : 'text',
      required
    });
  }
  return results;
}

async function discover() {
  const routeFiles = glob.sync(projectPath('WEB APP', 'src', 'routes', '*.tsx'));
  const componentFiles = glob.sync(projectPath('WEB APP', 'src', 'components', '**', '*.tsx'));
  const files = [...routeFiles, ...componentFiles];
  const found = [];

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    found.push(...extractForms(content, path.relative(projectPath(), file)));
  }

  const outDir = ensureDir(projectPath('qa-automation', 'data'));
  const outFile = path.join(outDir, 'discovered-forms.json');
  await fs.writeJson(outFile, found, { spaces: 2 });
  console.log(`Discovered ${found.length} form elements -> ${outFile}`);
}

if (require.main === module) {
  discover().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = discover;
