const { expect } = require('chai');
const VNDBConstants = require('../../lib/vndb-constants');

describe('VNDB constants', () => {
  describe('Server constants', () => {
    it('should contain VNDB API host and port', () => {
      expect(VNDBConstants).to.have.deep.property('defaults.host');
      expect(VNDBConstants).to.have.deep.property('defaults.port');
    });

    it('should default to use TLS port', () => {
      expect(VNDBConstants).to.have.deep.property('defaults.port', 19535);
    });
  });

  describe('Login constants', () => {
    it('should contain default login properties', () => {
      expect(VNDBConstants).to.have.deep.property('defaults.protocol');
      expect(VNDBConstants).to.have.deep.property('defaults.client');
      expect(VNDBConstants).to.have.deep.property('defaults.clientver');
      expect(VNDBConstants).to.have.deep.property('defaults.username');
      expect(VNDBConstants).to.have.deep.property('defaults.password');
    });

    it('should not define truthy username and password', () => {
      expect(VNDBConstants.defaults.username).to.not.exist;
      expect(VNDBConstants.defaults.password).to.not.exist;
    });
  });

  describe('get parameter constants', () => {
    it('should contain default parameters for vn function', () => {
      expect(VNDBConstants).to.have.deep.property('defaults.vn.flags');
      expect(VNDBConstants).to.have.deep.property('defaults.vn.filters');
    });
  });

  describe('Other constants', () => {
    it('should have terminator', () => {
      expect(VNDBConstants).to.have.deep.property('terminator');
    });

    it('should contain list of allowed options', () => {
      expect(VNDBConstants).to.have.deep.property('allowedOptions');
    });
  });
});

