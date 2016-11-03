const { defaultConfig } = require('./constants');
const tls = require('tls');

class VNDBClient {
  /**
   * Create a new instance of VNDB client.
   * This is purely for setting internal properties without doing anything else.
   * ALL variable properties must be initialized and commented here.
   */
  constructor() {
    /**
     * A set of default values, taken from a constants file.
     */
    this._defaults = Object.assign({}, defaultConfig);

    /**
     * A state is a one word description that describes the condition of the client.
     * client._states are a collection of possible states.
     */
    this._states = {
      // The client is newly constructed, it hasn't connected to VNDB API yet.
      new: 'new',

      // The client has connected to VNDB API and is not processing any commands.
      idle: 'idle',

      // The client has connected to VNDB API and is processing a command.
      busy: 'busy',
    };

    /**
     * client.state describes the current state of the client.
     * Most methods check the current state first before deciding the course of action.
     */
    this.state = this._states.new;

    /**
     * Keeping for reference only
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
    */
  }
}

module.exports = VNDBClient;

