const User = require("../models/user");

exports.find = () => async (req, res, next) => {
  const myId = res.locals.user.userId;
  const otherId = req.body.userId;

  if (!(myId && otherId))
    return res.status(400).send("All inputs are required!");
  if (myId === otherId)
    return res.status(400).send("You are already your friend!");

  try {
    const me = await User.findById(myId);
    const otherPlayer = await User.findById(otherId);
    const myFriend = me.friends.find((friend) => friend.friendId === otherId);
    const iAmFriend = otherPlayer.friends.find(
      (friend) => friend.friendId === myId
    );

    res.locals.me = me;
    res.locals.otherPlayer = otherPlayer;
    res.locals.myFriend = myFriend;
    res.locals.iAmFriend = iAmFriend;
    next();
  } catch {
    return res.status(400).send("Users not found!");
  }
};
