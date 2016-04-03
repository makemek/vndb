'use strict';
const net = require('net');
const commandify = require('./commandify');
const commands = require('../commands');
const config = require('../config');
const parse = require('./parse');

const terminator = '\u0004';

function _resetState() {
  this.removeAllListeners('data');
  this.isReady = true;
  this.emit('run');
}

function _handleFinishRequest(request) {
  this.once('end', () => request.callback(null));
  this.end();
}

function _handleApiRequest(request) {
  this.isReady = false;
  this.bufferedResponse = '';
  this.write(commandify(request.command, request.modifiers, request.body));
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

function create(overrideServer) {
  const serverConfig = Object.assign({}, config.DEFAULT_SERVER, overrideServer);
  const client = net.createConnection(serverConfig);

  client.isReady = false;
  client.queue = [];

  client.on('connect', () => {
    client.isReady = true;
    client.emit('run');
  });

  client.on('queue', (command, modifiers, body, callback) => {
    client.queue.push({ command, modifiers, body, callback });
    client.emit('run');
  });

  client.on('run', () => {
    if (client.isReady !== true) return;
    if (client.queue.length < 1) return;

    const request = client.queue.shift();
    if (request.command === 'finish') {
      _handleFinishRequest.call(client, request);
    } else {
      _handleApiRequest.call(client, request);
    }
  });

  client.on('error', () => {
    client.end();
  });

  Object.assign(client, commands);
  return client;
}

module.exports = {
  create,
};
