import Game from './lib/game';
import Action from '../../enum/action';
import Config from '../../config';

window.onload = () => {
  const canvasElm = document.getElementById('game-of-life');
  const playersElm = document.getElementById('players');
  const networkElm = document.getElementById('network');
  const generationElm = document.getElementById('generation');
  const colorGridElm = document.getElementById('color-grid');
  const pattersElm = document.getElementById('patterns');

  const CANVAS_WIDTH = Config.GAME_WIDTH * Config.CELL_SIZE;
  const CANVAS_HEIGHT = Config.GAME_HEIGHT * Config.CELL_SIZE;
  canvasElm.width = CANVAS_WIDTH;
  canvasElm.height = CANVAS_HEIGHT;

  // connect to game server
  const primus = new Primus('/', {
    // consider putting them in constant
    reconnect: {
      min: Config.CONNECTION_RETRY_MIN_INTERVAL,
      retries: Config.CONNECTION_RETRIES // 500 -> 1000 -> 2000 -> 4000 -> 8000
    }
  });

  const game = new Game(Config.CELL_SIZE, primus, canvasElm, {
    players: playersElm,
    network: networkElm,
    generation: generationElm,
    colorGrid: colorGridElm,
    patters: pattersElm
  });

  primus.on('open', () => {
    console.log('Connected to primus server');
    if (game.getState() === 'NOT_CONNECTED') {
      primus.write({ action: Action.JOIN_GAME });
    } else {
      console.log('Reconnected to primus server');
      primus.write({
        action: Action.REJOIN_GAME,
        data: {identifier: game.identifier}
      });
      game.setState('RECONNECTED');
      game.handleUIUpdate('network', 'RECONNECTED');
    }
  });
  primus.on('reconnect', () => {
    console.log('Trying to reconnect');
    game.setState('RECONNECTING');
    game.handleUIUpdate('network', '<b>RECONNECTING</b>');
  });
  primus.on('end', function () {
    console.log('Connection closed');
    game.setState('DISCONNECTED');
    game.handleUIUpdate('network', '<b>DISCONNECTED</b>');
  });
  primus.on('data', (event) => {
    game.handleEvent(event);
  });
};
