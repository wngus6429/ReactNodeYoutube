/** @format */

import React, { useEffect } from "react";
import Axios from "axios";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";

export default function (SpecificComponent, option, adminRoute = null) {
  //SpecificComponent 이 appjs의 LandingPage , adminRoute디폴트가 null
  //옵션
  //null => 아무나 출입이 가능한 페이지
  //true => 로그인한 유저만 출입이 가능한페이지
  //false => 로그인한 유저는 출입 불가능한 페이지
  function AuthenticationCheck(props) {
    const dispatch = useDispatch();
    useEffect(() => {
      //auth() 이거를 user_action, auth()안에 백엔드 정보가 담겨있음
      dispatch(auth()).then((response) => {
        console.log(response);

        //로그인 하지 않은 상태
        if (!response.payload.isAuth) {
          //false면 로그인 하지 않은 상태지
          if (option) {
            //if(option === true)
            props.history.push("/login");
          }
        } else {
          //로그인한 상태
          if (adminRoute && !response.payload.isAdmin) {
            props.history.push("/");
          } else {
            if (option === false) {
              props.history.push("/");
            }
          } //로그인 후에 랜딩페이지에서 주소에서 수동으로 로그인 페이지 갈려고 하면 랜딩페이지로 가게된다.
        }
      });
    }, []);
    return <SpecificComponent />;
  }
  return AuthenticationCheck;
}

//백엔드에 request를 날리고 백엔드의 /api/users/auth로 상태를 받아오는 구조임.
//app.js에 보면 HOC적용법이 있음.

//페이지가 이동할때마다 dispatch가 작동해서 계속해서 백엔드에 request를 주는중, 그리고 response를 받지
