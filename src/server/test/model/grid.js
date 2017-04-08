const expect = require('chai').expect;
const Grid = require('../../model/grid');
const Cell = require('../../model/cell');
const State = require('../../../enum/state');

describe('Test Model Grid', () => {
  it('updateCell should set the corresponding cell', () => {
    const grid = new Grid(1, 1);
    grid.updateCell(0, 0, 0);
    expect(grid.cells[0][0].getColor()).to.be.eql(0);
    expect(grid.cells[0][0].getState()).to.be.eql(State.ALIVE);
  });
  it('updateCell should not set on an alive cell', () => {
    const grid = new Grid(1, 1);
    grid.updateCell(0, 0, 0);
    grid.updateCell(0, 0, '#ddd');
    expect(grid.cells[0][0].getColor()).to.be.eql(0);
    expect(grid.cells[0][0].getState()).to.be.eql(State.ALIVE);
  });
  it('countNeighbourAliveCells should return correct number', () => {
    const grid = new Grid(3, 3);
    grid.cells = [
      [new Cell(State.ALIVE, 0), new Cell(State.ALIVE, 0), new Cell(State.DEAD, 0)],
      [new Cell(State.ALIVE, 0), new Cell(State.ALIVE, 0), new Cell(State.DEAD, 0)],
      [new Cell(State.DEAD, 0), new Cell(State.DEAD, 0), new Cell(State.DEAD, 0)]
    ];
    expect(grid.countNeighbourAliveCells(0, 0).aliveCount).to.be.eql(3);
    expect(grid.countNeighbourAliveCells(0, 1).aliveCount).to.be.eql(3);
    expect(grid.countNeighbourAliveCells(1, 0).aliveCount).to.be.eql(3);
    expect(grid.countNeighbourAliveCells(1, 1).aliveCount).to.be.eql(3);
  });
  it('countNeighbourAliveCells should work in `continuous` way', () => {
    const grid = new Grid(3, 3);
    grid.cells = [
      [new Cell(State.ALIVE, 0), new Cell(State.DEAD, 0), new Cell(State.ALIVE, 0)],
      [new Cell(State.DEAD, 0), new Cell(State.DEAD, 0), new Cell(State.DEAD, 0)],
      [new Cell(State.DEAD, 0), new Cell(State.DEAD, 0), new Cell(State.DEAD, 0)]
    ];
    expect(grid.countNeighbourAliveCells(0, 0).aliveCount).to.be.eql(1);
  });
  it('countNeighbourAliveCells should return correct average color', () => {
    const grid = new Grid(3, 3);
    const color1 = 100;
    const color2 = 200;
    grid.cells = [
      [new Cell(State.ALIVE, 0), new Cell(State.ALIVE, color1), new Cell(State.ALIVE, color2)],
      [new Cell(State.DEAD, 0), new Cell(State.DEAD, 0), new Cell(State.DEAD, 0)],
      [new Cell(State.DEAD, 0), new Cell(State.DEAD, 0), new Cell(State.DEAD, 0)]
    ];
    expect(grid.countNeighbourAliveCells(0, 0).avgColor).to.be.eql((color1 + color2) / 2);
  });
  it('test still pattern', () => {
    const grid = new Grid(5, 5);
    grid.updateCell(1, 0, 0); // x:1, y:0
    grid.updateCell(1, 1, '#ddd'); // x:1, y:1
    grid.updateCell(1, 2, '#ddd'); // x:1, y:2
    grid.generateNextGrid();
    expect(grid.cells[1][0].getState()).to.be.eql(State.ALIVE); // x:0, y:1
    expect(grid.cells[1][1].getState()).to.be.eql(State.ALIVE); // x:1, y:1
    expect(grid.cells[1][2].getState()).to.be.eql(State.ALIVE); // x:2, y:1
  });
});
