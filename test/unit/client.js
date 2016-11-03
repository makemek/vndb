const { expect } = require('chai');
const tls = require('tls');
const VNDBClient = require('../../lib/client');
const { defaults } = require('../../lib/constants');

describe('VNDBClient', () => {
  describe('constructor', () => {
    it('should set internal properties', () => {
      const client = new VNDBClient();

      expect(client._states).to.be.an('object');
      expect(client._defaults).to.deep.equal(defaults);
      expect(client.state).to.equal(client._states.new);
      expect(client.queues).to.be.an('array').that.is.empty;
    });

    describe.skip('without any argument', () => {
      it('should be configured with a copy of default values', () => {
        const client = new VNDBClient();

        expect(client.config).to.not.equal(defaults);
        expect(client.config).to.deep.equal(defaults);
      });
    });

    describe.skip('with 1 argument', () => {
      it('should be used to override default config', () => {
        const client = new VNDBClient({ host: 'test.org' });

        expect(client.config.host).to.equal('test.org');
      });
    });

    describe.skip('with more than 1 argument', () => {
      beforeEach(function() {
        this.client = new VNDBClient('testuser', 'testpassword', { host: 'test.org' });
      });

      it('should override the username using first argument', function() {
        expect(this.client.config.username).to.equal('testuser');
      });

      it('should override the password using second argument', function() {
        expect(this.client.config.password).to.equal('testpassword');
      });

      it('should override other configs using third argument', function() {
        expect(this.client.config.host).to.equal('test.org');
      });
    });

    it.skip('should call tls.connect and attach the function result to .socket', function() {
      this.sandbox.stub(tls, 'connect').returns('a socket');
      this.client = new VNDBClient();

      expect(this.client.socket).to.equal('a socket');
      expect(tls.connect).to.have.been.calledWith({
        host: defaults.host,
        port: defaults.port,
      });
    });
  });

  describe('.write(message)', () => {
    beforeEach(function() {
      this.client = new VNDBClient();
    });

    describe('when client state is new', () => {
      it('should throw an error', function() {
        this.client.state = this.client._states.new;
        this.client.write.bind(this.client, 'hello');

        expect(this.client.write).to.throw(Error);
      });
    });

    describe('when client state is idle', () => {
      beforeEach(function() {
        this.client.state = this.client._states.idle;
        this.client.write('hello');
      });

      it('should not queue the message', function() {
        expect(this.client.queues).not.to.contain('hello');
      });

      it('should set client state to busy', function() {
        expect(this.client.state).to.equal(this.client._states.busy);
      });
    });

    describe('when client state is busy', () => {
      it('should queue the message', function() {
        this.client.state = this.client._states.busy;
        this.client.write('hello');

        expect(this.client.queues).to.contain('hello');
      });
    });

    describe('when client state is not recognized', () => {
      it('should throw an error', function() {
        this.client.state = 'invalid';
        this.client.write.bind(this.client, 'hello');

        expect(this.client.write).to.throw(Error);
      });
    });
  });
});

