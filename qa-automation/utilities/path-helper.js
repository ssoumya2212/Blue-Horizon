const path = require('path');
const fs = require('fs-extra');

function ensureDir(dirPath) {
  fs.ensureDirSync(dirPath);
  return dirPath;
}

function projectPath(...parts) {
  return path.resolve(__dirname, '..', ...parts);
}

module.exports = {
  ensureDir,
  projectPath
};
