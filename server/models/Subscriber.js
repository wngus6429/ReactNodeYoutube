/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscriberSchema = mongoose.Schema(
  {
    userTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    userFrom: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
); //글쓴거 업로드 한거 날짜 적어야 하니까.

const Subscriber = mongoose.model("Subscriber", subscriberSchema);

module.exports = { Subscriber };
