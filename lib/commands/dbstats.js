'use strict';

function dbstats() {
  return this.execute('dbstats');
}

module.exports = dbstats;
