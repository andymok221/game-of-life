# Game of Life
This is a implementation of a famous game, Conway’s Game of Life. Following tools are used.
* Websocket for real time communication
* Node.js for server side
* HTML canvas for client side rendering
* Webpack for client side asset compiling

## Installation
* Make sure you have Node.js `7.6.0`
* Run `npm install`

## Start the game
* Run `npm start` it will compile the asset first and then start the server
* Go to `http://localhost:3000`

## Development
* Run `npm run dev` for client side asset compiling
* Run `node src/server/app.js` for starting server
* Go to `http://localhost:3000`

## Run test case
* Run `npm test` for eslint and test

## Demo
https://quiet-bayou-41975.herokuapp.com/

## Assumption
* When placing new pattern, it will overwrite that cell even though that cell is alive.
* The grid is "continuous", if a pattern move to the rightmost of grid, it will "continue" at the leftmost of grid. You can place a `glider` to see the actual behavior.
* If a STARTED game has no active players for a specific interval, the game will be closed.

## Architecture
You may find the `server` and `client` code separately under `src` folder. Only `config` and `enum` are shared by the `server` and `client`.
### Server
* `Game` is a central place for holding the information of grid and players. It is mainly responsible for dealing with the events from and to the users interaction.
* `Grid` is the representation of the grid of game. It mostly contains the logic of the game.
* `Player` is the representation of a player in a game.
* `Cell` is the representation of cell in a grid.
### Client
* The `game` in `lib` handles the client side logic, mainly user interaction and rendering the canvas

## Further documentation
* Please refer to the documentation of the code and config file.

## Possible future extension
Currently, the server just supports one game. However, it is easy to host more than one games by using the room function of Primus. Also, as one game is created by one instance of `Game` class so you can just create one `Game` instance for each room and then you can achieve multiple games hosting in one server.
