'use strict';

module.exports = function() {
  return new Promise((resolve, reject) => {
    this.emit('queue', 'dbstats', null, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};
