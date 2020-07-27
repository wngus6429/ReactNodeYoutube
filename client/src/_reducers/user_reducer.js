/** @format */
import { LOGIN_USER, REGISTER_USER, AUTH_USER } from "../_actions/types";

export default function (state = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, loginSuccess: action.payload }; //아무것도 없는 위의 state를 가져옴
      break;
    case REGISTER_USER:
      return { ...state, register: action.payload };
      break;
    case AUTH_USER:
      return { ...state, userData: action.payload }; //userData그냥 정해준거.
      //action.payload안에 백엔드 __d, isAdmin, isAuth, email, name, lastname, role, image 가 들어있다.
      break;
    default:
      return state;
  }
}
