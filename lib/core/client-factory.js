const net = require('net');
const commands = require('../commands');
const config = require('../config');
const parse = require('./parse');

const finish = 'finish';
const terminator = '\u0004';

function _resetState() {
  this.removeAllListeners('data');
  this.isReady = true;
  this.emit('process');
}

function _handleFinishRequest(request) {
  if (this.isClosed) return request.callback(null);
  this.once('end', () => request.callback(null));
  this.end();
  this.isClosed = true;
}

function _handleApiRequest(request) {
  this.isReady = false;
  this.bufferedResponse = '';
  this.write(request.message);
  this.on('data', (rawResponse) => {
    this.bufferedResponse += rawResponse.toString('utf8');
    if (this.bufferedResponse[this.bufferedResponse.length - 1] !== terminator) return;

    const parsed = parse(this.bufferedResponse);
    if (parsed.type === 'error') {
      request.callback(parsed);
      _resetState.call(this);
    } else {
      request.callback(null, parsed);
      _resetState.call(this);
    }
  });
}

function _processRequest() {
  if (this.isReady !== true) return;
  if (this.queue.length < 1) return;

  const request = this.queue.shift();
  if (request.message === `${finish}${terminator}`) {
    _handleFinishRequest.call(this, request);
  } else {
    _handleApiRequest.call(this, request);
  }
}

function _handleUnexpectedError() {
  this.end();
}

function queueRequest(message = '', callback = () => {}) {
  this.queue.push({
    message: message + terminator,
    callback,
  });
  this.emit('process');
}

function create(overrideServer) {
  const serverConfig = Object.assign({}, config.DEFAULT_SERVER, overrideServer);
  const client = net.createConnection(serverConfig);

  client.isReady = false;
  client.isClosed = false;
  client.queue = [];

  // Attach internal event listeners
  client.on('connect', _resetState.bind(client));
  client.on('process', _processRequest.bind(client));
  client.on('error', _handleUnexpectedError.bind(client));

  // Attach public methods
  Object.assign(client, commands);
  client.queueRequest = queueRequest;

  return client;
}

module.exports = {
  create,
};
