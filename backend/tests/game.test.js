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
} = require("./util/storeGames");
const jwt = require("jsonwebtoken");

describe("/api/user/game test", () => {
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
});
