const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiThings = require('chai-things');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
require('co-mocha');
require('sinon-as-promised');

before(function () {
  chai.use(sinonChai);
  chai.use(chaiAsPromised);
  chai.use(chaiThings);
});

beforeEach(function () {
  this.sandbox = sinon.sandbox.create();
});

afterEach(function () {
  this.sandbox.restore();
});

