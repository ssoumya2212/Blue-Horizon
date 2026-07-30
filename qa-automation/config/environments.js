module.exports = {
  default: {
    name: 'default',
    baseUrl: process.env.BASE_URL || 'https://bluehorizon.blue-horizon.workers.dev',
    browser: process.env.BROWSER || 'chrome',
    headless: String(process.env.HEADLESS || 'true') === 'true',
    implicitWait: Number(process.env.IMPLICIT_WAIT || 5000),
    explicitWait: Number(process.env.EXPLICIT_WAIT || 15000),
    pageLoadTimeout: Number(process.env.PAGELOAD_TIMEOUT || 30000),
    retryCount: Number(process.env.RETRY_COUNT || 1),
    parallel: String(process.env.PARALLEL || 'false') === 'true'
  },
  qa: {
    name: 'qa',
    baseUrl: process.env.BASE_URL || 'https://bluehorizon.blue-horizon.workers.dev',
    browser: process.env.BROWSER || 'chrome',
    headless: String(process.env.HEADLESS || 'true') === 'true',
    implicitWait: Number(process.env.IMPLICIT_WAIT || 5000),
    explicitWait: Number(process.env.EXPLICIT_WAIT || 15000),
    pageLoadTimeout: Number(process.env.PAGELOAD_TIMEOUT || 30000),
    retryCount: Number(process.env.RETRY_COUNT || 1),
    parallel: String(process.env.PARALLEL || 'false') === 'true'
  }
};
