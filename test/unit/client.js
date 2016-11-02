const { expect } = require('chai');
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
  });
});

