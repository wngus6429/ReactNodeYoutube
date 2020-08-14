/** @format */

import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import LandingPage from "./components/views/LandingPage/LandingPage.js";
import LoginPage from "./components/views/LoginPage/LoginPage.js";
import RegisterPage from "./components/views/RegisterPage/RegisterPage.js";
import Auth from "./hoc/auth";
import VideoUploadPage from "./components/views/VideoUploadPage/VideoUploadPage";
import VideoDetailPage from "./components/views/VideoDetailPage/VideoDetailPage";
import subscription from "./components/views/SubscriptionPage/SubscriptionPage";
import Footer from "./components/views/Footer/Footer.js";
import NavBar from "./components/views/NavBar/NavBar.js";

function App() {
  return (
    //null은 아무나 들어갈수 있다. true 로그인한 사람만, false 로그인 안한 사람
    <Router>
      <NavBar />
      <div>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null, true)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/video/upload" component={Auth(VideoUploadPage, true)} />
          <Route exact path="/video/:videoId" component={Auth(VideoDetailPage, null)} />
          <Route exact path="/subscription" component={Auth(subscription, null)} />
          <Redirect from="*" to="/" />
        </Switch>
      </div>
      <Footer/>
    </Router>
  );
}
//Router는 오직 하나의 child만 가질 수 있다.
//switch는 렌더할때 오직 한개의 Rotute만 render 할 수 있다.
//redirect는 위에 주소들 중에서 아무것도 맞는게 없으면 어느 페이지든 받아서 /로 보내주는것.
//:videoId 이부분은 변수라고 보면됨. 예전 parkflix에서  "/movie/:id" 로써 사용한 적이 있다.
export default App;