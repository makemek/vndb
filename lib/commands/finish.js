'use strict';

function finish() {
  return new Promise((resolve, reject) => {
    this.execute('finish').then(resolve, reject);
  });
}

module.exports = finish;
