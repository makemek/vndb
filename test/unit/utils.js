const { createDeferredPromise } = require('../../lib/utils');
const { expect } = require('chai');

describe('Utils', () => {
  describe('.createDeferredPromise()', () => {
    it('should return a Promise with resolve and reject', function() {
      const promise = createDeferredPromise();
      expect(promise).to.be.an.instanceof(Promise);
      expect(promise.resolve).to.be.an.instanceof(Function);
      expect(promise.reject).to.be.an.instanceof(Function);
    });

    describe('when promise.resolve is called', () => {
      it('should resolve the promise', function(done) {
        const promise = createDeferredPromise();
        promise.resolve('something');
        expect(promise).to.eventually.equal('something')
          .and.notify(done);
      });
    });

    describe('when promise.reject is called', () => {
      it('should reject the promise', function(done) {
        const promise = createDeferredPromise();
        promise.reject('something else');
        expect(promise).to.eventually.rejectedWith('something else')
          .and.notify(done);
      });
    });
  });
});

