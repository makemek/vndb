'use strict';

const vndb = {};

// Default Configuration
vndb.config = require('./lib/config');

// Core functions
vndb.createClient = require('./lib/core/client-factory').create;

module.exports = vndb;
