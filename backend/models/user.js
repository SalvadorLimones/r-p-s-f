const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema({
  friendId: { type: String, required: true },
  friendUsername: { type: String, required: true },
  friendStatus: { type: Number, required: true }, //0 - he/she sent request; 1 - you've sent request; 2 - friends
});

const badgeSchema = new mongoose.Schema({
  badgeType: { type: String, required: true },
  badgeAquired: { type: Date, required: true },
});

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  providers: {
    google: { type: String, unique: true, sparse: true },
    facebook: { type: String, unique: true, sparse: true },
    github: { type: String, unique: true, sparse: true },
  },
  online: Boolean,
  playing: Boolean,
  friends: [friendSchema],
  badges: [badgeSchema],
});

const User = mongoose.model("user", userSchema);

module.exports = User;
