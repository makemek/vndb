const { expect } = require('chai');
const EventEmitter = require('events');
const tls = require('tls');
const VNDBClient = require('../../lib/vndb-client');
const VNDBError = require('../../lib/vndb-error');
const { defaults, terminator } = require('../../lib/constants');
const utils = require('../../lib/utils');

describe('VNDBClient', () => {
  beforeEach(function() {
    this.client = new VNDBClient();
  });

  describe('constructor', () => {
    it('should set default values from constants file', function() {
      expect(this.client._defaults).to.deep.equal(defaults);
    });

    it('should initialize an empty queue', function() {
      expect(this.client.queues).to.be.an('array').that.is.empty;
    });

    it('should initialize an empty socket', function() {
      expect(this.client.socket).not.to.exist;
    });

    it('should initialize a null bufferedResponse', function() {
      expect(this.client.bufferedResponse).to.equal(null);
    });
  });

  describe('.write(message)', () => {
    describe('when client.socket is not initialized yet', () => {
      it('should throw an error', function() {
        this.client.socket = null;

        expect(this.client.write.bind(this.client, 'a message'))
          .to.throw(Error);
      });
    });

    describe('when client.bufferedResponse is not null', () => {
      it('should throw an error', function() {
        this.client.socket = new EventEmitter();
        this.client.bufferedResponse = 'in-progre';

        expect(this.client.write.bind(this.client, 'a message'))
          .to.throw(Error);
      });
    });

    beforeEach(function() {
      this.client.socket = new EventEmitter();
      this.client.socket.write = this.sandbox.stub();
      this.promise = this.client.write('a message');
    });

    it('should call client.socket.write with same arg + terminator', function() {
      expect(this.client.socket.write).to.have.been.calledWith(`a message${terminator}`);
    });

    it('should set client.bufferedResponse to an empty string', function() {
      expect(this.client.bufferedResponse).to.equal('');
    });

    it('should register a handler to "data" event', function() {
      expect(this.client.socket.listeners('data')).to.have.lengthOf(1);
    });

    describe('on handling "data" event', () => {
      describe('when receiving a response that does not end with terminator character', () => {
        it('should save the response in client.bufferedResponse in utf8 format', function() {
          this.client.bufferedResponse = 'waiting for ';
          this.client.socket.emit('data', Buffer.from('an unfinished response'));
          expect(this.client.bufferedResponse).to.equal('waiting for an unfinished response');
        });
      });

      describe('when receiving a response that ends with terminator character', () => {
        function testCommonBehavior() {
          it('should set client.bufferedResponse back to null', function() {
            expect(this.client.bufferedResponse).to.equal(null);
          });

          it('should deregister the "data" event handler', function() {
            expect(this.client.socket.listeners('data')).to.be.empty;
          });
        }

        describe('and the final response does not begin with "error"', () => {
          beforeEach(function() {
            this.client.bufferedResponse = 'waiting for ';
            this.client.socket.emit('data', Buffer.from(`nothing${terminator}`));
          });

          testCommonBehavior();

          it('should resolve final response as utf8 string without the terminator', function(done) {
            expect(this.promise).to.eventually.equal('waiting for nothing')
              .and.notify(done);
          });
        });

        describe('and the final response begins with "error"', () => {
          beforeEach(function() {
            this.client.bufferedResponse = 'error {"id": "parse", "msg": "parse er';
            this.client.socket.emit('data', Buffer.from(`ror"}${terminator}`));
          });

          testCommonBehavior();

          it('should rejects the final response as a VNDBError obejct', function(done) {
            expect(this.promise).to.eventually.rejectedWith(VNDBError, 'parse error')
              .and.notify(done);
          });
        });
      });
    });
  });

  describe('.exec', function() {
    beforeEach(function() {
      this.bufferedResponse = null;
      this.client.write = this.sandbox.stub().returns(new Promise(() => {}));
    });

    // A helper to generate this.client.queues randomly,
    // since it expects its items in certain structure.
    const generateQueue = (count = 1) => {
      return Array(count).fill().map((_, i) => {
        return {
          message: `Message ${i}`,
          promise: utils.createDeferredPromise(),
        };
      });
    };

    describe('()', () => {
      describe('when client queues is empty', () => {
        beforeEach(function() {
          this.client.queues = generateQueue(0);
        });

        it('should resolve undefined', function(done) {
          const result = this.client.exec();
          expect(result).to.eventually.equal(undefined)
            .and.notify(done);
        });

        it('should not call .write', function() {
          this.client.exec();
          expect(this.client.write).not.to.have.been.called;
        });
      });

      describe('when client queues is not empty', () => {
        beforeEach(function() {
          this.client.queues = generateQueue(1);
          this.itemToExec = this.client.queues[0];
        });

        it('should return the first item promise in client queues', function() {
          const result = this.client.exec();
          expect(result).to.equal(this.itemToExec.promise);
        });

        it('should call .write', function() {
          this.client.exec();
          expect(this.client.write).to.have.been.called;
        });
      });
    });

    describe('(message)', () => {
      it('should call .write', function() {
        this.client.exec('a message');
        expect(this.client.write).to.have.been.called;
      });

      describe('when client queues is not empty', () => {
        beforeEach(function() {
          this.client.queues = generateQueue(2);
          this.itemToExec = this.client.queues[0];
        });

        it('should queue the message into the last of client queues', function() {
          this.client.exec('a message');
          expect(this.client.queues[this.client.queues.length - 1]).to.have.property('message', 'a message');
        });

        it('should not call .write with the provided message', function() {
          this.client.exec('a message');
          expect(this.client.write).not.to.have.been.calledWith('a message');
        });

        it('should call .write with the first item message in queue', function() {
          this.client.exec('a message');
          expect(this.client.write).to.have.been.calledWith(this.itemToExec.message);
        });

        it('should return the first item promise in client queues', function() {
          const result = this.client.exec();
          expect(result).to.equal(this.itemToExec.promise);
        });
      });
    });

    describe('all args', () => {
      beforeEach(function() {
        this.client.queues = generateQueue(1);
        this.itemToExec = this.client.queues[0];
      });

      describe('on executing message', () => {
        describe('when client is idle', () => {
          beforeEach(function() {
            this.client.bufferedResponse = null;
          });

          it('should remove the first item in client queues', function() {
            this.client.exec();
            expect(this.client.queues)
              .not.to.contain.an.item.with.property('message', this.itemToExec.message);
          });

          it('should execute the first item message in client queues', function() {
            this.client.exec();
            expect(this.client.write).to.have.been.calledWith(this.itemToExec.message);
          });
        });

        describe('when client is busy', () => {
          beforeEach(function() {
            this.client.bufferedResponse = 'pending';
          });

          it('should not remove the first item in client queues', function() {
            this.client.exec();
            expect(this.client.queues)
              .to.contain.an.item.with.property('message', this.itemToExec.message);
          });

          it('should not wite any message', function() {
            this.client.exec();
            expect(this.client.write).not.to.have.been.called;
          });
        });
      });

      describe('on handling client.write fulfillment', () => {
        describe('on client.write promise resolved', () => {
          beforeEach(function() {
            this.client.write.resolves('write result');
          });

          it('should pipe the result into the processed item\'s promise.resolve', function(done) {
            this.client.exec();
            expect(this.itemToExec.promise).to.eventually.equal('write result')
              .and.notify(done);
          });

          it('should call itself to process next message', function() {
            this.sandbox.spy(this.client, 'exec');
            this.client.exec().then(() => {
              expect(this.client.exec).to.have.been.calledTwice;
            });
          });
        });

        describe('on client.write promise rejected', () => {
          beforeEach(function() {
            this.client.write.rejects('something wrong');
          });

          it('should pipe the result into the processed item\'s promise.reject', function(done) {
            const promise = this.client.exec();
            expect(promise).to.eventually.rejectedWith('something wrong')
              .and.notify(done);
          });

          it('should call itself to process next message', function() {
            this.sandbox.spy(this.client, 'exec');
            this.client.exec().catch(() => {
              expect(this.client.exec).to.have.been.calledTwice;
            });
          });
        });
      });
    });
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

