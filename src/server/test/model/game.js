const expect = require('chai').expect;
const sinon = require('sinon');
const Game = require('../../model/game');
const Action = require('../../../enum/action');
let sandbox;

describe('Test Model Game', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });
  it('New game should has no players', () => {
    const game = new Game();
    expect(game.hasNoPlayers()).to.be.eql(true);
  });
  it('generation should be 0 once created', () => {
    const game = new Game();
    expect(game.getGeneration()).to.be.eql(0);
  });
  it('computeNextGameState should increase generation', () => {
    const game = new Game();
    game.start();
    game.computeNextGameState();
    expect(game.getGeneration()).to.be.eql(1);
  });
  it('addPlayer will return a new player', () => {
    const game = new Game();
    const player = game.addPlayer(null, 5, 'asd');
    expect(player.getColor()).to.be.eql(5);
    expect(player.getIdentifier()).to.be.eql('asd');
  });
  it('removePlayer will return a player and add it to disconnected list', () => {
    const game = new Game();
    game.addPlayer({ id: 'test' }, 5, 'asd');
    game.removePlayer('test');
    expect(game.getNumberOfPlayers()).to.be.eql(0);
    expect(game.getNumberOfDisconnectedPlayers()).to.be.eql(1);
  });
  it('removePlayer will not remove a non-existing player', () => {
    const game = new Game();
    sandbox.stub(game, 'broadcastUpdatePlayers');
    game.addPlayer({ id: 'test' }, 5, 'asd');
    game.removePlayer('test2');
    expect(game.getNumberOfPlayers()).to.be.eql(1);
    expect(game.getNumberOfDisconnectedPlayers()).to.be.eql(0);
  });
  describe('handleEvent', () => {
    it('will send a JOIN_GAME_SUCCESS message for JOIN_GAME', () => {
      const spy = sandbox.spy();
      const game = new Game();
      sandbox.stub(game, 'getGameState');
      game.handleEvent({
        action: Action.JOIN_GAME
      }, { write: spy });
      expect(spy.args[0][0].action).to.be.eql(Action.JOIN_GAME_SUCCESS);
    });
    it('will send a REJOIN_GAME_SUCCESS message if find back disconnect players for REJOIN_GAME', () => {
      const spy = sandbox.spy();
      const game = new Game();
      sandbox.stub(game, 'broadcastUpdatePlayers');
      const identifier = 'test';
      sandbox.stub(game, 'getGameState');
      sandbox.stub(game, 'getDisconnectedPlayerByIdentifier').withArgs(identifier).returns({
        getColor() {},
        getIdentifier() {}
      });
      game.handleEvent({
        action: Action.REJOIN_GAME,
        data: { identifier }
      }, { write: spy });
      expect(spy.args[0][0].action).to.be.eql(Action.REJOIN_GAME_SUCCESS);
    });
    it('will send a JOIN_GAME_SUCCESS message if cannot find back disconnect players for REJOIN_GAME', () => {
      const spy = sandbox.spy();
      const game = new Game();
      sandbox.stub(game, 'broadcastUpdatePlayers');
      sandbox.stub(game, 'getGameState');
      sandbox.stub(game, 'getDisconnectedPlayerByIdentifier').returns(undefined);
      game.handleEvent({
        action: Action.REJOIN_GAME,
        data: { identifier: 'test' }
      }, { write: spy });
      expect(spy.args[0][0].action).to.be.eql(Action.JOIN_GAME_SUCCESS);
    });
    it('will not handle event from non-existing player for CLICK_CELL', () => {
      const game = new Game();
      const stub = sandbox.stub(game, 'broadcastGameState');
      sandbox.stub(game, 'getPlayer').returns(false);
      game.handleEvent({
        action: Action.CLICK_CELL,
        data: { identifier: 'test' }
      });
      expect(stub.called).to.be.eql(false);
    });
    it('will broadcast game update if cell is updated for CLICK_CELL', () => {
      const game = new Game();
      const identifier = 'test';
      game.grid = {
        updateCell() {
          return true;
        }
      };
      sandbox.stub(game, 'getPlayer').withArgs(identifier).returns({
        getColor() {}
      });
      const stub = sandbox.stub(game, 'broadcastGameState');
      const stub2 = sandbox.stub(game, 'rescheduleAutoUpdate');
      game.handleEvent({
        action: Action.CLICK_CELL,
        data: { identifier }
      });
      expect(stub.calledOnce).to.be.eql(true);
      expect(stub2.calledOnce).to.be.eql(true);
    });
    it('will handle event for ADD_PATTERN', () => {
      const game = new Game();
      game.grid = {
        addNewPatten() {
          return true;
        }
      };
      const stub = sandbox.stub(game, 'broadcastGameState');
      const stub2 = sandbox.stub(game, 'rescheduleAutoUpdate');
      game.handleEvent({
        action: Action.ADD_PATTERN,
        data: { type: 'test' }
      });
      expect(stub.calledOnce).to.be.eql(true);
      expect(stub2.calledOnce).to.be.eql(true);
    });
  });
});
