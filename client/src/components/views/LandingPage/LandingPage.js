/** @format */

import React, { useEffect } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";

function LandingPage(props) {
  //랜딩페이지 오자마자 밑에꺼 실행, axios.get으로 서버로 보내고
  //index.js 에서 정보를 타고  response로 옴
  useEffect(() => {
    axios.get("/api/hello").then((response) => console.log(response));
  }, []);

  const onClickHandler = () => {
    axios.get("/api/users/logout").then((response) => {
      //console.log(response.data);
      if (response.data.success) {
        props.history.push("/login"); //history는 react-router-dom 의 withRouter를 사용한다.
      } else {
        alert("Logout Fail");
      }
    });
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <h2>시작페이지</h2>
      <button onClick={onClickHandler}>로그아웃</button>
    </div>
  );
}

export default withRouter(LandingPage);
