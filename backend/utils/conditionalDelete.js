const Game = require("../models/game");
const conditionalDelete = async (condition, id) => {
  let time;
  const deleteGame = async (id, condition) => {
    const gameAgain = await Game.findById(id);
    if (gameAgain && !gameAgain[condition]) gameAgain.delete();
  };
  if (condition === "started") time = 30 * 1000;
  if (condition === "finished") time = 30 * 60 * 1000;
  setTimeout(() => deleteGame(id, condition), time);
};

module.exports = conditionalDelete;
