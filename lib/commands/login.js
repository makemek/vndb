'use strict';
const config = require('../config');

module.exports = function(overrideLogin) {
  const loginConfig = Object.assign({}, config.DEFAULT_LOGIN, overrideLogin);

  return new Promise((resolve, reject) => {
    this.emit('queue', 'login', loginConfig, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};
