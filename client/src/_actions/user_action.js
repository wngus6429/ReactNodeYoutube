/** @format */

import axios from "axios";
import { LOGIN_USER, REGISTER_USER, AUTH_USER } from "./types";

export function loginUser(dataToSubmit) {
  const request = axios.post("/api/users/login", dataToSubmit).then((response) => response.data);
  //.then에서 서버에서 처리를 해서 반응을 주는거임
  return { type: LOGIN_USER, payload: request };
}

//post 뒤에 주소는 index.js 에 있는 거랑 일치시켜야함.

export function registerUser(dataToSubmit) {
  const request = axios.post("/api/users/register", dataToSubmit).then((response) => response.data);
  //.then에서 서버에서 처리를 해서 반응을 주는거임
  return { type: REGISTER_USER, payload: request };
}

export function auth() {
  //get이라서 위에처럼 dataToSubmit이 필요없음
  const request = axios.get("/api/users/auth").then((response) => response.data);
  //.then에서 서버에서 처리를 해서 반응을 주는거임
  return { type: AUTH_USER, payload: request };
}
