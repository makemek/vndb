const config = require('../config');

function login(overrideLogin) {
  const loginConfig = Object.assign({}, config.DEFAULT_LOGIN, overrideLogin);
  const message = `login ${JSON.stringify(loginConfig)}`;
  return this.execute(message);
}

module.exports = login;
