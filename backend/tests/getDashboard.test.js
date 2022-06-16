require("dotenv").config();
const app = require("../app");
const mockserver = require("supertest");
const User = require("../models/user");
const { startDb, stopDb, deleteAll } = require("./util/inMemoryDb");
const jwt = require("jsonwebtoken");

describe("/api/dashboards GET tests", () => {
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
  /* 
  test("returns an empty list for new users", async () => {
    //given
    const newUser = new User({
      username: "Macska",
      email: "ggg@ggg.gg",
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
    const response = await client.get("/api/dashboards");

    //then
    expect(response.status).toBe(200);
    const responseData = response.body;
    expect(responseData.user.dashboards).toStrictEqual([]);
  });

  test("deleted user get returns nothing", async () => {
    //given

    const newUser = new User({
      username: "Macska",
      email: "ggg@ggg.gg",
      providers: {
        google: 123456,
      },
    });
    await newUser.save();
    const sessionToken = jwt.sign(
      { userId: newUser._id, providers: newUser.providers },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    client.set("authorization", sessionToken);
    await User.deleteMany();

    //when
    const response = await client.get("/api/dashboards");

    //then
    expect(response.status).toBe(200);
    expect(response.body.user).toBeNull();
  }); */
});
