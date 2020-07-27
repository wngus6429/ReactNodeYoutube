/** @format */
//combineReducers는 여러 Reducer들을 하나로 모아줌.
//(User, Post, Comment, Subscribe 등등)
import { combineReducers } from "redux";
import user from "./user_reducer";
//import comment from "./comment_reducer";

const rootReducer = combineReducers({
  user,
});

export default rootReducer;
