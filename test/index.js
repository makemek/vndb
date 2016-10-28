const chai = require('chai');
const chaiThings = require('chai-things');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
require('co-mocha');

before(function () {
  chai.use(sinonChai);
  chai.use(chaiThings);
});

beforeEach(function () {
  this.sandbox = sinon.sandbox.create();
});

afterEach(function () {
  this.sandbox.restore();
});

