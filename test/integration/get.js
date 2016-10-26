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

    describe('results', () => {
      it('should limit the results count', function* () {
        const schema = {
          data: {
            num: 13,
            items: joi.array().length(13),
          },
        };

        const data1 = yield this.client.vn({ results: 13 });
        const result1 = joi.validate(data1, schema, { allowUnknown: true });
        expect(result1.error).to.equal(null);
      });
    });

    describe('page', () => {
      it('should paginate the results', function* () {
        const firstTen = (yield this.client.vn({ results: 10, page: 1 })).data.items;
        const inFirstTen = (item) => firstTen.find(i => i.id === item.id);

        const firstSix = (yield this.client.vn({ results: 6, page: 1 })).data.items;
        expect(firstSix.filter(inFirstTen).length).to.equal(6);

        const secondSix = (yield this.client.vn({ results: 6, page: 2 })).data.items;
        expect(secondSix.filter(inFirstTen).length).to.equal(4);
      });
    });

    describe('sort', () => {
      it('should sort the results', function* () {
        const sortedItems = (yield this.client.vn({
          sort: 'rating'
        })).data.items;

        const isHigherThanBefore = (item, idx) => idx > 0 ?
          sortedItems[idx - 1].rating <= sortedItems[idx].rating :
          true;

        expect(sortedItems.every(isHigherThanBefore)).to.equal(true);
      });
    });

    describe('reverse', () => {
      it('should sort the results in reverse', function* () {
        const sortedItems = (yield this.client.vn({
          sort: 'rating',
          reverse: true,
        })).data.items;

        const isLowerThanBefore = (item, idx) => idx > 0 ?
          sortedItems[idx - 1].rating >= sortedItems[idx].rating :
          true;

        expect(sortedItems.every(isLowerThanBefore)).to.equal(true);
      });

      describe.only('without sort', () => {
        it('should sort by default sort (id) descendingly', function* () {
          const sortedItems = (yield this.client.vn({
            reverse: true,
          })).data.items;

          const isLowerThanBefore = (item, idx) => idx > 0 ?
            sortedItems[idx - 1].id >= sortedItems[idx].id :
            true;

          expect(sortedItems.every(isLowerThanBefore)).to.equal(true);
        });
      });
    });
  });
});

