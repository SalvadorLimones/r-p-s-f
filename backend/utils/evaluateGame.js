const User = require("../models/user");
const evaluateGame = async (winnerId, loserId) => {
  const winner = await User.findById(winnerId);
  const loser = await User.findById(loserId);
  winner.played = winner.played + 1;
  winner.won = winner.won + 1;
  loser.played = loser.played + 1;
  await winner.save();
  await loser.save();
};

module.exports = evaluateGame;
