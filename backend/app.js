const express = require("express");
require("express-async-errors");
const cors = require("cors");

const { auth } = require("./middlewares/auth");
const { errorHandler } = require("./middlewares/errorHandler");
const gameRoutes = require("./routes/game");
const userRoutes = require("./routes/user");
const friendRoutes = require("./routes/friend");
const morgan = require("morgan");

const app = express();

app.use(cors());
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
app.get("/api/private", auth({ block: true }), (req, res) => {
  console.log("private");
  res.send(`Hello Private world, your user id is: ${res.locals.user} !`);
});
app.get("/api/prublic", auth({ block: false }), (req, res) => {
  console.log("private");
  if (!res.locals.user)
    return res.send("Hello Prublic World, you're not logged in ! ");
  res.send(`Hello Prublic World, your user id is: ${res.locals.user} !`);
});

app.use(errorHandler);

module.exports = app;
