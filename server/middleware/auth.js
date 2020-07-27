/** @format */

const { User } = require("../models/User");

//인증 처리를 하는곳, 로그인 하면 토큰을 주는거고, 로그아웃 하면 토큰 ""가 되는거
let auth = (req, res, next) => {
  //클라이언트 쿠키에서 토큰을 가져옴
  let token = req.cookies.x_auth;
  //토큰을 복호화 한 후 유저를 찾는다
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });
    //유저가 있으면
    req.token = token;
    req.user = user;
    next(); //next로 인해 미들웨어 진행으로 index.js 68줄 가운데 에서 계속 진행
  });
  //유저가 있으면 인증 OK
  //유저가 없으면 인증 NO
};

module.exports = { auth };
