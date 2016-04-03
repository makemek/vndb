'use strict';

function finish() {
  return new Promise((resolve, reject) => {
    this.emit('queue', 'finish', null, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

module.exports = finish;
