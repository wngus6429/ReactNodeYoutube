/** @format */

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../_actions/user_action";

function LoginPage(props) {
  const dispatch = useDispatch();

  const [Email, setEmail] = useState(""); //뒷 괄호는 처음에는 무엇인가 하는것, 당연 빈칸
  const [Password, setPassword] = useState("");

  const onEmailHandler = (event) => setEmail(event.currentTarget.value);

  const onPasswordHandler = (event) => setPassword(event.currentTarget.value);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    let body = { email: Email, password: Password };
    dispatch(loginUser(body)).then((response) => {
      //user_action으로 넘어감
      //dispatch 로그인 한 다음에 다음 화면으로 넘어가야지?
      if (response.payload.loginSuccess) {
        window.localStorage.setItem("userId", response.payload.userId);
        props.history.push("/");
      } else {
        alert("Error");
      }
    });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center",
                  width: "100%", height: "100vh", }}  >
      <form style={{ display: "flex", flexDirection: "column" }}
            onSubmit={onSubmitHandler}  >
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <label>Password</label>
        <input type="Password" value={Password} onChange={onPasswordHandler} />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
