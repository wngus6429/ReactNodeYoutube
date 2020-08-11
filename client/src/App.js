/** @format */

import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

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
        </Switch>
      </div>
      <Footer/>
    </Router>
  );
}

export default App;

{
  /* <Route path="/register">
  <RegisterPage />
</Route>; */
}
