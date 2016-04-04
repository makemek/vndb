'use strict';
const config = require('../config');

function login(overrideLogin) {
  const loginConfig = Object.assign({}, config.DEFAULT_LOGIN, overrideLogin);
  const message = `login ${JSON.stringify(loginConfig)}`;

  return new Promise((resolve, reject) => {
    this.execute(message, resolve, reject);
  });
}

module.exports = login;
