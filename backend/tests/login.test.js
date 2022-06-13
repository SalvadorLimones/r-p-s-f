require("dotenv").config();
const app = require("../app");
const mockserver = require("supertest");
const User = require("../models/user");
const { startDb, stopDb, deleteAll } = require("./util/inMemoryDb");
const jwt = require("jsonwebtoken");
const {
  setupGoogleSuccessResponse,
  setupGoogleErrResponse,
} = require("./util/httpMock");

describe("/api/user/login test", () => {
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

  test("returns status 400, when payload is missing", async () => {
    //given

    //when
    const response = await client.post("/api/user/login");

    //then
    expect(response.status).toBe(400);
  });

  test("returns status 400, when payload.code is missing", async () => {
    //given
    const provider = "github";

    //when
    const response = await client.post("/api/user/login").send({
      provider: provider,
    });

    //then
    expect(response.status).toBe(400);
  });

  test("returns status 400, when payload.provider is missing", async () => {
    //given
    const code = "random";

    //when
    const response = await client.post("/api/user/login").send({
      code: code,
    });

    //then
    expect(response.status).toBe(400);
  });

  test("returns status 400, when payload.provider is incorrect", async () => {
    //given
    const code = "random";
    const provider = "facse";

    //when
    const response = await client.post("/api/user/login").send({
      code: code,
      provider: provider,
    });

    //then
    expect(response.status).toBe(400);
  });

  test("returns status 200 when correct payload/code is sent (user not created)", async () => {
    //given
    const code = "random";
    const provider = "google";
    const googleUserId = "123456";
    setupGoogleSuccessResponse(googleUserId);

    //when
    const response = await client.post("/api/user/login").send({
      code,
      provider,
    });

    //then
    expect(response.status).toBe(200);
    const responseToken = jwt.decode(response.body.sessionToken);
    expect(responseToken.providers.google).toBe(googleUserId);
    const users = await User.find();
    expect(users).toStrictEqual([]);
  });

  test("returns status 401 when invalid code is sent (user not created)", async () => {
    //given
    const code = "random";
    const provider = "google";

    setupGoogleErrResponse();

    //when
    const response = await client.post("/api/user/login").send({
      code: code,
      provider: provider,
    });

    //then
    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({});
  });
});
