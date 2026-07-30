const path = require('path');
const fs = require('fs-extra');
const winston = require('winston');

const logDir = path.resolve(__dirname, '..', 'logs');
fs.ensureDirSync(logDir);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} [${level.toUpperCase()}] ${stack || message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'automation.log') }),
    new winston.transports.Console()
  ]
});

module.exports = logger;
