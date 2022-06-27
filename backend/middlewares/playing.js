const Game = require("../models/game");

exports.playing = () => async (req, res, next) => {
  const myId = res.locals.user.userId;
  const alreadyPlaying = await Game.findOne({
    $or: [
      {
        $and: [{ "playerOne.id": myId }, { finished: null }],
      },
      {
        $and: [
          { "playerTwo.id": myId },
          { finished: null },
          { started: { $not: { $eq: null } } },
        ],
      },
    ],
  });
  if (alreadyPlaying)
    return res
      .status(401)
      .send("You can't play more than one game in the same time!");
  next();
};
