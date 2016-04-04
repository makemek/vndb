'use strict';

const commands = {};
commands.execute = require('./execute');
commands.login = require('./login');
commands.finish = require('./finish');
commands.dbstats = require('./dbstats');
commands.get = require('./get');

module.exports = commands;
