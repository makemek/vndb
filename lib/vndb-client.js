/* eslint no-unused-vars: 0 */
/* eslint class-methods-use-this: 0 */
// TODO: Remove above rules if no stubs left anymore.
const { createDeferredPromise } = require('./utils');
const { defaults, terminator } = require('./vndb-constants');
const tls = require('tls');
const VNDBError = require('./vndb-error');

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
     * A client can only process one message at a time.
     * Any request to process a message while it's busy should be pushed into client.queue.
     * Queued messages are processed with FIFO strategy.
     */
    this.queues = [];

    /**
     * client.socket will contain an instance of tls.TLSSocket.
     */
    this.socket = null;

    /**
     * After sending message to VNDB API, this client will receive responses in chunk
     * until it is terminated. Until it does, response is appended to client.bufferedResponse.
     *
     * If client.bufferedResponse is null, it is a good indication that the client is idle.
     */
    this.bufferedResponse = null;
  }

  /**
   * Write a message to VNDB API.
   * While still receiving response from API, it is appended to client.bufferedResponse.
   * Resolve/reject after the response is terminated.
   */
  write(message) {
    if (!this.socket) {
      throw new Error('fails to write, client has not connected to VNDB API yet');
    }
    if (this.bufferedResponse !== null) {
      throw new Error('fails to write, client is currently still receiving response');
    }

    return new Promise((resolve, reject) => {
      this.bufferedResponse = '';

      const handleData = (response) => {
        const utf8Response = response.toString('utf8');
        this.bufferedResponse = `${this.bufferedResponse}${utf8Response}`;

        // Continue listening for response until it is terminated properly
        if (utf8Response[utf8Response.length - 1] !== terminator) {
          return;
        }

        // Resolve the message if and only if it doesn't begin with "error"
        this.bufferedResponse = this.bufferedResponse.replace(terminator, '');
        if (this.bufferedResponse.slice(0, 5) === 'error') {
          const body = JSON.parse(this.bufferedResponse.slice(5));
          const err = new VNDBError(body.id, body.msg);
          reject(err);
        } else {
          resolve(this.bufferedResponse);
        }

        // Clean up event handler
        this.socket.removeListener('data', handleData);

        // And set bufferedResponse back to null to indicate that it's ready to write again.
        this.bufferedResponse = null;
      };
      this.socket.on('data', handleData);

      this.socket.write(`${message}${terminator}`);
    });
  }

  /**
   * Add message to client queues and execute it as soon as it can.
   * "Soon" here is when all preceding messages have been executed.
   */
  exec(message) {
    if (message && message.length > 0) {
      this.queues = this.queues.concat({
        message,
        promise: createDeferredPromise(),
      });
    }

    // Defer the exec if client is still busy or not initialized yet
    if (this.bufferedResponse !== null || !this.socket || this.socket.connecting) {
      const lastItem = this.queues[this.queues.length - 1];
      return lastItem ? lastItem.promise : Promise.resolve();
    }

    // Process the first item in client.queues if exist
    const next = this.queues[0];
    if (!next) return Promise.resolve();

    this.queues = this.queues.slice(1);
    this.write(next.message)
      .then((resp) => {
        next.promise.resolve(resp);
        this.exec();
      })
      .catch((err) => {
        next.promise.reject(err);
        this.exec();
      });

    return next.promise;
  }

  /**
   * Connect and login to VNDB API.
   */
  connect(username = null, password = null, config = {}) {
    if (this.socket) {
      throw new Error('client has already connected to VNDB API');
    }

    return new Promise((resolve, reject) => {
      const connectConfig = {
        host: config.host || this._defaults.host,
        port: config.port || this._defaults.port,
      };
      this.socket = tls.connect(connectConfig);

      // Setup login process, but don't login now
      const finalConfig = {
        protocol: config.protocol || this._defaults.protocol,
        client: config.client || this._defaults.client,
        clientver: config.clientver || this._defaults.clientver,
        username,
        password,
      };
      const loginBody = Object.keys(finalConfig)
        .filter(k => finalConfig[k])
        .reduce((result, k) => {
          return Object.assign({}, result, { [k]: finalConfig[k] });
        }, {});
      const loginMessage = `login ${JSON.stringify(loginBody)}`;
      const login = () => this.write(loginMessage)
        .then(resolve)
        .then(() => this.exec()) // If login is successful, dont forget to immediately exec
        .catch(reject);

      // Once tls connects successfully, immediately login to the API
      this.socket
        .once('connect', login)
        .once('error', reject);
    });
  }

  /**
   * End the client, mainly to just clean up the socket.
   */
  end() {
    return new Promise((resolve, reject) => {
      this.socket.end();

      this.socket
        .once('end', resolve)
        .once('error', reject);
    });
  }

  dbstats() {
    return this.exec('dbstats')
      .then((resp) => {
        const type = resp.split(' ')[0];
        return {
          type,
          data: JSON.parse(resp.slice(type.length + 1)),
        };
      });
  }

  get(type, flags = [], filters = '', options = {}) {
    throw new Error('not yet implemented');
  }

  vn(flags = [], filters = '', options = {}) {
    throw new Error('not yet implemented');
  }

  release(flags = [], filters = '', options = {}) {
    throw new Error('not yet implemented');
  }

  producer(flags = [], filters = '', options = {}) {
    throw new Error('not yet implemented');
  }

  character(flags = [], filters = '', options = {}) {
    throw new Error('not yet implemented');
  }

  user(flags = [], filters = '', options = {}) {
    throw new Error('not yet implemented');
  }

  votelist(flags = [], filters = '', options = {}) {
    throw new Error('not yet implemented');
  }

  vnlist(flags = [], filters = '', options = {}) {
    throw new Error('not yet implemented');
  }

  wishlist(flags = [], filters = '', options = {}) {
    throw new Error('not yet implemented');
  }
}

module.exports = VNDBClient;

