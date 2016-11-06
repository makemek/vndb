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

afterEach(function (done) {
  // TODO: Remove setTimeout here.
  //
  // For some reasons, mocha is sometimes green, sometimes not.
  // Usually if I test using splitted tmux screen, it's green. If full, it's read.
  // Like what
  //
  // My hunch is because I'm messing with setTimeout here and in the tests
  setTimeout(() => {
    this.sandbox.verifyAndRestore();
    done();
  });
});

