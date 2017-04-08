module.exports = {
  GAME_WIDTH: 100,
  GAME_HEIGHT: 50,
  REFRESH_INTERVAL: 50, // how frequent does the game `tick`
  TIME_TO_IDLE: 2000, // the time to idle when user adds a pattern or click a cell
  CLEANUP_INTERVAL: 30000, // how frequent does the game clear the disconnected players
  UNDER_POPULATION_THRESHOLD: 2, // if no.of neighbour cell is below this threshold, it will die
  OVERCROWDING_THRESHOLD: 3, // if no.of neighbour cell is above this threshold, it will die
  REPRODUCTION_LIMIT: 3, // if no.of neighbour cell is equal to this, it will reproduce a cell
  CELL_SIZE: 10, // the size of a cell inside the grid
  CONNECTION_RETRY_MIN_INTERVAL: 500,
  CONNECTION_RETRIES: 5
};
