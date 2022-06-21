const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, required: true },
  score: { type: Number, default: 0 },
});

const roundSchema = new mongoose.Schema({
  roundNo: { type: Number, required: true },
  playerOnePick: { type: Number, required: true },
  playerOneFuture: { type: Number, required: true },
  playerTwoPick: { type: Number, required: true },
  playerTwoFuture: { type: Number, required: true },
});

const gameSchema = new mongoose.Schema({
  playerOne: [playerSchema],
  playerTwo: [playerSchema],
  rounds: [roundSchema],
  championship: Boolean, // there are two type of games, championship and friendly
  winner: { type: String, default: 0 },
});

const Game = mongoose.model("game", gameSchema);

module.exports = Game;
