const User = require("../../models/user");

const storeOnePlayer = async () => {
  await User.create({
    username: "Macska",
    providers: {
      google: 111111,
    },
  });
};
const storeTwoPlayers = async () => {
  await User.create({
    username: "Macska",
    providers: {
      google: 111111,
    },
  });

  await User.create({
    username: "Kutya",
    providers: {
      google: 222222,
    },
  });
};

module.exports = { storeOnePlayer, storeTwoPlayers };
