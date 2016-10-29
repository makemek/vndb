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
      it('should be configured with default config merged with the argument', () => {
        const overrideConfig = {
          server: {
            host: 'test.org',
          },
        };
        const client = new VNDBClient(overrideConfig);

        expect(client.config).to.deep.equal(Object.assign({}, defaultConfig, overrideConfig));
      });
    });
  });
});

