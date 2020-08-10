/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likeSchema = mongoose.Schema(
  {
    userId: {
      //누가 like을 눌럿는지
      type: Schema.Types.ObjectId,
      ref: "User", //유저모델 파일이라 생각해
    },
    commentId: {
      //코멘트 like
      type: Schema.Types.ObjectId,
      ref: "Comment", //코멘트 모델 파일이라 생각해
    },
    videoId: {
      //비디오 like
      type: Schema.Types.ObjectId,
      ref: "Video", //비디오 모델 파일이라 생각하셈
    }, //ref는 한마디로 그 모델을 불러오는거임.
  },
  { timestamps: true }
); //글쓴거 업로드 한거 날짜 적어야 하니까.

const Like = mongoose.model("Like", likeSchema);

module.exports = { Like };
