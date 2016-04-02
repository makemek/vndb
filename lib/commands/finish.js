'use strict';

module.exports = function() {
  return new Promise((resolve, reject) => {
    this.emit('queue', 'finish', null, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};
