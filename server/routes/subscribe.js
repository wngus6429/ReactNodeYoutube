/** @format */

const express = require("express");
const router = express.Router();
const { Subscriber } = require("../models/Subscriber");

//=================================
//             Subscribe
//=================================

router.post("/subscribeNumber", (req, res) => {
  Subscriber.find({ userTo: req.body.userTo }).exec((err, subscribe) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, subscribeNumber: subscribe.length });
  });
});

router.post("/subscribed", (req, res) => {
  Subscriber.find({
    userTo: req.body.userTo,
    userFrom: req.body.userForm,
  }).exec((err, subscribe) => {
    if (err) return res.status(400).send(err);
    let result = false;
    if (subscribe.length !== 0) {
      //length가 0이 아니라면 있는거니까. 0은 구독 안하고 있는거지
      result = true; //구독하고 있는거
    }
    res.status(200).json({ success: true, subscribed: result });
  });
});
//userTo랑 userFrom 둘다 포함되는게 있으면 내가 이 사람을 구독하고 있다는거. subscribe length 가 1만 되어도 이걸 구독하고 있다는거고 없으면 구독하고 있지 않은거겟지
//.exec((err, subscribe) 의 뒤 subscribe에는 userTo를 구독하는 모든 케이스가 있다.

router.post("/unSubscribe", (req, res) => {
  //맨 앞은 모델을 가져오는거
  Subscriber.findOneAndDelete({ userTo: req.body.userTO, userFrom: req.body.userFrom }).exec(
    (err, doc) => {
      //Subscriber 모델에서 가져온 doc
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).json({ success: true, doc });
    }
  );
});

router.post("/subscribe", (req, res) => {
  //맨 앞은 모델을 가져오는거
  const subscribe = new Subscriber(req.body); //body안에 userTO와 userFrom이 있겟지
  subscribe.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

module.exports = router;
