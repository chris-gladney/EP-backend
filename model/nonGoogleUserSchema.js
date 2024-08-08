const mongoose = require("mongoose");

const nonGoogleUserSchema = new mongoose.Schema(
  {
    user: String,
    pwd: String,
    userEvents: [],
    accessToken: String,
    refreshToken: String,
    role: Number,
  },
  { timestamps: true }
);

const nonGoogleUserdb = new mongoose.model(
  "EventPlatform.usernameUsers",
  nonGoogleUserSchema
);

module.exports = nonGoogleUserdb;
