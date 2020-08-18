/** @format */
const express = require("express");
const app = express();
const bodyParser = require("body-parser"); //정보 넘기고 받기 위해 body parser
const cookieParser = require("cookie-parser");
const config = require("./config/key"); //보안처리 불러옴
//bodyparser는 클라이언트에서 오는 정보를 서버에서 분석해서 가져올수있게 해줌
//application/x-www-form- 이런걸 분석해서 가져옴
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); //json타입을 분석해서 가져올수 잇게함
//////////////////////////////////////////////////////////////////////////////////////////////
app.use(cookieParser());
//////////////////////////////////////////////////////////////////////////////////////////////
app.use("/api/users", require("./routes/users"));
app.use("/api/video", require("./routes/video")); //이게 있어야 routes 파일 접근가능
app.use("/api/subscribe", require("./routes/subscribe")); //이게 있어야 routes 파일 접근가능
app.use("/api/comment", require("./routes/comment"));
app.use("/api/like", require("./routes/like"));
//////////////////////////////////////////////////////////////////////////////////////////////
app.use("/uploads", express.static("uploads"));
//이거 있어야함, 이미지, CSS 파일 및 JavaScript 파일과 같은 정적 파일을 제공하려면
//Express의 기본 제공 미들웨어 함수인 express.static을 사용하십시오.
//////////////////////////////////////////////////////////////////////////////////////////////
//mongoose는 MongoDb 연결 담당임, 뒤에 {useNew, Unified, useCre 등등 적어줘야 에러 안남}
//.then()은 앞에 부분이 실행이 끝나면 호출됨. catch로 에러 잡기
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
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  //set static folder
  //All the javascript and css files will be read and served from this folder
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () =>
  console.log(
    `Connection Success Click = (React/ http://localhost:3000 )(Server/ http://localhost:5000)`
  )
);
/////////////////////////////////////////////////////////////////////////////////////////////
app.get("/", (req, res) => {
  res.send("여기는 서버 반응, http://localhost:3000 로 가세요");
});
