require("dotenv").config();
const app = require("../app");
const mockserver = require("supertest");
const User = require("../models/user");
const { startDb, stopDb, deleteAll } = require("./util/inMemoryDb");
const jwt = require("jsonwebtoken");

describe("/api/user/friend test", () => {
  let connection;
  let mongod;
  let client;

  beforeAll(async () => {
    [connection, mongod] = await startDb();
    client = mockserver.agent(app);
  });

  afterEach(async () => {
    await deleteAll(User);
  });

  afterAll(async () => {
    await stopDb(connection, mongod);
  });

  //////////  /api/user/friend/add   /////////////

  test("a POST request to /add with no data in the request body returns error status 400", async () => {
    //given
    const newUser = new User({
      username: "Macska",
      providers: {
        google: 123456,
      },
    });
    await newUser.save();

    const sessionToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    client.set("authorization", sessionToken);

    //when
    const response = await client.post("/api/friend/add");

    //then
    expect(response.status).toBe(400);
    expect(response.text).toBe("All inputs are required!");
  });

  test("a POST request to /add with incorrect userId in authorization token returns error status 400", async () => {
    //given
    const newUser = new User({
      username: "Macska",
      providers: {
        google: 123456,
      },
    });
    await newUser.save();

    const sessionToken = jwt.sign({ userId: "11111" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    client.set("authorization", sessionToken);

    //when
    const response = await client.post("/api/friend/add").send({
      userId: "12345",
    });

    //then
    expect(response.status).toBe(400);
    expect(response.text).toBe("Users not found!");
  });

  test("a POST request to /add with correct authorization token but incorrect userId in the request body returns error status 400", async () => {
    //given
    await User.create({
      username: "Macska",
      providers: {
        google: 123456,
      },
    });
    await User.create({
      username: "Kutya",
      providers: {
        google: 111111,
      },
    });
    const me = await User.findOne({ username: "Macska" });
    const otherPlayer = await User.findOne({ username: "Kutya" });

    const sessionToken = jwt.sign(
      { userId: me._id, providers: me.providers },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    client.set("authorization", sessionToken);

    //when
    const response = await client.post("/api/friend/add").send({
      userId: otherPlayer.id + "11",
    });

    //then
    expect(response.status).toBe(400);
    expect(response.text).toBe("Users not found!");
  });

  test("a POST request to /add with correct authorization token and userId in the request body but friend request already sent returns error status 400", async () => {
    //given

    await User.create({
      username: "Macska",
      providers: {
        google: 123456,
      },
    });
    await User.create({
      username: "Kutya",
      providers: {
        google: 111111,
      },
    });
    const me = await User.findOne({ username: "Macska" });
    const otherPlayer = await User.findOne({ username: "Kutya" });

    me.friends.push({
      friendId: otherPlayer.id,
      friendUsername: "Kutya",
      friendStatus: 1,
    });
    otherPlayer.friends.push({
      friendId: me.id,
      friendUsername: "Macska",
      friendStatus: 0,
    });
    await me.save();
    await otherPlayer.save();

    const sessionToken = jwt.sign(
      { userId: me._id, providers: me.providers },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    client.set("authorization", sessionToken);

    //when
    const response = await client.post("/api/friend/add").send({
      userId: otherPlayer.id,
    });

    //then
    expect(response.status).toBe(400);
    expect(response.text).toBe(
      "You can't befriend a friend, that would be too much!"
    );
  });

  test("a POST request to /add with correct authorization token and userId in the request body and the two users not being friends prior the request, returns status 200 and adds users to the friends array with status:1 for requester and status:0 for requested", async () => {
    //given

    await User.create({
      username: "Macska",
      providers: {
        google: 123456,
      },
    });
    await User.create({
      username: "Kutya",
      providers: {
        google: 111111,
      },
    });
    const me = await User.findOne({ username: "Macska" });
    const otherPlayer = await User.findOne({ username: "Kutya" });

    const sessionToken = jwt.sign(
      { userId: me._id, providers: me.providers },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    client.set("authorization", sessionToken);
    const response = await client.post("/api/friend/add").send({
      userId: otherPlayer.id,
    });

    //when
    const meAgain = await User.findOne({ username: "Macska" });
    const otherPlayerAgain = await User.findOne({ username: "Kutya" });

    //then
    expect(response.status).toBe(200);
    expect(response.text).toBe("YAAAY, you are friends now!");
    expect(meAgain.friends[0].friendUsername).toBe(otherPlayerAgain.username);
    expect(meAgain.friends[0].friendStatus).toBe(1);
    expect(otherPlayerAgain.friends[0].friendUsername).toBe(meAgain.username);
    expect(otherPlayerAgain.friends[0].friendStatus).toBe(0);
  });

  test("a POST request to /add with correct authorization token and userId in the request body and the the requester now accepting the other player's friend request, returns status 200 and changes the friend status to 2 for both requester and requested", async () => {
    //given

    await User.create({
      username: "Macska",
      providers: {
        google: 123456,
      },
    });
    await User.create({
      username: "Kutya",
      providers: {
        google: 111111,
      },
    });
    const me = await User.findOne({ username: "Macska" });
    const otherPlayer = await User.findOne({ username: "Kutya" });

    me.friends.push({
      friendId: otherPlayer.id,
      friendUsername: "Kutya",
      friendStatus: 0,
    });
    otherPlayer.friends.push({
      friendId: me.id,
      friendUsername: "Macska",
      friendStatus: 1,
    });
    await me.save();
    await otherPlayer.save();

    const sessionToken = jwt.sign(
      { userId: me._id, providers: me.providers },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    client.set("authorization", sessionToken);
    const response = await client.post("/api/friend/add").send({
      userId: otherPlayer.id,
    });

    //when
    const meAgain = await User.findOne({ username: "Macska" });
    const otherPlayerAgain = await User.findOne({ username: "Kutya" });

    //then
    expect(response.status).toBe(200);
    expect(response.text).toBe("YAAAY, you are friends now!");
    expect(meAgain.friends[0].friendUsername).toBe(otherPlayerAgain.username);
    expect(meAgain.friends[0].friendStatus).toBe(2);
    expect(otherPlayerAgain.friends[0].friendUsername).toBe(meAgain.username);
    expect(otherPlayerAgain.friends[0].friendStatus).toBe(2);
  });

  //////////  /api/user/friend/remove   /////////////

  test("a POST request to /remove with no data in the request body returns error status 400", async () => {
    //given
    const newUser = new User({
      username: "Macska",
      providers: {
        google: 123456,
      },
    });
    await newUser.save();

    const sessionToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    client.set("authorization", sessionToken);

    //when
    const response = await client.post("/api/friend/remove");

    //then
    expect(response.status).toBe(400);
    expect(response.text).toBe("All inputs are required!");
  });

  test("a POST request to /remove with correct authorization token and userId in the request body but other player's friend status requesters list is 0  returns error status 400", async () => {
    //given

    await User.create({
      username: "Macska",
      providers: {
        google: 123456,
      },
    });
    await User.create({
      username: "Kutya",
      providers: {
        google: 111111,
      },
    });
    const me = await User.findOne({ username: "Macska" });
    const otherPlayer = await User.findOne({ username: "Kutya" });

    me.friends.push({
      friendId: otherPlayer.id,
      friendUsername: "Kutya",
      friendStatus: 0,
    });
    otherPlayer.friends.push({
      friendId: me.id,
      friendUsername: "Macska",
      friendStatus: 1,
    });
    await me.save();
    await otherPlayer.save();

    const sessionToken = jwt.sign(
      { userId: me._id, providers: me.providers },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    client.set("authorization", sessionToken);

    //when
    const response = await client.post("/api/friend/remove").send({
      userId: otherPlayer.id,
    });

    //then
    expect(response.status).toBe(400);
    expect(response.text).toBe(
      "You can't unfriend somebody who's not your friend, that would be too rude!"
    );
  });

  test("a POST request to /remove with correct authorization token and userId in the request body and the the requester and requested being friends (status: 2 and 2), returns status 200 and changes the friend status to 0 for requester and 1 for requested", async () => {
    //given

    await User.create({
      username: "Macska",
      providers: {
        google: 123456,
      },
    });
    await User.create({
      username: "Kutya",
      providers: {
        google: 111111,
      },
    });
    const me = await User.findOne({ username: "Macska" });
    const otherPlayer = await User.findOne({ username: "Kutya" });

    me.friends.push({
      friendId: otherPlayer.id,
      friendUsername: "Kutya",
      friendStatus: 2,
    });
    otherPlayer.friends.push({
      friendId: me.id,
      friendUsername: "Macska",
      friendStatus: 2,
    });
    await me.save();
    await otherPlayer.save();

    const sessionToken = jwt.sign(
      { userId: me._id, providers: me.providers },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    client.set("authorization", sessionToken);

    //when
    const response = await client.post("/api/friend/remove").send({
      userId: otherPlayer.id,
    });

    //then
    expect(response.status).toBe(200);
    expect(response.text).toBe(" You are not friends anymore! :(");
    const meAgain = await User.findOne({ username: "Macska" });
    const otherPlayerAgain = await User.findOne({ username: "Kutya" });
    expect(meAgain.friends[0].friendUsername).toBe(otherPlayerAgain.username);
    expect(meAgain.friends[0].friendStatus).toBe(0);
    expect(otherPlayerAgain.friends[0].friendUsername).toBe(meAgain.username);
    expect(otherPlayerAgain.friends[0].friendStatus).toBe(1);
  });

  test("a POST request to /remove with correct authorization token and userId in the request body and the the requester already sent a request which hasn't yet been accepted (status: 1 and 0), returns status 200 and revokes the friend request, removes both from eachother's friend list", async () => {
    //given

    await User.create({
      username: "Macska",
      providers: {
        google: 123456,
      },
    });
    await User.create({
      username: "Kutya",
      providers: {
        google: 111111,
      },
    });
    const me = await User.findOne({ username: "Macska" });
    const otherPlayer = await User.findOne({ username: "Kutya" });

    me.friends.push({
      friendId: otherPlayer.id,
      friendUsername: "Kutya",
      friendStatus: 1,
    });
    otherPlayer.friends.push({
      friendId: me.id,
      friendUsername: "Macska",
      friendStatus: 0,
    });
    await me.save();
    await otherPlayer.save();

    const sessionToken = jwt.sign(
      { userId: me._id, providers: me.providers },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    client.set("authorization", sessionToken);
    const response = await client.post("/api/friend/remove").send({
      userId: otherPlayer.id,
    });

    //when
    const meAgain = await User.findOne({ username: "Macska" });
    const otherPlayerAgain = await User.findOne({ username: "Kutya" });

    //then
    expect(response.status).toBe(200);
    expect(response.text).toBe(" You are not friends anymore! :(");
    expect(meAgain.friends).toStrictEqual([]);
    expect(otherPlayerAgain.friends).toStrictEqual([]);
  });
});
