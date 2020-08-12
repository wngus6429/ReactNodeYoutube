/** @format */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, //trim은 space 공간을 없애주는 역할을 함. s p
    unique: 1, //똑같은 이메일 못 적게 유니크
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0, //아무것도 안하면 0을 줌
  }, //어떤 유저가 관리자가 되는지, 일반 유저가 되는지
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  }, //토큰 유효기한
});

//비밀번호 암호화  npm install bcrypt
//몽구스에서 가져온 메소드
userSchema.pre("save", function (next) {
  var user = this;
  //비밀번호를 바꿀때만 해쉬처리 해야해서 if 로 조건, 모델 필드중 password가 변환될때만 bcrypt사용
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err); //에러가 나면 user.js의 10로 보내버림
      bcrypt.hash(user.password, salt, function (err, hash) {
        //user.password는 위에 var user = this 를 참조, DB 에 있는 비밀번호를 가져옴
        if (err) return next(err);
        user.password = hash; //user.password를 hash로 덮어씌움
        next();
      });
    });
  } else {
    //비밀번호를 바꾸는게 아니라 다른거 바꿀떄는 그냥 next 해줘야함, 아니면 위에서 머뭄
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  //plainPassword 1234567, 암호화된 비밀번호 $2b$10$nNI6z1gDS
  //앞에 비밀번호를 해쉬화 해서 데이터 베이스에 있는 복잡한 문자, 해쉬 비밀번호랑 비교해야함
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    //비밀번호가 같지 않다. 콜백 cb(err)를 줌, 그리고 비밀번호가 비교후 같다.
    //에러 없고(null), isMatch가 true가 되고, indexjs 53으로
    if (err) return cb(err); //실패한거, false
    cb(null, isMatch); //이게 성공한거, true
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this; //es5쓰는 중이니까 var를 사용하자.
  //jsonwebtoekn을 이용해서 token을 생성하기.
  var token = jwt.sign(user._id.toHexString(), "secretToken"); //.id는 몽고 DB안에 있는 id임 자동생성인듯 , secretToken 임의 지정
  //user._id + "secretToken" = token; //위에 토큰관련 schema가 있다.
  user.token = token; //위에 token 데이터베이스에 넣어주고 저장
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user); //뒤 user에서 index.js로 정보 전달. //앞에 null은 에러 없다고 위에 err, user 두개 인자 같이
  });
}; //cb는 콜백

userSchema.statics.findByToken = function (token, cb) {
  var user = this;
  //  user._id + "secretToken" = token;
  //토큰을 decode 한다.
  jwt.verify(token, "secretToken", function (err, decoded) {
    //유저 아이디를 이용해서 유저를 찾은 다음에
    //클라이언트에서 가져온 token 과 DB에 보관된 토큰이 일치하는지 확인
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err); //findOne 몽고 DB
      cb(null, user); //에러가 없다면 유저 정보를 전달
    });
  });
};

const User = mongoose.model("User", userSchema);
//Schema를 모델로 감싸줘야함.

//다른곳에서도 쓸수 있게 export
module.exports = { User };
