const uuid = require('uuid').v4;
const Grid = require('./grid');
const Player = require('./player');
const Action = require('../../enum/action');
const Config = require('../../config');
const Util = require('../util');

class Game {
  constructor() {
    this.players = {};
    this.disconnectedPlayers = {};
    this.generation = 0;
  }

  /**
   * Start the game
   */
  start() {
    this.grid = new Grid(Config.GAME_WIDTH, Config.GAME_HEIGHT);
    this.autoUpdate = setInterval(this.computeNextGameState.bind(this), Config.REFRESH_INTERVAL);
    this.autoCleanUp = setInterval(this.cleanUpDisconnectedPlayers.bind(this), Config.CLEANUP_INTERVAL);
  }

  /**
   * clean up disconnected players
   */
  cleanUpDisconnectedPlayers() {
    this.disconnectedPlayers = {};
  }

  /**
   * generate the next generation of game
   */
  computeNextGameState() {
    this.grid.generateNextGrid();
    this.generation++;
    this.broadcast({
      action: Action.NEW_GAME_STATE,
      data: {
        cells: this.getGameState(),
        generation: this.getGeneration()
      }
    });
  }

  /**
   * Get number of active players
   * @return {Number}
   */
  getNumberOfPlayers() {
    return Object.keys(this.players).length;
  }

  /**
   * Get number of disconnected players
   * @return {Number}
   */
  getNumberOfDisconnectedPlayers() {
    return Object.keys(this.disconnectedPlayers).length;
  }

  /**
   * Whether the game has no both online and disconnected players
   * @return {Boolean}
   */
  hasNoPlayers() {
    return this.getNumberOfPlayers() + this.getNumberOfDisconnectedPlayers() === 0;
  }

  /**
   * Return the cells as game state
   * @return {Object} - the cells
   */
  getGameState() {
    return this.grid.getCells();
  }

  /**
   * Reschedule auto update
   */
  rescheduleAutoUpdate() {
    // pause auto update
    clearTimeout(this.resumeAutoUpdate);
    clearInterval(this.autoUpdate);
    // resume auto update afterwards
    this.resumeAutoUpdate = setTimeout(() => {
      this.autoUpdate = setInterval(this.computeNextGameState.bind(this), Config.REFRESH_INTERVAL);
    }, Config.TIME_TO_IDLE);
  }

  /**
   * add player into the game
   * @return {Object} the player
   */
  addPlayer(spark, color, identifier) {
    const _identifier = identifier || uuid();
    const _color = color || Util.randomColor();
    this.players[_identifier] = new Player(_color, _identifier, spark);
    return this.players[_identifier];
  }

  /**
   * remove player by the spark id
   * @param {String} sparkId - the spark id
   */
  removePlayer(sparkId) {
    Object.keys(this.players).forEach((identifier) => {
      const player = this.players[identifier];
      if (player.getSocket().id === sparkId) {
        this.disconnectedPlayers[identifier] = new Player(player.getColor(), player.getIdentifier());
        delete this.players[identifier];
      }
    });
    this.broadcastUpdatePlayers();
  }

  /**
   * broadcast message to the active players of this game
   * @param {String} message - the message
   */
  broadcast(message) {
    Object.keys(this.players).forEach((identifier) => {
      const player = this.players[identifier];
      player.getSocket().write(message);
    });
  }

  /**
   * broadcast new game state
   */
  broadcastGameState() {
    this.broadcast({
      action: Action.NEW_GAME_STATE,
      data: {
        cells: this.getGameState(),
        generation: this.getGeneration()
      }
    });
  }

  /**
   * broadcast number of players
   */
  broadcastUpdatePlayers() {
    this.broadcast({
      action: Action.UPDATE_PLAYERS,
      data: {
        players: this.getNumberOfPlayers()
      }
    });
  }

  /**
   * Get the player by the identifier
   * @param {String} identifier
   * @return {Object} the player
   */
  getPlayer(identifier) {
    return this.players[identifier];
  }

  /**
   * Get the disconnected player by the identifier
   * @param {String} identifier
   * @return {Object} the player
   */
  getDisconnectedPlayerByIdentifier(identifier) {
    return this.disconnectedPlayers[identifier];
  }

  /**
   * Return generation
   * @return {Number}
   */
  getGeneration() {
    return this.generation;
  }

  /**
   * Handle events from the client side
   * @param {Object} event - the event from client
   * @param {Object} spark - the spark instance
   */
  handleEvent(event, spark) {
    switch (event.action) {
      case Action.JOIN_GAME: {
        const player = this.addPlayer(spark);
        spark.write({
          action: Action.JOIN_GAME_SUCCESS,
          data: {
            color: player.getColor(),
            identifier: player.getIdentifier(),
            cells: this.getGameState(),
            generation: this.getGeneration()
          }
        });
        this.broadcastUpdatePlayers();
        break;
      }
      case Action.REJOIN_GAME: {
        const oldPlayer = this.getDisconnectedPlayerByIdentifier(event.data.identifier);
        if (oldPlayer) {
          // we get back old player information
          this.addPlayer(spark, oldPlayer.getColor(), oldPlayer.getIdentifier());
          spark.write({
            action: Action.REJOIN_GAME_SUCCESS,
            data: {
              cells: this.getGameState(),
              generation: this.getGeneration()
            }
          });
        } else {
          // if no player is found, probably game server is crashed or we clean up the disconnected players
          const player = this.addPlayer(spark);
          spark.write({
            action: Action.JOIN_GAME_SUCCESS,
            data: {
              color: player.getColor(),
              identifier: player.getIdentifier(),
              cells: this.getGameState(),
              generation: this.getGeneration()
            }
          });
        }
        this.broadcastUpdatePlayers();
        break;
      }
      case Action.CLICK_CELL: {
        const player = this.getPlayer(event.data.identifier);
        if (!player) return;
        const updated = this.grid.updateCell(event.data.x, event.data.y, player.getColor());
        if (updated) this.rescheduleAutoUpdate();
        this.broadcastGameState();
        break;
      }
      case Action.ADD_PATTERN: {
        this.grid.addNewPatten(event.data.type, event.data.color);
        this.rescheduleAutoUpdate();
        this.broadcastGameState();
        break;
      }
      default:
        break;
    }
  }
}

module.exports = Game;
