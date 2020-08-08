/** @format */

const express = require("express");
const router = express.Router();
const { Comment } = require("../models/Comment");

//=================================
//             Comment
//=================================

router.post("/saveComment", (req, res) => {
  const comment = new Comment(req.body);
  comment.save((err, comment) => {
    if (err) return res.json({ success: false, err });
    //comment 안에는 writer에 id밖에 없으니. 다른것도 가져와야함.
    //위에서 save 하면 populate를 할수 없기 떄문에 대안으로 Comment 모델에서 찾아버리는거
    Comment.find({ _id: comment._id }) //comment
      .populate("writer")
      .exec((err, result) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({ success: true, result }); //성공
      });
  });
});

router.post("/getComments", (req, res) => {
  Comment.find({ videoId: req.body.videoId })
    .populate("wrtier")
    .exec((err, comments) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, comments });
    });
});

module.exports = router;
