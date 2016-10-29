const { expect } = require('chai');
const VNDBConstants = require('../../lib/constants');

describe('VNDB constants', () => {
  describe('Server constants', () => {
    it('should contain VNDB API host and port', () => {
      expect(VNDBConstants).to.have.deep.property('defaultConfig.server.host');
      expect(VNDBConstants).to.have.deep.property('defaultConfig.server.port');
    });

    it('should default to use TLS port', () => {
      expect(VNDBConstants).to.have.deep.property('defaultConfig.server.port', 19535);
    });
  });

  describe('Login constants', () => {
    it('should contain default login properties', () => {
      expect(VNDBConstants).to.have.deep.property('defaultConfig.login.protocol');
      expect(VNDBConstants).to.have.deep.property('defaultConfig.login.client');
      expect(VNDBConstants).to.have.deep.property('defaultConfig.login.clientver');
      expect(VNDBConstants).to.have.deep.property('defaultConfig.login.username');
      expect(VNDBConstants).to.have.deep.property('defaultConfig.login.password');
    });

    it('should not define truthy username and password', () => {
      expect(VNDBConstants.defaultConfig.login.username).to.not.exist;
      expect(VNDBConstants.defaultConfig.login.password).to.not.exist;
    });
  });
});

