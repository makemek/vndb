const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const vndb = require('../../index.js');
require('co-mocha');

before(function() {
  chai.use(sinonChai);
});

beforeEach(function() {
  this.sandbox = sinon.sandbox.create();
});

afterEach(function() {
  this.sandbox.restore();
});

