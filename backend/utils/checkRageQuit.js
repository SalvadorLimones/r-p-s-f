const Game = require("../models/game");
const evaluateGame = require("./evaluateGame");
const checkRageQuit = async (id, round, me, otherPlayer) => {
  const game = await Game.findById(id);
  if (!game.rounds[round - 1].finished) {
    game[me].score = 10;
    game[otherPlayer].score = 0;
    game.finished = Date.now();
    game.winner = game[me].id;
    if (game.championship) evaluateGame(game[me].id, game[otherPlayer].id);
  }
  await game.save();
};

module.exports = checkRageQuit;
