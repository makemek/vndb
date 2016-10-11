const expect = require('chai').expect;
const vndb = require('../../index');

describe('Connection commands', () => {
  beforeEach(function() {
    this.testedClient = vndb.createClient();
  });

  afterEach(function* () {
    yield this.testedClient.finish();
  });

  describe('login', () => {
    describe('without username nor password', () => {
      it('should return ok', function* () {
        const result = yield this.testedClient.login();

        expect(result).to.have.property('type', 'ok');
      });
    });
  });

  describe('finish', () => {
    it('should return ok', function* () {
      const spy = this.sandbox.spy(this.testedClient, 'end');

      yield this.testedClient.login();
      yield this.testedClient.finish();

      expect(spy).to.have.been.called;
    });
  });
});

