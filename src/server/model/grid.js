const winston = require('winston');
const Cell = require('./cell');
const State = require('../../enum/state');
const Util = require('../util');
const Config = require('../../config');

class Grid {
  /**
   * Constructor of Grid
   * @param {Number} width - Number of columns
   * @param {Number} height - Number of rows
   */
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.cells = [];
    for (let y = 0; y < height; y++) { // iterate through rows
      this.cells[y] = [];
      for (let x = 0; x < width; x++) { // iterate through columns
        this.cells[y][x] = new Cell(State.DEAD);
      }
    }
  }

  /**
   * Return cells
   * @return {Object} - the cells
   */
  getCells() {
    return this.cells;
  }

  /**
   * add new pattern to the game
   * @param {String} type - the type of pattern
   * @param {Number} color
   */
  addNewPatten(type, color) {
    // select a position randomly for placing our new pattern
    const x = Math.floor(Math.random() * this.width);
    const y = Math.floor(Math.random() * this.height);
    const normalizeX = Util.normalize.bind(null, this.width);
    const normalizeY = Util.normalize.bind(null, this.height);
    switch (type) {
      case 'glider':
        this.cells[normalizeY(y)][normalizeX(x + 1)] = new Cell(State.ALIVE, color);
        this.cells[normalizeY(y + 1)][normalizeX(x + 2)] = new Cell(State.ALIVE, color);
        this.cells[normalizeY(y + 2)][normalizeX(x)] = new Cell(State.ALIVE, color);
        this.cells[normalizeY(y + 2)][normalizeX(x + 1)] = new Cell(State.ALIVE, color);
        this.cells[normalizeY(y + 2)][normalizeX(x + 2)] = new Cell(State.ALIVE, color);
        break;
      case 'beacon':
        this.cells[normalizeY(y)][normalizeX(x)] = new Cell(State.ALIVE, color);
        this.cells[normalizeY(y)][normalizeX(x + 1)] = new Cell(State.ALIVE, color);
        this.cells[normalizeY(y + 1)][normalizeX(x)] = new Cell(State.ALIVE, color);
        this.cells[normalizeY(y + 1)][normalizeX(x + 1)] = new Cell(State.ALIVE, color);
        this.cells[normalizeY(y + 2)][normalizeX(x + 2)] = new Cell(State.ALIVE, color);
        this.cells[normalizeY(y + 2)][normalizeX(x + 3)] = new Cell(State.ALIVE, color);
        this.cells[normalizeY(y + 3)][normalizeX(x + 2)] = new Cell(State.ALIVE, color);
        this.cells[normalizeY(y + 3)][normalizeX(x + 3)] = new Cell(State.ALIVE, color);
        break;
      case 'tub':
        this.cells[normalizeY(y)][normalizeX(x + 1)] = new Cell(State.ALIVE, color);
        this.cells[normalizeY(y + 1)][normalizeX(x)] = new Cell(State.ALIVE, color);
        this.cells[normalizeY(y + 1)][normalizeX(x + 2)] = new Cell(State.ALIVE, color);
        this.cells[normalizeY(y + 2)][normalizeX(x + 1)] = new Cell(State.ALIVE, color);
        break;
      case 'diehard':
        this.cells[normalizeY(y)][normalizeX(x + 6)] = new Cell(State.ALIVE, color);
        this.cells[normalizeY(y + 1)][normalizeX(x)] = new Cell(State.ALIVE, color);
        this.cells[normalizeY(y + 1)][normalizeX(x + 1)] = new Cell(State.ALIVE, color);
        this.cells[normalizeY(y + 2)][normalizeX(x + 1)] = new Cell(State.ALIVE, color);
        this.cells[normalizeY(y + 2)][normalizeX(x + 5)] = new Cell(State.ALIVE, color);
        this.cells[normalizeY(y + 2)][normalizeX(x + 6)] = new Cell(State.ALIVE, color);
        this.cells[normalizeY(y + 2)][normalizeX(x + 7)] = new Cell(State.ALIVE, color);
        break;
      default:
        winston.error(`Invalid pattern: ${type}`);
        break;
    }
  }

  /**
   * Count the number of neighbour alive cells and also the color if reproduction rule applies
   * @param {Number} x - Column of cell
   * @param {Number} y - Row of Cell
   * @return {{avgColor: Number, aliveCount: Number}}  - total number of cells and average color of the alive cells
   */
  countNeighbourAliveCells(x, y) {
    let aliveCount = 0;
    let colorSum = 0;
    for (let scanY = -1; scanY <= 1; scanY++) {
      for (let scanX = -1; scanX <= 1; scanX++) {
        const neighbourX = Util.normalize(this.width, scanX + x);
        const neighbourY = Util.normalize(this.height, scanY + y);
        if (scanX !== 0 || scanY !== 0) { // center position is itself
          const neighbourCell = this.cells[neighbourY][neighbourX];
          if (neighbourCell.getState() === State.ALIVE) {
            aliveCount++;
            colorSum += neighbourCell.getColor();
          }
        }
      }
    }
    return {
      avgColor: Math.floor(colorSum / aliveCount),
      aliveCount
    };
  }

  /**
   * When user click on a cell from client side
   * @param {Number} x - Column of cell
   * @param {Number} y - Row of Cell
   * @param {String} color - Color of Cell
   * @return {Boolean}
   */
  updateCell(x, y, color) {
    // avoid user to send fake event of incorrect coordinates
    if (!this.cells[y] || !this.cells[y][x]) return false;
    // no effect on alive cell
    if (this.cells[y][x].getState()) return false;
    this.cells[y][x] = new Cell(State.ALIVE, color);
    return true;
  }

  /**
   * Compute the next generation of game
   */
  generateNextGrid() {
    let newCells = [];
    for (let y = 0; y < this.height; y++) { // iterate through rows
      newCells[y] = [];
      for (let x = 0; x < this.width; x++) { // iterate through columns
        const result = this.countNeighbourAliveCells(x, y);
        const { aliveCount, avgColor } = result;
        newCells[y][x] = new Cell(State.DEAD);
        const cellState = this.cells[y][x].getState();
        switch (cellState) {
          case State.ALIVE:
            if ((aliveCount >= Config.UNDER_POPULATION_THRESHOLD) &&
              (aliveCount <= Config.OVERCROWDING_THRESHOLD)) {
              newCells[y][x] = this.cells[y][x];
            }
            break;
          case State.DEAD:
            if (aliveCount === Config.REPRODUCTION_LIMIT) {
              newCells[y][x] = new Cell(State.ALIVE, avgColor);
            }
            break;
          default:
            winston.error(`Invalid cell state: ${cellState}`);
            break;
        }
      }
    }
    this.cells = newCells;
  }
}

module.exports = Grid;
