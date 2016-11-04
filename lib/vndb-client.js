/* eslint no-unused-vars: 0 */
/* eslint class-methods-use-this: 0 */
// TODO: Remove above rules if no stubs left anymore.
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
     * A client can only process one message at a time.
     * Any request to process a message while it's busy should be pushed into client.queue.
     * Queued messages are processed with FIFO strategy.
     */
    this.queues = [];

    /**
     * client.socket contains an instance of tls.TLSSocket.
     * It is set after the first connect.
     */
    this.socket = null;
  }

  write(message) {
    throw new Error('not yet implemented');
  }

  exec(message) {
    throw new Error('not yet implemented');
  }

  connect(username = null, password = null, config = {}) {
    throw new Error('not yet implemented');
  }

  end() {
    throw new Error('not yet implemented');
  }

  dbstats() {
    throw new Error('not yet implemented');
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

