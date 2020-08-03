/** @format */

import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import LandingPage from "./components/views/LandingPage/LandingPage.js";
import LoginPage from "./components/views/LoginPage/LoginPage.js";
import RegisterPage from "./components/views/RegisterPage/RegisterPage.js";
import Auth from "./hoc/auth";
import VideoUploadPage from "./components/views/VideoUploadPage/VideoUploadPage";
import VideoDetailPage from "./components/views/VideoDetailPage/VideoDetailPage";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null, true)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/video/upload" component={Auth(VideoUploadPage, true)} />
          <Route exact path="/video/:videoId" component={Auth(VideoDetailPage, null)} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;

{
  /* <Route path="/register">
  <RegisterPage />
</Route>; */
}
