const { _instance } = require("../../utils/http");
const axiosMockAdapter = require("axios-mock-adapter");
const jwt = require("jsonwebtoken");

const mock = new axiosMockAdapter(_instance);

const setupGoogleSuccessResponse = (sub) => {
  const token = jwt.sign({ sub }, "secret");
  mock
    .onPost("https://oauth2.googleapis.com/token")
    .replyOnce(200, { id_token: token });
};

const setupGoogleErrResponse = () => {
  mock.onPost("https://oauth2.googleapis.com/token").replyOnce(401);
};

module.exports = {
  setupGoogleSuccessResponse,
  setupGoogleErrResponse,
};
