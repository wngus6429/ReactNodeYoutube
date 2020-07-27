/** @format */
const express = require("express");
const app = express();
const bodyParser = require("body-parser"); //정보 넘기고 받기 위해 body parser
const cookieParser = require("cookie-parser");
const config = require("./config/key"); //보안처리 불러옴
const { auth } = require("./middleware/auth");
const { User } = require("./models/User"); //모델 불러옴

//bodyparser는 클라이언트에서 오는 정보를 서버에서 분석해서 가져올수있게 해줌
//application/x-www-form- 이런걸 분석해서 가져옴
app.use(bodyParser.urlencoded({ extended: true }));
//application/json 가져옴
app.use(bodyParser.json());
app.use(cookieParser());
//mongoose는 MongoDb 연결 담당임, 뒤에 {useNew, Unified, useCre 등등 적어줘야 에러 안남}
//.then()은 앞에 부분이 실행이 끝나면 호출됨. catch로 에러 잡기
//////////////////////////////////////////////////////////////////////////////////////////////
const mongoose = require("mongoose");
mongoose
  .connect(config.MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB connect Success"))
  .catch((error) => console.log(error));
/////////////////////////////////////////////////////////////////////////////////////////////

app.get("/", (req, res) => {
  res.send("Hello World Park Juhyun さま");
});

app.get("/api/hello", (req, res) => {
  res.send("안녕하세요~~");
});

app.post("/api/users/register", (req, res) => {
  const user = new User(req.body);
  //밑에 이건 몽고DB에서 오는 메소드
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err }); //에러가 있으면 전달, 뒤 err가 에러메세지 전달 내용
    return res.status(200).json({ success: true }); //status(200)이건 성공했다는 거임
  });
  //회원가입할때 필요한 정보들은 client에서 가져오면 그것들은 데이터베이스에 넣어준다.
});

app.post("/api/users/login", (req, res) => {
  //요청된 이메일을 데이터베이스에 있는지 확인한다. findOne은 몽고DB의 메소드임
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      //해당하는 유저가 없을경우
      return res.json({ loginSuccess: false, message: "제공된 이메일에 해당하는 유저가 없습니다." });
    }
    //요청한 이메일이 DB에 있으면 비밀번호가 맞는 비밀번호 인지 확인, compare이건 이름 자유임. 단 User.js도 바꾸기
    user.comparePassword(req.body.password, (err, isMatch) => {
      //!isMatch 비밀번호가 틀렸다는거
      if (!isMatch) return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다" });
      //비밀번호 까지 맞다면 토큰을 생성하기
      user.generateToken((err, user) => {
        //gen이름 마음대로 , user.js 73 뒤에서 받은 내용이 여기 뒤 user로 들어옴
        if (err) return res.status(400).send(err); //400은 에러
        //토큰을 저장한다. 어디에? 쿠키, 로컬스토리지 F12 눌르면 Local storage랑 쿠키 있음, 여기서는 쿠키, 로컬도 장점있고 다 그런거지
        res.cookie("x_auth", user.token).status(200).json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.get("/api/users/auth", auth, (req, res) => {
  //중간 auth 에서 로그인한 유저인지 판별 들웨어를 통과해 왔다는 이야기는 Authentication 이 True라는 말.
  //
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

app.get("/api/users/logout", auth, (req, res) => {
  // console.log('req.user', req.user)
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

const port = 5000;

app.listen(port, () => console.log(`Connection Success Click = ( http://localhost:${port} )`));
