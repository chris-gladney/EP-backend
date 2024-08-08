const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    user: String,
    pwd: String,
    role: Number
  },
  { timestamps: true }
);

const admindb = new mongoose.model(
  "EventPlatform.admin",
  adminSchema
);

module.exports = admindb;