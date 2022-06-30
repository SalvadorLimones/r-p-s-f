const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { find } = require("../middlewares/findUsers");
const { playing } = require("../middlewares/playing");
const evaluateRound = require("../utils/evaluateRound");
const evaluateGame = require("../utils/evaluateGame");
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

//delete a game
router.delete("/:gameId", auth({ block: true }), async (req, res) => {
  //const user = await User.findById(res.locals.userId);
  const game = await Game.findById(req.params.gameId);

  if (!game) return res.status(404).send("Game not found!");
  if (game.playerOne.id !== res.locals.user.userId)
    return res.status(401).send("You are not authorized to delete this game!");
  if (game.started)
    return res
      .status(401)
      .send("You can't delete a game which has already started!");

  game.delete((err) => {
    if (err) return res.status(500).send(err);
    res.status(200).send("Game deleted!");
  });
});

//start a friendly game
router.post(
  "/start/friendly",
  auth({ block: true }),
  find(),
  playing(),
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
      playerOne: {
        id: me._id,
        username: me.username,
      },
      playerTwo: {
        id: otherPlayer._id,
        username: otherPlayer.username,
      },
    });

    const deleteIfNotStarted = async (id) => {
      const gameAgain = await Game.findById(id);
      if (gameAgain && !gameAgain.started) gameAgain.delete();
    };

    setTimeout(() => deleteIfNotStarted(game._id), 40000);
    return res.status(200).send(game);
  }
);

//create a championship game game
router.post(
  "/start/championship",
  auth({ block: true }),
  playing(),
  async (req, res) => {
    console.log("USER:", res.locals.user);
    const game = await Game.create({
      playerOne: {
        id: res.locals.user.userId,
        username: res.locals.user.username,
      },
      championship: true,
      created: Date.now(),
    });

    const deleteIfNotStarted = async (id) => {
      const gameAgain = await Game.findById(id);
      if (gameAgain && !gameAgain.started) gameAgain.delete();
    };

    setTimeout(() => deleteIfNotStarted(game._id), 40000);
    return res.status(200).send(game);
  }
);

//join a game
router.post("/join", auth({ block: true }), playing(), async (req, res) => {
  console.log("USER: ", res.locals.user);
  const id = req.body.gameId;
  let game;
  if (!id) {
    game = await Game.findOne(
      {
        $and: [{ "playerTwo.id": null }, { championship: true }],
      },
      { sort: { created: 1 } }
    );
    if (!game) return res.status(404).send("Please create a game!");
    game.playerTwo = {
      id: res.locals.user.userId,
      username: res.locals.user.username,
    };
    game.championship = true;
  } else {
    game = await Game.findById(id);
  }

  if (game.playerTwo.id !== res.locals.user.userId)
    return res
      .status(401)
      .send("Sorry, you were not invited to join this game!");
  if (game.started)
    return res.status(400).send("This game has already started!");
  if (game.finished)
    return res.status(400).send("This game has already ended!");

  game.started = Date.now();
  game.save((err) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(game);
  });
});

//store player picks
router.post("/pick/:gameId", auth({ block: true }), async (req, res) => {
  let me;
  const { round, Pick, Future } = req.body;
  console.log("ROUND: ", round, "PICK: ", Pick, "FUTURE: ", Future);
  if (!(round && Pick && Future))
    return res.status(400).send("All inputs required!");
  const game = await Game.findById(req.params.gameId);

  if (!game) return res.status(404).send("game not found!");

  if (
    game.playerOne?.id !== res.locals.user.userId &&
    game.playerTwo?.id !== res.locals.user.userId
  )
    return res.status(401).send("Sorry, this is not your game!");

  if (!game.started)
    return res.status(400).send("This game hasn't started yet!");

  if (game.finished)
    return res.status(400).send("This game has already ended!");

  if (game.playerOne.id === res.locals.user.userId) {
    me = "playerOne";
  } else {
    me = "playerTwo";
  }

  if (!game.rounds[round - 1] && game.rounds[round - 2]?.finished) {
    game.rounds.push({
      roundNo: round,
      started: Date.now(),
      [me + "Pick"]: Pick,
      [me + "Future"]: Future,
    });
  } else {
    if (
      game.rounds[round - 1][me + "Pick"] ||
      game.rounds[round - 1][me + "Future"]
    )
      return res
        .status(400)
        .send("You have already sent your pick in this round!");
    game.rounds[round - 1][me + "Pick"] = Pick;
    game.rounds[round - 1][me + "Future"] = Future;
    game.rounds[round - 1].finished = Date.now();
    const toAdd = evaluateRound(game.rounds[round - 1], game.rounds[round - 2]);
    game.playerOne.score += toAdd.playerOne;
    game.playerTwo.score += toAdd.playerTwo;
    if (
      game.playerOne.score >= 5 &&
      game.playerOne.score - game.playerTwo.score >= 1
    ) {
      game.finished = Date.now();
      game.winner = game.playerOne.id;
      if (game.championship) evaluateGame(game.playerOne.id, game.playerTwo.id);
    }
    if (
      game.playerTwo.score >= 5 &&
      game.playerTwo.score - game.playerOne.score >= 1
    ) {
      game.finished = Date.now();
      game.winner = game.playerTwo.id;
      if (game.championship) evaluateGame(game.playerTwo.id, game.playerOne.id);
    }

    game.round = round + 1;
  }
  await game.save((err) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(game);
  });
});

module.exports = router;
