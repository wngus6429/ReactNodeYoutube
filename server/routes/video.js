/** @format */

const express = require("express");
const router = express.Router();
const { Video } = require("../models/Video");
const { auth } = require("../middleware/auth");
const { Subscriber } = require("../models/Subscriber");
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");
// const { default: Subscribe } = require("../../client/src/components/views/VideoDetailPage/Section/Subscribe");

let storage = multer.diskStorage({
  //destination 파일 어디에 저장할지. 최상위 upload 폴더 안에
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  //저장할때 파일 이름 지정, 오늘이랑 파일이름
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  //mp4만 가능하게 , 더 추가도 가능함
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".mp4") {
      return cb(res.status(400).end("Only jpg, png, mp4 is allowed"), false);
    }
    cb(null, true);
  },
});

const upload = multer({ storage: storage }).single("file");

//=================================
//             Video
//=================================

//api/video/uploadfiles 앞에 지운 이유는 index.js 18줄에서 이미 앞에걸 적었기 때문이다.
router.post("/uploadfiles", (req, res) => {
  //비디오를 서버에 저장한다 npm install multer
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err }); //alert("Video Upload Failed")로 감
    } //밑에는 성공시
    return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename });
    //뒤에 url은 파일의 경로를 클라이언트로 보내주는거임
  });
});
//req를 통해서 VideoUploadPage.js에서 파일 보낸걸 받는다.

router.get("/getVideos", (req, res) => {
  //비디오를 DB에서 가져와서 클라이언트에게 보낸다.(보여준다)
  //find()는 몽고DB 메소드. 뒤에 populate 해야함.
  Video.find()
    .populate("writer")
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videos });
    });
});

router.post("/getVideoDetail", (req, res) => {
  //populate로 writer 기준으로 있는 정보 다 긁어옴 , 뒤에 exec videoDetail 보내느거지
  Video.findOne({ _id: req.body.videoId })
    .populate("writer")
    .exec((err, videoDetail) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, videoDetail }); //videoDetail정보를 보내는거지
    });
});

router.post("/uploadVideo", (req, res) => {
  //몽고 DB에 비디오 정보들을 저장한다. //const { Video } = require("../models/Video"); 불러옴
  const video = new Video(req.body); //클라이언트에서 보낸 variables의 모든 정보를 받음.
  //아래 save는 MongoDb 메소드임. 넣고 에러가 있을수 있으니 또 if 문 적어줌 콜백
  video.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

router.post("/getSubscriptionVideos", (req, res) => {
  //자신의 아이디를 가지고 구독하는 사람들을 찾는다.
  Subscriber.find({ userFrom: req.body.userFrom }).exec((err, subscribers) => {
    if (err) return res.status(400).send(err);

    let subscribedUser = [];

    subscribers.map((subscriber, i) => {
      subscribedUser.push(subscriber.userTo);
    });

    //찾은 사람들의 비디오를 가지고 온다. 위에 81의 subscriberUser가 복수 일수 있으니, req.body.id 이건 한명
    //몽고 DB의 새로운 기능, subscriberUser에 여러명 들어있어도 들어있는 모든 사람들의 ID를 가지고 writer를 찾을수 잇다
    //populate는 앞에 id 밖에 없으니까. 여러 정보를 가져오기 위해
    Video.find({ writer: { $in: subscribedUser } })
      .populate("writer")
      .exec((err, videos) => {
        if (err) return res.status(400).send(err);
        res.status(200).json({ success: true, videos });
      });
  });
});

//api/video/thumbnail 앞에 지운 이유는 index.js 18줄에서 이미 앞에걸 적었기 때문이다.
router.post("/thumbnail", (req, res) => {
  //썸네일 생성 하고 비디오 러닝타임도 가져오기
  let filePath = "";
  let fileDuration = "";

  //비디오 정보 가져오기
  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    console.dir(metadata);
    console.log(metadata.format.duration);
    fileDuration = metadata.format.duration;
  });
  //썸네일 생성
  ffmpeg(req.body.url) //클라이언트에서 온 비디오 저장 경로를 가져옴 그리고 파일내역 생성
    .on("filenames", function (filenames) {
      console.log("Will generate" + filenames.join(","));
      console.log(filenames);
      filePath = "uploads/thumbnails/" + filenames[0];
    })
    .on("end", function () {
      //섬네일을 생성하고 무엇을 할건지
      console.log("Screentshots taken");
      return res.json({
        //성공
        success: true,
        url: filePath, //섬네일 저장경로
        fileDuration: fileDuration, //파일 러닝타임
      });
    })
    .on("error", function (err) {
      //에러시 어떻게 할건지
      console.log(err);
      return res.json({ success: false, err });
    })
    .screenshots({
      //스크린샷 옵션
      count: 3, //3개의 섬네일
      folder: "uploads/thumbnails", // 섬네일 저장경로
      size: "320x240",
      //'%b': input basename (filename w/o extention)
      filename: "thumbnail-%b.png",
    });
});

//4분 48초

module.exports = router;
