/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema(
  {
    writer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    videoId: {
      //videoId로 해도됨
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    responseTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
    },
  },
  { timestamps: true }
); //글쓴거 업로드 한거 날짜 적어야 하니까.

const Comment = mongoose.model("Comment", commentSchema);

module.exports = { Comment };
