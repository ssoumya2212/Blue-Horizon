module.exports = {
  results: [],
  logs: [],
  pushResult(result) {
    this.results.push(result);
  },
  pushLog(log) {
    this.logs.push(log);
  }
};
