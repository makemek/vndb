const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const vndb = require('../../index.js');
require('co-mocha');

before(function* () {
  chai.use(sinonChai);
  this.client = vndb.createClient();
  yield this.client.login();
});

after(function* () {
  yield this.client.finish();
});

beforeEach(function* () {
  this.sandbox = sinon.sandbox.create();
});

afterEach(function* () {
  this.sandbox.restore();
});

