const { expect } = require('chai');
const tls = require('tls');
const VNDBClient = require('../../lib/vndb-client');
const { defaults } = require('../../lib/constants');

describe('VNDBClient', () => {
  describe('constructor', () => {
    beforeEach(() => {
      this.client = new VNDBClient();
    });

    it('should set default values from constants file', () => {
      expect(this.client._defaults).to.deep.equal(defaults);
    });

    it('should initialize an empty queue', () => {
      expect(this.client.queues).to.be.an('array').that.is.empty;
    });

    it('should initialize an empty socket', () => {
      expect(this.client.socket).not.to.exist;
    });
  });

  describe('.write(message)', () => {
  });

  describe('.exec(message)', () => {
  });

  describe('.connect', () => {
    describe('()', () => {
    });

    describe('(username, password, config)', () => {
    });
  });

  describe('.end()', () => {
  });

  describe('.dbstats()', () => {
  });

  describe('.get', () => {
    describe('(type)', () => {
    });

    describe('(type, flags, filters, options)', () => {
    });
  });

  describe('.vn', () => {
    describe('()', () => {
    });

    describe('(flags, filters, options)', () => {
    });
  });

  describe('.release', () => {
    describe('()', () => {
    });

    describe('(flags, filters, options)', () => {
    });
  });

  describe('.producer', () => {
    describe('()', () => {
    });

    describe('(flags, filters, options)', () => {
    });
  });

  describe('.character', () => {
    describe('()', () => {
    });

    describe('(flags, filters, options)', () => {
    });
  });

  describe('.user', () => {
    describe('()', () => {
    });

    describe('(flags, filters, options)', () => {
    });
  });

  describe('.votelist', () => {
    describe('()', () => {
    });

    describe('(flags, filters, options)', () => {
    });
  });

  describe('.vnlist', () => {
    describe('()', () => {
    });

    describe('(flags, filters, options)', () => {
    });
  });

  describe('.wishlist', () => {
    describe('()', () => {
    });

    describe('(flags, filters, options)', () => {
    });
  });

  describe.skip('.process(message)', () => {
    beforeEach(function() {
      this.client = new VNDBClient();
    });

    describe('when client state is new', () => {
      it('should rejects an error', function (done) {
        this.client.state = this.client._states.new;

        const promise = this.client.process('hello');

        expect(promise).to.eventually.be.rejectedWith(Error)
          .and.notify(done);
      });
    });

    describe('when client state is idle', () => {
      beforeEach(function() {
        this.client.write = this.sandbox.stub().resolves('resolved');
        this.client.state = this.client._states.idle;
        this.promise = this.client.process('hello');
      });

      it('should not queue the message', function() {
        expect(this.client.queues).not.to.contain.an.item.that.deep.equals({
          message: 'hello',
        });
      });

      it('should set client state to busy', function() {
        expect(this.client.state).to.equal(this.client._states.busy);
      });

      it('should call client.write with same argument', function() {
        expect(this.client.write).to.have.been.calledWith('hello');
      });

      describe('and client.write is resolved', () => {
        it('should resolve the same value', function (done) {
          expect(this.promise).to.eventually.equal('resolved')
            .and.notify(done);
        });
      });

      describe('and client.write is rejected', () => {
        it('should resolve the same value', function(done) {
          this.client.write = this.sandbox.stub().rejects('rejected');
          this.client.state = this.client._states.idle;

          const promise = this.client.process('hello');

          expect(promise).to.eventually.rejectedWith('rejected')
            .and.notify(done);
        });
      });
    });

    describe('when client state is busy', () => {
      it('should queue the message, resolve, and reject function', function() {
        this.client.state = this.client._states.busy;
        this.client.process('hello');

        expect(this.client.queues[0]).to.contain.keys('resolve', 'reject')
          .and.have.property('message', 'hello');
      });
    });

    describe('when client state is not recognized', () => {
      it('should throw an error', function(done) {
        this.client.state = 'invalid';

        const promise = this.client.process('hello');

        expect(promise).to.eventually.be.rejectedWith(Error)
          .and.notify(done);
      });
    });
  });
});

