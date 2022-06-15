const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, required: true },
  winner: { type: Boolean, default: false },
  score: { type: Number, default: 0 },
});

const roundSchema = new mongoose.Schema({
  roundNo: { type: Number, required: true },
  playerOnePick: { type: String, required: true },
  playerOneFuture: { type: String, required: true },
  playerTwoPick: { type: String, required: true },
  playerTwoFuture: { type: String, required: true },
});

const gameSchema = new mongoose.Schema({
  playerOne: [playerSchema],
  playerTwo: [playerSchema],
  championship: Boolean, // there are two type of games, championship and friendly
  rounds: [roundSchema],
});

const Game = mongoose.model("game", gameSchema);

module.exports = Game;
