require("dotenv").config();
const app = require("../app");
const mockserver = require("supertest");
const Game = require("../models/game");
const User = require("../models/user");
const { startDb, stopDb, deleteAll } = require("./util/inMemoryDb");
const { storeOnePlayer, storeTwoPlayers } = require("./util/storePlayers");
const {
  storeOneFinishedGame,
  storeOneNotStartedGame,
  storeOneStartedGame,
} = require("./util/storeGames");
const jwt = require("jsonwebtoken");

describe("/api/game test", () => {
  let connection;
  let mongod;
  let client;

  beforeAll(async () => {
    [connection, mongod] = await startDb();
    client = mockserver.agent(app);
  });

  afterEach(async () => {
    await deleteAll(User);
    await deleteAll(Game);
  });

  afterAll(async () => {
    await stopDb(connection, mongod);
  });

  test(" /get:id returns status 404 and if incorrect id sent", async () => {
    //given
    await storeOnePlayer();
    await storeOneFinishedGame();
    const user = await User.findOne();

    const sessionToken = jwt.sign(
      { userId: user._id, providers: user.providers },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    client.set("authorization", sessionToken);

    //when
    const response = await client.get("/api/game/62bc82d8dbeb663ce8384fae");

    //then
    expect(response.status).toBe(404);
    expect(response.text).toBe("Game not found!");
  });

  test(" /get:id returns game data if correct id sent", async () => {
    //given
    await storeOneFinishedGame();
    await storeOnePlayer();
    const game = await Game.findOne();
    const user = await User.findOne();

    const sessionToken = jwt.sign(
      { userId: user._id, providers: user.providers },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    client.set("authorization", sessionToken);

    //when
    const response = await client.get("/api/game/" + game.id);

    //then
    expect(response.status).toBe(200);
    expect(JSON.parse(response.text)._id === game.id).toBe(true);
  });

  test(" /delete:id returns status 404 and if incorrect id sent", async () => {
    //given
    await storeOnePlayer();
    await storeOneFinishedGame();
    const user = await User.findOne();

    const sessionToken = jwt.sign(
      { userId: user._id, providers: user.providers },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    client.set("authorization", sessionToken);

    //when
    const response = await client.delete("/api/game/62bc82d8dbeb663ce8384fae");

    //then
    expect(response.status).toBe(404);
    expect(response.text).toBe("Game not found!");
  });

  test(" /delete:id returns status 401 when player is not authorized to delete the game", async () => {
    //given
    await storeOnePlayer();
    await storeOneFinishedGame();
    const game = await Game.findOne();
    const user = await User.findOne();

    const sessionToken = jwt.sign(
      { userId: user._id, providers: user.providers },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    client.set("authorization", sessionToken);

    //when
    const response = await client.delete("/api/game/" + game.id);

    //then
    expect(response.status).toBe(401);
    expect(response.text).toBe("You are not authorized to delete this game!");
  });

  test(" /delete:id returns status 401 when player is not authorized to delete the game", async () => {
    //given
    await storeOnePlayer();
    await storeOneFinishedGame();
    const game = await Game.findOne();
    const user = await User.findOne();

    const sessionToken = jwt.sign(
      { userId: user._id, providers: user.providers },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    client.set("authorization", sessionToken);

    //when
    const response = await client.delete("/api/game/" + game.id);

    //then
    expect(response.status).toBe(401);
    expect(response.text).toBe("You are not authorized to delete this game!");
  });

  test(" /delete:id returns status 401 when game has already started", async () => {
    //given
    await storeOnePlayer();
    await storeOneFinishedGame();
    const game = await Game.findOne();
    const user = await User.findOne();

    const sessionToken = jwt.sign(
      { userId: game.playerOne.id, providers: user.providers },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    client.set("authorization", sessionToken);

    //when
    const response = await client.delete("/api/game/" + game.id);

    //then
    expect(response.status).toBe(401);
    expect(response.text).toBe(
      "You can't delete a game which has already started!"
    );
  });

  test(" /delete:id returns status 200 and deletes the game with the given id, if id is correct and game hasn't started", async () => {
    //given
    await storeOnePlayer();
    await storeOneNotStartedGame();
    const game = await Game.findOne();
    const user = await User.findOne();

    const sessionToken = jwt.sign(
      { userId: game.playerOne.id, providers: user.providers },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    client.set("authorization", sessionToken);
    const response = await client.delete("/api/game/" + game.id);
    const gameAgain = await Game.find();

    //when

    //then
    expect(response.status).toBe(200);
    expect(response.text).toBe("Game deleted!");
    expect(gameAgain).toStrictEqual([]);
  });

  test(" /start/championship returns status 200 and adds a new game to the database", async () => {
    //given
    await storeOnePlayer();
    const user = await User.findOne();
    const game = await Game.find();

    const sessionToken = jwt.sign(
      { userId: user._id, providers: user.providers },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    client.set("authorization", sessionToken);

    //when
    const response = await client.post("/api/game/start/championship");

    //then
    const gameAgain = await Game.find();
    expect(JSON.parse(response.text).playerOne.id === user.id).toBe(true);
    expect(response.status).toBe(200);
    expect(game).toStrictEqual([]);
    expect(gameAgain.length).toBe(1);
  });

  test(" /join returns status 404 if there are no championship games created but not started", async () => {
    //given
    await storeOnePlayer();
    const user = await User.findOne();
    const game = await Game.find();

    const sessionToken = jwt.sign(
      { userId: user._id, providers: user.providers },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    client.set("authorization", sessionToken);

    //when
    const response = await client.post("/api/game/join");

    //then
    expect(response.status).toBe(404);
    expect(response.text).toBe("Please create a game!");
    expect(game.length).toBe(0);
  });

  test(" /join returns status 200 and adds starts the game if user joins a created but not started championsip game", async () => {
    //given
    await storeOnePlayer();
    await storeOneNotStartedGame();
    const user = await User.findOne();
    const game = await Game.find();

    const sessionToken = jwt.sign(
      { userId: user._id, providers: user.providers },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    client.set("authorization", sessionToken);

    //when
    const response = await client.post("/api/game/join");

    //then
    const gameAgain = await Game.find();
    expect(response.status).toBe(200);
    expect(JSON.parse(response.text).playerTwo.id === user.id).toBe(true);
    expect(JSON.parse(response.text).started).toBeTruthy();
    expect(game.length).toBe(1);
    expect(gameAgain.length).toBe(1);
  });

  test(" /join returns status 400 when user wants to join a friendly game where not invited", async () => {
    //given
    await storeOnePlayer();
    await storeOneNotStartedGame();
    const user = await User.findOne();
    const game = await Game.findOne();

    const sessionToken = jwt.sign(
      { userId: user._id, providers: user.providers },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    client.set("authorization", sessionToken);

    //when
    const response = await client.post("/api/game/join").send({
      gameId: game.id,
    });

    //then
    expect(response.status).toBe(401);
    expect(response.text).toBe(
      "Sorry, you were not invited to join this game!"
    );
  });

  test(" /join returns status 400 when user wants to join an already started game ", async () => {
    //given
    await storeOnePlayer();
    await storeOneFinishedGame();
    const user = await User.findOne();
    const game = await Game.findOne();

    game.playerTwo.id = user.id;
    await game.save();

    const sessionToken = jwt.sign(
      { userId: user._id, providers: user.providers },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    client.set("authorization", sessionToken);

    //when
    const response = await client.post("/api/game/join").send({
      gameId: game.id,
    });

    //then
    expect(response.status).toBe(400);
    expect(response.text).toBe("This game has already started!");
  });

  test(" /pick/:gameId returns status 400 when request body is not complete ", async () => {
    //given
    await storeTwoPlayers();
    await storeOneStartedGame();
    const users = await User.find();
    const user1 = users[0];
    const user2 = users[1];
    const game = await Game.findOne();

    game.playerOne.id = user1.id;
    game.playerTwo.id = user2.id;
    await game.save();

    const sessionToken = jwt.sign(
      { userId: user1._id, providers: user1.providers },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    client.set("authorization", sessionToken);

    //when
    const response = await client.post("/api/game/pick/" + game.id).send({
      round: 1,
      Pick: "rock",
    });

    //then
    expect(response.status).toBe(400);
    expect(response.text).toBe("All inputs required!");
  });

  test(" /pick/:gameId returns status 404 when wrong id sent ", async () => {
    //given
    await storeTwoPlayers();
    await storeOneStartedGame();
    const users = await User.find();
    const user1 = users[0];
    const user2 = users[1];
    const game = await Game.findOne();

    game.playerOne.id = user1.id;
    game.playerTwo.id = user2.id;
    await game.save();

    const sessionToken = jwt.sign(
      { userId: user1._id, providers: user1.providers },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    client.set("authorization", sessionToken);

    //when
    const response = await client
      .post("/api/game/pick/62bc82d8dbeb663ce8384fae")
      .send({
        round: 1,
        Pick: "rock",
        Future: "rock",
      });

    //then
    expect(response.status).toBe(404);
    expect(response.text).toBe("Game not found!");
  });

  test(" /pick/:gameId returns status 401 when player tries to send request to another game ", async () => {
    //given
    await storeTwoPlayers();
    await storeOneStartedGame();
    await User.create({
      username: "Galamb",
      providers: {
        google: 3333333,
      },
    });

    const users = await User.find();
    const user1 = users[0];
    const user2 = users[1];
    const user3 = users[2];
    const game = await Game.findOne();

    game.playerOne.id = user1.id;
    game.playerTwo.id = user2.id;
    await game.save();

    const sessionToken = jwt.sign(
      { userId: user3._id, providers: user3.providers },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    client.set("authorization", sessionToken);

    //when
    const response = await client.post("/api/game/pick/" + game.id).send({
      round: 1,
      Pick: "rock",
      Future: "rock",
    });

    //then
    expect(response.text).toBe("Sorry, this is not your game!");
    expect(response.status).toBe(401);
  });

  test(" /pick/:gameId returns status 200 and stores choices when correct request sent ", async () => {
    //given
    await storeTwoPlayers();
    await storeOneStartedGame();
    const users = await User.find();
    const user1 = users[0];
    const user2 = users[1];
    const game = await Game.findOne();

    game.playerOne.id = user1.id;
    game.playerTwo.id = user2.id;
    await game.save();

    const sessionToken = jwt.sign(
      { userId: user1._id, providers: user1.providers },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    client.set("authorization", sessionToken);

    //when
    const response = await client.post("/api/game/pick/" + game.id).send({
      round: 1,
      Pick: "rock",
      Future: "rock",
    });

    //then
    expect(response.status).toBe(200);
  });

  /*   test(" /pick/:gameId returns status 200,stores choices and ends the game, when correct request sent and player reaches 5 ponts", async () => {
    //given
    await storeTwoPlayers();
    await storeOneStartedGame();
    const users = await User.find();
    const user1 = users[0];
    const user2 = users[1];
    const game = await Game.findOne();
    game.rounds.push({
      roundNo: 1,
      started: "2022-06-29T16:51:32.479+00:00",
      playerTwoPick: "scissors",
      playerTwoFuture: "scissors",
    });

    game.playerOne.id = user1.id;
    game.playerOne.score = 4;
    game.playerTwo.id = user2.id;
    await game.save();
    console.log("ID: ", game.playerOne.id);

    const sessionToken = jwt.sign(
      { userId: user1._id, providers: user1.providers },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    client.set("authorization", sessionToken);

    //when
    const response = await client.post("/api/game/pick/" + game.id).send({
      round: 1,
      Pick: "rock",
      Future: "rock",
    });

    //then
    const gameAgain = await Game.findOne();
    expect(response.status).toBe(200);
    expect(gameAgain.finished).toBeTruthy();
  }); */
});
