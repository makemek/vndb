const expect = require('chai').expect;
const joi = require('joi');
const vndb = require('../../index');

describe('Get commands', () => {
  beforeEach(function() {
    this.validateCommonSchema = (data) => {
      return joi.validate(data, {
        type: 'results',
        data: {
          more: joi.boolean().required(),
          num: joi.number().required(),
          items: joi.array().items({
            id: joi.number().required(),
          }),
        },
      }, { allowUnknown: true });
    };
  });

  describe('vn', () => {
    it('should have common get response schema', function* () {
      const data = yield this.client.vn();
      const result = this.validateCommonSchema(data);
      expect(result.error).to.equal(null);
    });
  });

  describe('release', () => {
    it('should have common get response schema', function* () {
      const data = yield this.client.release();
      const result = this.validateCommonSchema(data);
      expect(result.error).to.equal(null);
    });
  });

  describe('producer', () => {
    it('should have common get response schema', function* () {
      const data = yield this.client.producer();
      const result = this.validateCommonSchema(data);
      expect(result.error).to.equal(null);
    });
  });

  describe('character', () => {
    it('should have common get response schema', function* () {
      const data = yield this.client.character();
      const result = this.validateCommonSchema(data);
      expect(result.error).to.equal(null);
    });
  });

  describe('extra options', () => {
    describe('filters', () => {
      it('should filter the results based on filter expression', function* () {
        const data = yield this.client.vn({ filters: 'id = 8' });
        const result = joi.validate(data, {
          data: {
            more: false,
            num: 1,
            items: joi.array().items({
              id: 8,
            }),
          },
        }, { allowUnknown: true });

        expect(result.error).to.equal(null);
      });
    });

    describe('flags', () => {
      it('should limit the returned fields', function* () {
        const schema = {
          data: {
            items: joi.array().items({
              description: joi.string().required(),
            }),
          },
        };
        
        const data1 = yield this.client.vn();
        const result1 = joi.validate(data1, schema, { allowUnknown: true });
        expect(result1.error).to.equal(null);

        const data2 = yield this.client.vn({ flags: ['basic'] });
        const result2 = joi.validate(data2, schema, { allowUnknown: true });
        expect(result2.error).not.to.equal(null);
      });
    });
  });
});

