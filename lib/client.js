const { defaults } = require('./constants');
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
    this._defaults = Object.assign({}, defaults);

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
     * A client can only process one message at a time.
     * Any request to process a message while it's busy should be pushed into client.queue.
     * Queued messages are processed with FIFO strategy.
     */
    this.queues = [];

    /**
     * Keeping for reference only
    const override = {
      config: args.length === 1 ? args[0] : args[2],
      username: args.length > 1 ? args[0] : defaults.username,
      password: args.length > 1 ? args[1] : defaults.password,
    };

    this.config = Object.assign({}, defaults, override.config, {
      username: override.username,
      password: override.password,
    });

    this.socket = tls.connect({
      host: defaults.host,
      port: defaults.port,
    });
    */
  }

  write(message = '') {
    switch (this.state) {
      case this._states.new:
        throw new Error('client is not ready to process a message');
      case this._states.idle:
        this.state = this._states.busy;
        break;
      case this._states.busy:
        this.queues = this.queues.concat(message);
        break;
      default:
        throw new Error(`client is in an unrecognizeable state ${this.state}`);
    }
  }
}

module.exports = VNDBClient;

