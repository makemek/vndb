const expect = require('chai').expect;
const vndb = require('../../index.js');

describe('Get commands', () => {
  before(function* () {
    this.client = vndb.createClient();
    yield this.client.login();

    this.validateCommonSchema = (data) => {
      expect(data).to.have.deep.property('type', 'results');
      expect(data).to.have.deep.property('data.more').that.is.a('boolean');
      expect(data).to.have.deep.property('data.num').that.is.a('number');
      expect(data).to.have.deep.property('data.items').that.all.have.property('id');
    };
  });

  after(function* () {
    yield this.client.finish();
  });

  describe('vn', () => {
    it('should have common get response schema', function* () {
      const data = yield this.client.vn();
      this.validateCommonSchema(data);
    });
  });

  describe('release', () => {
    it('should have common get response schema', function* () {
      const data = yield this.client.release();
      this.validateCommonSchema(data);
    });
  });

  describe('producer', () => {
    it('should have common get response schema', function* () {
      const data = yield this.client.producer();
      this.validateCommonSchema(data);
    });
  });

  describe('character', () => {
    it('should have common get response schema', function* () {
      const data = yield this.client.character();
      this.validateCommonSchema(data);
    });
  });

  describe('extra options', () => {
    describe('filters', () => {
      it('should filter the results based on filter expression', function* () {
        const data = yield this.client.vn({ filters: 'id = 8' });
        expect(data).to.have.deep.property('data.more', false);
        expect(data).to.have.deep.property('data.num', 1);
        expect(data).to.have.deep.property('data.items[0].id', 8);
      });
    });

    describe('flags', () => {
      it('should limit the returned fields', function* () {
        const data1 = yield this.client.vn();
        expect(data1).to.have.deep.property('data.items[0].description');

        const data2 = yield this.client.vn({ flags: ['basic'] });
        expect(data2).to.not.have.deep.property('data.items[0].description');
      });
    });

    describe('results', () => {
      it('should limit the results count', function* () {
        const data = yield this.client.vn({ results: 13 });
        expect(data).to.have.deep.property('data.num', 13);
        expect(data).to.have.deep.property('data.items').with.lengthOf(13);
      });
    });

    describe('page', () => {
      it('should paginate the results', function* () {
        const firstTen = (yield this.client.vn({ results: 10, page: 1 })).data.items;
        const inFirstTen = item => firstTen.find(i => i.id === item.id);

        const firstSix = (yield this.client.vn({ results: 6, page: 1 })).data.items;
        expect(firstSix.filter(inFirstTen).length).to.equal(6);

        const secondSix = (yield this.client.vn({ results: 6, page: 2 })).data.items;
        expect(secondSix.filter(inFirstTen).length).to.equal(4);
      });
    });

    describe('sort', () => {
      it('should sort the results', function* () {
        const sortedItems = (yield this.client.vn({
          sort: 'rating',
        })).data.items;

        const isHigherThanBefore = (item, idx) => {
          return idx > 0 ? sortedItems[idx - 1].rating <= sortedItems[idx].rating : true;
        };

        expect(sortedItems.every(isHigherThanBefore)).to.equal(true);
      });
    });

    describe('reverse', () => {
      it('should sort the results in reverse', function* () {
        const sortedItems = (yield this.client.vn({
          sort: 'rating',
          reverse: true,
        })).data.items;

        const isLowerThanBefore = (item, idx) => {
          return idx > 0 ? sortedItems[idx - 1].rating >= sortedItems[idx].rating : true;
        };

        expect(sortedItems.every(isLowerThanBefore)).to.equal(true);
      });

      describe('without sort', () => {
        it('should sort by default sort (id) descendingly', function* () {
          const sortedItems = (yield this.client.vn({
            reverse: true,
          })).data.items;

          const isLowerThanBefore = (item, idx) => {
            return idx > 0 ? sortedItems[idx - 1].id >= sortedItems[idx].id : true;
          };

          expect(sortedItems.every(isLowerThanBefore)).to.equal(true);
        });
      });
    });
  });
});

