'use strict';

const commands = {};
commands.dbstats = require('./dbstats');
commands.login = require('./login');
commands.finish = require('./finish');

module.exports = commands;
