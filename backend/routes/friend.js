const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { find } = require("../middlewares/findUsers");

//friend
router.post("/add", auth({ block: true }), find(), async (req, res) => {
  const { me, otherPlayer, myFriend, iAmFriend } = res.locals;

  if (myFriend?.friendStatus === 1 || myFriend?.friendStatus === 2) {
    return res
      .status(400)
      .send("You can't befriend a friend, that would be too much!");
  }

  if (!myFriend) {
    me.friends.push({
      friendId: otherPlayer.id,
      friendUsername: otherPlayer.username,
      friendStatus: 1,
    });

    otherPlayer.friends.push({
      friendId: me.id,
      friendUsername: me.username,
      friendStatus: 0,
    });
  }

  if (myFriend?.friendStatus === 0) {
    myFriend.friendStatus = 2;
    iAmFriend.friendStatus = 2;
  }

  me.save();
  otherPlayer.save();

  return res.status(200).send("YAAAY, you are friends now!");
});

//unfriend
router.post("/remove", auth({ block: true }), find(), async (req, res) => {
  const { me, otherPlayer, myFriend, iAmFriend } = res.locals;

  if (myFriend?.friendStatus === 0 || !myFriend) {
    return res
      .status(400)
      .send(
        "You can't unfriend somebody who's not your friend, that would be too rude!"
      );
  }

  if (myFriend.friendStatus === 1) {
    me.friends = me.friends.filter(
      (friend) => friend.friendId !== otherPlayer.id
    );
    otherPlayer.friends = otherPlayer.friends.filter(
      (friend) => friend.friendId !== me.id
    );
  }

  if (myFriend.friendStatus === 2) {
    myFriend.friendStatus = 0;
    iAmFriend.friendStatus = 1;
  }

  me.save();
  otherPlayer.save();

  return res.status(200).send(" You are not friends anymore! :(");
});

module.exports = router;
