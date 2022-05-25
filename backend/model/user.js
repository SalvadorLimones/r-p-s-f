const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema({
  friendId: { type: String, required: true },
  friendUsername: { type: String, required: true },
});

const badgeSchema = new mongoose.Schema({
  badgeType: { type: String, required: true },
  badgeAquired: { type: Date, required: true },
});

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  googleID: { type: String, unique: true, required: true },
  online: Boolean,
  friends: [friendSchema],
  badges: [badgeSchema],
});

const User = mongoose.model("user", userSchema);

module.exports = User;
