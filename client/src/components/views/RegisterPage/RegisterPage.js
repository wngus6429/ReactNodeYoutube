/** @format */

import React, { useState } from "react"; //여기서는 axios 필요없음. 그냥 정보를 보내는거니.
import { useDispatch } from "react-redux";
import { registerUser } from "../../../_actions/user_action";
import { withRouter } from "react-router-dom";

function RegisterPage(props) {
  const dispatch = useDispatch();

  const [Email, setEmail] = useState(""); //뒷 괄호는 처음에는 무엇인가 하는것, 당연 빈칸
  const [Password, setPassword] = useState("");
  const [Name, setName] = useState("");
  const [LastName, setLastName] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };
  const onNameHandler = (event) => {
    setName(event.currentTarget.value);
  };
  const onLastNameHandler = (event) => {
    setLastName(event.currentTarget.value);
  };
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };
  const onConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.currentTarget.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (Password !== ConfirmPassword) {
      return alert("Password Check Please");
    }

    let body = {
      email: Email,
      name: Name,
      lastname: LastName,
      password: Password,
      confirmpassword: ConfirmPassword,
    };
    dispatch(registerUser(body)).then((response) => {
      //dispatch 로그인 한 다음에 다음 화면으로 넘어가야지?
      if (response.payload.success) {
        props.history.push("/login");
      } else {
        alert("Fail to Sign up");
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
      <form
        style={{ display: "flex", flexDirection: "column" }}
        action=""
        onSubmit={onSubmitHandler}
      >
        <label htmlFor="">Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <label htmlFor="">Name</label>
        <input type="text" value={Name} onChange={onNameHandler} />
        <label htmlFor="">LastName</label>
        <input type="text" value={LastName} onChange={onLastNameHandler} />
        <label htmlFor="">Password</label>
        <input type="Password" value={Password} onChange={onPasswordHandler} />
        <label htmlFor="">Confirm Password</label>
        <input type="Password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />

        <br />

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default withRouter(RegisterPage);
