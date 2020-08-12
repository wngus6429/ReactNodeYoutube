/** @format */
const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { User } = require("../models/User"); //모델 불러옴

router.post("/register", (req, res) => {
  const user = new User(req.body);
  //userSchema.pre 작동
  user.save((err, userInfo) => {
    //이건 몽고DB에서 오는 메소드
    if (err) return res.json({ success: false, err }); //에러가 있으면 전달, 뒤 err가 에러메세지 전달 내용
    return res.status(200).json({ success: true, userInfo }); //status(200)이건 성공했다는 거임
  }); //회원가입할때 필요한 정보들은 client에서 가져오면 그것들은 데이터베이스에 넣어준다.
});

router.post("/login", (req, res) => {
  //요청된 이메일을 데이터베이스에 있는지 확인한다. findOne은 몽고DB의 메소드임
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      //해당하는 유저가 없을경우, user 이름 마음대로
      return res.json({ loginSuccess: false, message: "This Email not Correct" });
    }
    //요청한 이메일이 DB에 있으면 비밀번호가 맞는 비밀번호 인지 확인, compare이건 이름 자유임. 단 User.js도 바꾸기
    user.comparePassword(req.body.password, (err, isMatch) => {
      //user.comparePassword User.js 모델 확인. !isMatch 비밀번호가 틀렸다는거
      if (!isMatch) return res.json({ loginSuccess: false, message: "Password Not Correct" });
      //비밀번호 까지 맞다면 토큰을 생성하기 //npm install jsonwebtoken
      user.generateToken((err, user) => {
        //gen이름 마음대로 , userSchema.methods.generateToken 에러 결과값이 뒤 user로 들어옴
        if (err) return res.status(400).send(err); //400은 에러
        //토큰을 저장한다. 어디에? 쿠키, 로컬스토리지 F12 눌르면 Local storage랑 쿠키 있음, 여기서는 쿠키, 로컬도 장점있고 다 그런거지
        //cookie-parser 필요함
        res.cookie("x_auth", user.token).status(200).json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

router.get("/auth", auth, (req, res) => {
  //중간 auth 에서 로그인한 유저인지 판별 들웨어를 통과해 왔다는 이야기는 Authentication 이 True라는 말.
  res.status(200).json({
    _id: req.user._id, // 이게 가능한 이유는 Auth.js 15에서 했기 때문
    isAdmin: req.user.role === 0 ? false : true, //Role 1 어드민, ROle 2 특정부서어드민, Role 0 일반유저
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

//왜 토큰을 지워주냐면, 전 시간 Auth 할때, 인증 할때 클라이언트 쿠키의 토큰을 가져와서 ,
//왼쪽 데이터베이스 토큰과 같은지 확인해서 인증을 시킴
//만약 토큰이 데이터베이스에 없으면 클라이언트 토큰이랑 맞지 않아서 인증이 안되는 방식으로 하는거임
router.get("/logout", auth, (req, res) => {
  // req.user._id 는 auth, 15 에서 왔다.console.log("logout req.user", req.user);
  User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({ success: true });
  });
});

module.exports = router;
