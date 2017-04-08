class Cell {
  /**
   * @param state {Number} - dead or alive
   * @param color {Number}
   */
  constructor(state, color) {
    this.state = state;
    this.color = color;
  }

  /**
   * Get the state
   */
  getState() {
    return this.state;
  }

  /**
   * Get the color
   */
  getColor() {
    return this.color;
  }

  toJSON() {
    return {
      state: this.state,
      color: this.color
    };
  }
}

module.exports = Cell;
