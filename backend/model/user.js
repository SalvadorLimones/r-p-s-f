const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  google_access_token: { type: String, unique: true },
  online: Boolean,
  badges: [
    {
      badge_type: String,
      badge_aquired: Date,
    },
  ],
});

const User = mongoose.model("user", userSchema);

module.exports = User;
