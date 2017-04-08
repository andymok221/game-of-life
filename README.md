#Game of Life

##Installation
* Make sure you have Node `7.6.0`
* Run `npm install`

##Start the game
* Run `npm start`
* Go to `http://localhost:8080`

## Run test case
* Run `npm test` for eslint and test

##Assumption
* When placing new pattern, it will overwrite that cell even though that cell is alive.
* The grid is "continuous", if a pattern move to the rightmost of grid, it will "continue" at the leftmost of grid.

##Server side
Node.js is used because it has good support in dealing with real-time interaction.

##Client side
Canvas is used for drawing the grid. Babel and webpack for compiling and minifying the JavaScript.

##Model
* `Game` is a central place for holding the information of grid and players. It is mainly responsible for dealing with the events from and to the users interaction.
* `Player`
* `Grid` is the representation of the grid of game. It mostly contains the logic of the game.
* `Cell`

##Extensibility
Currently, the server just allow one game to be hosted.
However, it is easy to host more than one games by using the room function of Primus. Also, as one game is created by one instance of `Game` class so you can just create one `Game` instance for each room and then you can achieve multiple games hosting in one server.
