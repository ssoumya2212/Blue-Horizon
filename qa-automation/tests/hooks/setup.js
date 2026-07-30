const chai = require('chai');
const { buildDriver } = require('../../utilities/browser-factory');
const config = require('../../config/test-config');
const logger = require('../../utilities/logger');

global.expect = chai.expect;

global.createDriver = async function createDriver() {
  const driver = await buildDriver(config.browser);
  logger.info(`Driver created for browser: ${config.browser}`);
  return driver;
};
