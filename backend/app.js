const express = require("express");
require("express-async-errors");
const cors = require("cors");

const { errorHandler } = require("./middlewares/errorHandler");
const gameRoutes = require("./routes/game");
const userRoutes = require("./routes/user");
const friendRoutes = require("./routes/friend");
const morgan = require("morgan");

const app = express();

app.use(
  cors({
    origin: process.env.APP_URL,
  })
);
app.use(express.json());

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.use("/api/game", gameRoutes);
app.use("/api/user", userRoutes);
app.use("/api/friend", friendRoutes);

app.get("/api/public", (req, res) => {
  console.log("public");
  res.send("Hello Public World ! ");
});

app.use(errorHandler);

module.exports = app;
