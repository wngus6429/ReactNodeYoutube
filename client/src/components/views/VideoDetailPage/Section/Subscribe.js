/** @format */

import React, { useEffect, useState } from "react";
import Axios from "axios";
import { withRouter } from "react-router-dom";
//rfce
function Subscribe(props) {
  const [SubscribeNumber, setSubscribeNumber] = useState(0); //0부터 시작하니 초기치 0
  const [Subscribed, setSubscribed] = useState(false); //초기치 false, false이면 Subscribe 안 한 상태

  useEffect(() => {
    let variable = { userTo: props.userTo };
    Axios.post("/api/subscribe/subscribeNumber", variable).then((response) => {
      if (response.data.success) {
        setSubscribeNumber(response.data.subscribeNumber);
      } else {
        alert("Subscribe Information Input Fail");
      }
    });

    let subscribedVariable = { userTo: props.userTo, userFrom: localStorage.getItem("userId") };
    //구독하는지 안하는지 알고 싶으니까
    Axios.post("/api/subscribe/subscribed", subscribedVariable).then((response) => {
      if (response.data.success) {
        setSubscribed(response.data.subscribed);
      } else {
        alert("Information Data Fail");
      }
    });
  }, []);

  const onSubscribe = () => {
    let subscribeVariable = { userTo: props.userTo, userFrom: props.userFrom }; //videoDetailpage.js의 43,44
    if (Subscribed) {
      //구독중이면
      Axios.post("/api/subscribe/unSubscribe", subscribeVariable).then((response) => {
        if (response.data.success) {
          setSubscribeNumber(SubscribeNumber - 1); //총 2번 랜더링 된다고 보면 됨.
          setSubscribed(!Subscribed);
        } else {
          alert("UnSubscribe Fail");
        }
      });
    } else {
      //구독중이 아니라면
      Axios.post("/api/subscribe/subscribe", subscribeVariable).then((response) => {
        console.log(response);
        if (response.data.success) {
          setSubscribeNumber(SubscribeNumber + 1); //구독 안한 사람이 한거니까 +1이 되어야지
          setSubscribed(!Subscribed);
        } else {
          alert("Subscribe Fail");
        }
      });
    }
  };

  return (
    <div>
      <button
        style={{
          backgroundColor: `${Subscribed ? "#AAAAAA" : "#CC0000"}`,
          borderRadius: "4px",
          color: "white",
          padding: "10px, 16px",
          fontWeight: "500",
          fontSize: "1rem",
          textTransform: "uppercase",
        }}
        onClick={onSubscribe}
      >
        {SubscribeNumber}
        {Subscribed ? "Subscribed" : "subscribe"}
      </button>
    </div>
  );
}

export default withRouter(Subscribe);
