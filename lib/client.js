const { defaultConfig } = require('./constants');
const tls = require('tls');

class VNDBClient {
  /**
   * Create a new instance of VNDB client.
   * There are 2 possible signatures when instantiating a new client:
   *
   *   1. Only 1 argument, which is simply used to extend the default config
   *      new VNDBClient(overrideConfig);
   *
   *   2. More than 1 argument, which is used to override username, password, and default config.
   *      new VNDBClient(overrideUsername, overridePassword, overrideConfig);
   *
   * This will also automatically try to connect to VNDB API with
   * the configured server and login information.
   */
  constructor(...args) {
    const override = {
      config: args.length === 1 ? args[0] : args[2],
      username: args.length > 1 ? args[0] : defaultConfig.username,
      password: args.length > 1 ? args[1] : defaultConfig.password,
    };

    this.config = Object.assign({}, defaultConfig, override.config, {
      username: override.username,
      password: override.password,
    });

    this.socket = tls.connect({
      host: defaultConfig.host,
      port: defaultConfig.port,
    });
  }
}

module.exports = VNDBClient;

