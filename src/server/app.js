const http = require('http');
const path = require('path');
const Primus = require('primus');
const Koa = require('koa');
const Game = require('./model/game');
const serve = require('koa-static');
const app = new Koa();
const server = http.createServer(app.callback()).listen(process.env.PORT || 3000);
const primus = new Primus(server, { transformer: 'websockets' });

// mount client side public assets
app.use(serve(path.join(__dirname, '/../client/public')));

let game;
primus.on('connection', (spark) => {
  // start the game when someone connects and the game has no active players
  if (!game || game.hasNoPlayers()) {
    game = new Game();
    game.start();
  }
  spark.on('data', (event) => {
    game.handleEvent(event, spark);
  });
});

primus.on('disconnection', (spark) => {
  // remove player from the player list
  game.removePlayer(spark.id);
});
