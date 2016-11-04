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

  // When we expected a promise to be rejected,
  // but we don't really care to handle the rejection,
  // Call this function to prevent unwanted warning from popping up.
  // Use this sparingly.
  this.handleRejectedPromise = promise => promise.catch(e => e);
});

afterEach(function () {
  this.sandbox.restore();
});

