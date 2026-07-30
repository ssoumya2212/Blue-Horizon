const environments = require('./environments');

const envName = process.env.TEST_ENV || 'qa';
const active = environments[envName] || environments.default;

module.exports = active;
