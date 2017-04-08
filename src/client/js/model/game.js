import State from '../../../enum/state';
import Action from '../../../enum/action';
import { integerToHexColor } from '../util';

const BORDER_COLOR = '#ccc';

class Game {
  constructor(gridSize, primus, canvas, elm) {
    this.state = 'NOT_CONNECTED';
    this.primus = primus;
    this.canvas = canvas;
    this.gridSize = gridSize;
    this.elm = elm;
    this.canvas.addEventListener('click', this.click.bind(this));
    this.elm.patters.addEventListener('click', this.addPattern.bind(this));
  }

  /**
   * Get connection state
   * @return {String} - the connection state
   */
  getState() {
    return this.state;
  }

  /**
   * Get color
   * @return {Number} - the color
   */
  getColor() {
    return this.color;
  }

  /**
   * Set connection state
   * @param {String} value - the the connection state
   * @return {String} - the the connection state
   */
  setState(value) {
    this.state = value;
    return this.state;
  }

  /**
   * The click handler of canvas
   * @param {Object} e - the event object
   */
  click(e) {
    const coordX = e.pageX - this.canvas.offsetLeft;
    const coordY = e.pageY - this.canvas.offsetTop;
    this.getCorrespondingCell(coordX, coordY);
  }

  /**
   * The click handler of pattern
   * @param {Object} e - the event object
   */
  addPattern(e) {
    if (e.target.id) {
      this.primus.write({
        action: Action.ADD_PATTERN,
        data: {
          color: this.getColor(),
          type: e.target.id
        }
      });
    }
  }

  /**
   * Handle some UI updates
   * @param {String} field
   * @param {String} value
   */
  handleUIUpdate(field, value) {
    switch (field) {
      case 'color':
        this.elm.colorGrid.style.background = `#${integerToHexColor(value)}`;
        break;
      case 'network':
        this.elm.network.innerHTML = value;
        break;
      case 'generation':
        this.elm.generation.innerHTML = value;
        break;
      case 'players':
        this.elm.players.innerHTML = value;
        break;
      default:
        break;
    }
  }

  /**
   * Handle events from server side
   * @param {Object} event
   */
  handleEvent(event) {
    switch (event.action) {
      case Action.UPDATE_PLAYERS:
        this.handleUIUpdate('players', event.data.players);
        break;
      case Action.JOIN_GAME_SUCCESS:
        this.width = event.data.cells.length;
        this.height = event.data.cells[0].length;
        this.cells = event.data.cells;
        this.color = event.data.color;
        this.identifier = event.data.identifier;
        this.draw();
        this.setState('CONNECTED');
        this.handleUIUpdate('network', 'CONNECTED');
        this.handleUIUpdate('color', this.color);
        this.handleUIUpdate('generation', event.data.generation);
        break;
      case Action.REJOIN_GAME_SUCCESS:
      case Action.NEW_GAME_STATE:
        this.cells = event.data.cells;
        this.handleUIUpdate('generation', event.data.generation);
        this.draw();
        break;
      default:
        break;
    }
  }

  /**
   * Translate the coordinate to actual cell position
   * @param {Number} coordX
   * @param {Number} coordY
   * @return {{x: Number, y: Number}}
   */
  getCorrespondingCell(coordX, coordY) {
    // coordinate -1 for border adjustment
    let x = Math.floor((coordX - 1) / this.gridSize);
    let y = Math.floor((coordY - 1) / this.gridSize);
    // if clicking at edge(topmost/leftmost), it will become -1
    x = x < 0 ? 0 : x;
    y = y < 0 ? 0 : y;
    this.primus.write({
      action: Action.CLICK_CELL,
      data: {
        identifier: this.identifier,
        x: x,
        y: y
      }
    });
    // send to server
  }

  /**
   * Draw the borders
   */
  drawBorders() {
    // draw the borders
    const context = this.canvas.getContext('2d');
    for (let x = 0; x <= this.canvas.width; x += this.gridSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, this.canvas.height);
      context.strokeStyle = BORDER_COLOR;
      context.stroke();
    }
    for (let y = 0; y <= this.canvas.height; y += this.gridSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(this.canvas.width, y);
      context.strokeStyle = BORDER_COLOR;
      context.stroke();
    }
  }

  /**
   * Draw the cells
   */
  drawCells() {
    const context = this.canvas.getContext('2d');
    let posX = 1;
    let posY = 1;
    for (let y = 0; y < this.width; y++) {
      for (let x = 0; x < this.height; x++) {
        if (this.cells[y][x].state === State.ALIVE) {
          context.fillStyle = `#${integerToHexColor(this.cells[y][x].color)}`;
          context.fillRect(posY, posX, this.gridSize - 2, this.gridSize - 2);
        }
        posY += this.gridSize;
      }
      // go to next row and draw
      posY = 1;
      posX += this.gridSize;
    }
  }

  /**
   * Draw the game on canvas
   */
  draw() {
    const context = this.canvas.getContext('2d');
    // clear the previous canvas content
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBorders();
    this.drawCells();
  }
}

export default Game;
