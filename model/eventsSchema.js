const mongoose = require("mongoose");

const userEventSchema = new mongoose.Schema({
  name: String,
  date: Date,
  priceInPennies: Number,
  locationStreet: String,
  locationStreetNumber: Number,
  locationCity: String,
  locationPostcode: String,
  //   {
  //     street: String,
  //     streetNumber: Number,
  //     city: String,
  //     postcode: String,
  //   },
});

const userEventsdb = new mongoose.model(
  "eventplatform.events",
  userEventSchema
);

module.exports = userEventsdb;
