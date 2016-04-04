'use strict';

function dbstats() {
  return new Promise((resolve, reject) => {
    this.execute('dbstats').then(resolve, reject);
  });
}

module.exports = dbstats;
