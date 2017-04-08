const expect = require('chai').expect;
const Util = require('../util');

describe('Test Util', () => {
  it('normalize should return correct index in normal case', () => {
    expect(Util.normalize(0, 0)).to.be.eql(0);
  });
  it('normalize should return the last i-th index if index is -i', () => {
    expect(Util.normalize(5, -1)).to.be.eql(4);
  });
  it('normalize should return the i-th item if the index exceeds length by i', () => {
    expect(Util.normalize(5, 6)).to.be.eql(1);
  });
  it('normalize should return the first item if the index is equal to length of array', () => {
    expect(Util.normalize(5, 5)).to.be.eql(0);
  });
  it('randomColor should return a number 16777216', () => {
    expect(Util.randomColor()).to.be.lt(16777216);
  });
});
