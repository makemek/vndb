const { expect } = require('chai');
const VNDBConstants = require('../../lib/constants');

describe('VNDB constants', () => {
  describe('Server constants', () => {
    it('should contain VNDB API host and port', () => {
      expect(VNDBConstants).to.have.deep.property('defaultConfig.host');
      expect(VNDBConstants).to.have.deep.property('defaultConfig.port');
    });

    it('should default to use TLS port', () => {
      expect(VNDBConstants).to.have.deep.property('defaultConfig.port', 19535);
    });
  });

  describe('Login constants', () => {
    it('should contain default login properties', () => {
      expect(VNDBConstants).to.have.deep.property('defaultConfig.protocol');
      expect(VNDBConstants).to.have.deep.property('defaultConfig.client');
      expect(VNDBConstants).to.have.deep.property('defaultConfig.clientver');
      expect(VNDBConstants).to.have.deep.property('defaultConfig.username');
      expect(VNDBConstants).to.have.deep.property('defaultConfig.password');
    });

    it('should not define truthy username and password', () => {
      expect(VNDBConstants.defaultConfig.username).to.not.exist;
      expect(VNDBConstants.defaultConfig.password).to.not.exist;
    });
  });
});

