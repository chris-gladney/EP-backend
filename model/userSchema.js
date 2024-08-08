const mongoose = require("mongoose");

const userEventSchema = new mongoose.Schema({
  name: String,
  date: Date,
  priceInPennies: Number,
  locationStreet: String,
  locationStreetNumber: Number,
  locationCity: String,
  locationPostcode: String,
});

const userSchema = new mongoose.Schema(
  {
    googleId: String,
    displayName: String,
    email: String,
    image: String,
    userEvents: [],
    accessToken: String,
    role: Number,
  },
  { timestamps: true }
);

const userdb = new mongoose.model("eventplatform.users", userSchema);

module.exports = userdb;
