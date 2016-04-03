'use strict';

function dbstats() {
  return new Promise((resolve, reject) => {
    this.emit('queue', 'dbstats', null, null, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

module.exports = dbstats;
