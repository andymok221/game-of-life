const expect = require('chai').expect;
const Cell = require('../../model/cell');

describe('Test Model Cell', () => {
  it('getState should return state', () => {
    const cell = new Cell(1, 543);
    expect(cell.getState()).to.be.eql(1);
  });
  it('getColor should return color', () => {
    const cell = new Cell(1, 543);
    expect(cell.getColor()).to.be.eql(543);
  });
  it('JSON.stringify should work', () => {
    const cell = new Cell(1, 543);
    expect(JSON.stringify(cell)).to.be.eql('{"state":1,"color":543}');
  });
});
