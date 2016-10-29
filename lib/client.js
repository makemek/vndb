const { defaultConfig } = require('./constants');

class VNDBClient {
  constructor(config) {
    this.config = Object.assign({}, defaultConfig, config);
  }
}

module.exports = VNDBClient;

