const eventsdb = require("../model/eventsSchema");

const getEvents = (req, res) => {
  let events = [];
  eventsdb
    .find()
    .then((data) => {
      events = data;
    })
    .then(() => {
      res.json(events);
    });
};

module.exports = getEvents;
