'use strict';
const config = require('../config');

function login(overrideLogin) {
  const loginConfig = Object.assign({}, config.DEFAULT_LOGIN, overrideLogin);

  return new Promise((resolve, reject) => {
    this.emit('queue', 'login', null, loginConfig, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

module.exports = login;
