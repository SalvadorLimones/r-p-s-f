const Game = require("../../models/game");

const storeOneFinishedGame = async () => {
  await Game.create({
    playerOne: { id: 11111, username: "Macska", score: 5.5 },
    playerTwo: { id: 22222, username: "Kutya", score: 0 },
    round: 5,
    rounds: [
      {
        roundNo: 1,
        started: "2022-06-29T16:51:32.479+00:00",
        finished: "2022-06-29T16:52:32.479+00:00",
        playerOnePick: "rock",
        playerOneFuture: "scissors",
        playerTwoPick: "scissors",
        playerTwoFuture: "scissors",
      },
      {
        roundNo: 2,
        started: "2022-06-29T16:52:32.479+00:00",
        finished: "2022-06-29T16:53:32.479+00:00",
        playerOnePick: "rock",
        playerOneFuture: "scissors",
        playerTwoPick: "scissors",
        playerTwoFuture: "scissors",
      },
      {
        roundNo: 3,
        started: "2022-06-29T16:53:32.479+00:00",
        finished: "2022-06-29T16:54:32.479+00:00",
        playerOnePick: "rock",
        playerOneFuture: "scissors",
        playerTwoPick: "scissors",
        playerTwoFuture: "scissors",
      },
      {
        roundNo: 4,
        started: "2022-06-29T16:54:32.479+00:00",
        finished: "2022-06-29T16:55:32.479+00:00",
        playerOnePick: "rock",
        playerOneFuture: "scissors",
        playerTwoPick: "scissors",
        playerTwoFuture: "scissors",
      },
    ],
    championship: true,
    created: "2022-06-29T16:50:32.479+00:00",
    started: "2022-06-29T16:51:32.479+00:00",
    finished: "2022-06-29T16:58:32.479+00:00",
    winner: "11111",
  });
};

const storeOneStartedGame = async () => {
  await Game.create({
    playerOne: { id: 11111, username: "Macska", score: 5.5 },
    playerTwo: { id: 22222, username: "Kutya", score: 0 },
    round: 1,
    rounds: [],
    championship: true,
    created: "2022-06-29T16:50:32.479+00:00",
    started: "2022-06-29T16:51:32.479+00:00",
  });
};

const storeOneNotStartedGame = async () => {
  await Game.create({
    playerOne: { id: 222222, username: "Kutya", score: 0 },
    round: 1,
    rounds: [],
    championship: true,
    created: "2022-06-29T16:50:32.479+00:00",
  });
};

module.exports = {
  storeOneFinishedGame,
  storeOneNotStartedGame,
  storeOneStartedGame,
};
