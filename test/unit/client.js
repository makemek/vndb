const { expect } = require('chai');
const tls = require('tls');
const VNDBClient = require('../../lib/client');
const { defaultConfig } = require('../../lib/constants');

describe('VNDBClient', () => {
  describe('constructor', () => {
    describe('without any argument', () => {
      it('should be configured with a copy of default values', () => {
        const client = new VNDBClient();

        expect(client.config).to.not.equal(defaultConfig);
        expect(client.config).to.deep.equal(defaultConfig);
      });
    });

    describe('with 1 argument', () => {
      it('should be used to override default config', () => {
        const client = new VNDBClient({ host: 'test.org' });

        expect(client.config.host).to.equal('test.org');
      });
    });

    describe('with more than 1 argument', () => {
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

    it('should call tls.connect and attach the function result to .socket', function() {
      this.sandbox.stub(tls, 'connect').returns('a socket');
      this.client = new VNDBClient();

      expect(this.client.socket).to.equal('a socket');
      expect(tls.connect).to.have.been.calledWith({
        host: defaultConfig.host,
        port: defaultConfig.port,
      });
    });
  });
});

