const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  id: { type: String },
  username: { type: String },
  score: { type: Number, default: 0 },
});

const roundSchema = new mongoose.Schema({
  roundNo: { type: Number },
  started: { type: Date },
  finished: { type: Date },
  playerOnePick: { type: String },
  playerOneFuture: { type: String },
  playerTwoPick: { type: String },
  playerTwoFuture: { type: String },
});

const gameSchema = new mongoose.Schema({
  playerOne: playerSchema,
  playerTwo: playerSchema,
  round: { type: Number, default: 1 },
  rounds: [roundSchema],
  championship: { type: Boolean }, // there are two type of games, championship and friendly
  created: { type: Date },
  started: { type: Date },
  finished: { type: Date },
  winner: { type: String, default: 0 },
});

const Game = mongoose.model("game", gameSchema);

module.exports = Game;
