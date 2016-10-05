const expect = require('chai').expect;
const vndb = require('../../index');

describe('Connection with vndb', () => {
  beforeEach(function() {
    this.client = vndb.createClient();
  });

  afterEach(function* () {
    yield this.client.finish();
  });

  describe('login command', () => {
    describe('without username nor password', () => {
      it('should return ok', function* () {
        const result = yield this.client.login();

        expect(result).to.have.property('type', 'ok');
      });
    });
  });

  describe('finish command', () => {
    it('should return ok', function* () {
      const spy = this.sandbox.spy(this.client, 'end');

      yield this.client.login();
      yield this.client.finish();

      expect(spy).to.have.been.called;
    });
  });
});

