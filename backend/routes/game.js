const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const User = require("../models/user");
const Game = require("../models/game");

//return all games played by the user
router.get("/", auth({ block: true }), async (req, res) => {
  const userId = res.locals.user.userId;
  const games = await Game.find({
    $or: [{ "playerOne.id": userId }, { "playerTwo.id": userId }],
  });
  res.json({ games });
});

//store a game
router.post("/", auth({ block: true }), async (req, res) => {
  const { playerOne, playerTwo, rounds } = req.body;
  if (!(playerOne && playerTwo && rounds))
    return res.status(400).send("All inputs are required!");
  if (
    !(
      playerOne.id &&
      playerOne.username &&
      (playerOne.winner === false || playerOne.winner === true) &&
      playerOne.score &&
      playerTwo.id &&
      playerTwo.username &&
      (playerTwo.winner === false || playerTwo.winner === true) &&
      playerTwo.score
    )
  )
    return res.status(400).send("Players data not complete!");

  rounds.map((round) => {
    if (
      !(
        round.roundNo &&
        round.playerOnePick &&
        round.playerOneFuture &&
        round.playerTwoPick &&
        round.playerTwoFuture
      )
    )
      return res.status(400).send("Rounds data not complete!");
  });

  const game = await Game.create({
    playerOne,
    playerTwo,
    rounds,
  });
  res.status(200).send("Game successfully sored!");
});

module.exports = router;
