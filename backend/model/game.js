const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  player_1_id: String,
  player_2_id: String,
  rounds: [
    {
      round_no: Number,
      player_1_pick: String,
      player_1_future: String,
      player_2_pick: String,
      player_2_future: String,
    },
  ],
  winner_id: String,
  loser_id: String,
  winner_score: Number,
  loser_score: Number,
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
