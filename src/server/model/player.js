class Player {
  /**
   * @param {Number} color - the decimal format of a color
   * @param {String} identifier - unique identifier among a game
   * @param {Object} socket - the spark instance
   */
  constructor(color, identifier, socket) {
    this.color = color;
    this.socket = socket;
    this.identifier = identifier;
  }

  /**
   * Get the color
   */
  getColor() {
    return this.color;
  }

  /**
   * Get the identifier
   */
  getIdentifier() {
    return this.identifier;
  }

  /**
   * Get the socket object
   */
  getSocket() {
    return this.socket;
  }
}

module.exports = Player;
