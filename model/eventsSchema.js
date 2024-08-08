const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: String,
    date: Date,
    priceInPennies: Number,
    locationStreet: String,
    locationStreetNumber: Number,
    locationCity: String,
    locationPostcode: String,
  },
  {
    timestamps: true,
  }
);

const eventsdb = new mongoose.model("eventplatform.events", eventSchema);

module.exports = eventsdb;
