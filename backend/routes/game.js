const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { find } = require("../middlewares/findUsersForFriendRout");
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

//return game data
router.get("/:gameId", auth({ block: true }), async (req, res) => {
  //const user = await User.findById(res.locals.userId);
  const game = await Game.findById(req.params.gameId);
  if (!game) return res.status(404).send("game not found!");
  return res.status(200).send(game);
});

//start a friendly game
router.post(
  "/start/friendly",
  auth({ block: true }),
  find(),
  async (req, res) => {
    const { me, otherPlayer, myFriend, iAmFriend } = res.locals;
    if (!(myFriend?.friendStatus === 2 && iAmFriend?.friendStatus === 2))
      return res
        .status(400)
        .send("You can play friendly games only with your friends!");

    if (
      !otherPlayer.lastTimeOnline ||
      Date.now() - otherPlayer.lastTimeOnline > 15000
    )
      return res
        .status(400)
        .send("Sorry, the other player is not online right now!");

    if (Date.now() - otherPlayer.lastTimePlaying < 15000)
      return res.status(400).send("Sorry, the other player is busy right now!");
    const game = await Game.create({
      playerOne: [
        {
          id: me._id,
          username: me.username,
        },
      ],
      playerTwo: [
        {
          id: otherPlayer._id,
          username: otherPlayer.username,
        },
      ],
    });

    const deleteIfNotStarted = async (id) => {
      const gameAgain = await Game.findById(id);
      if (!gameAgain.started) gameAgain.delete();
    };

    setTimeout(() => deleteIfNotStarted(game._id), 40000);
    return res.status(200).send(game);
  }
);

module.exports = router;
