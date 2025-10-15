const mongoose = require("mongoose");

const cardAccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // you can change to true if users are required
  },
  account_id: String,
  name: String,
  type: String,
  subtype: String,
  mask: String,
  balances: {
    available: Number,
    current: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CardAccount", cardAccountSchema);
