const mongoose = require("mongoose");

const DB = process.env.DATABASE;

mongoose
  .connect(DB)
  .then(() => {
    console.log("database connection");
  })
  .catch((err) => {
    console.log("Error: ", err);
  });
