const expect = require('chai').expect;
const Cell = require('../../model/cell');

describe('Test Model Cell', () => {
  it('getState should return state', () => {
    const cell = new Cell(1, '#ccc');
    expect(cell.getState()).to.be.eql(1);
  });
  it('getColor should return color', () => {
    const cell = new Cell(1, '#ccc');
    expect(cell.getColor()).to.be.eql('#ccc');
  });
  it('JSON.stringify should work', () => {
    const cell = new Cell(1, '#ccc');
    expect(JSON.stringify(cell)).to.be.eql('{"state":1,"color":"#ccc"}');
  });
});
