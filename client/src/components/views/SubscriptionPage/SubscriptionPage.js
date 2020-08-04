/** @format */

import React, { useEffect, useState } from "react";
import { Card, Avatar, Col, Typography, Row } from "antd";
import Axios from "axios";
import moment from "moment";
import { withRouter } from "react-router-dom";

const { Title } = Typography;
const { Meta } = Card;

function SubscriptionPage(props) {
  const [Videos, setVideos] = useState([]); //배열에다가 당연 담아야지

  useEffect(() => {
    //본인이 구독하는 사람의 모든 정보를 가져와야 함
    const subscriptionVariables = {
      //로그인된 본인의 아이디가 우선 들어가야지
      userFrom: localStorage.getItem("userId"),
    };

    Axios.post("/api/video/getSubscriptionVideos", subscriptionVariables).then((response) => {
      if (response.data.success) {
        console.log(response.data);
        setVideos(response.data.videos);
      } else {
        alert("Failed to get subscription videos");
      }
    });
  }, []);

  const onClickHandler = () => {
    Axios.get("/api/users/logout").then((response) => {
      //console.log(response.data);
      if (response.data.success) {
        props.history.push("/login"); //history는 react-router-dom 의 withRouter를 사용한다.
      } else {
        alert("Logout Fail");
      }
    });
  };

  const renderCards = Videos.map((video, index) => {
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor(video.duration - minutes * 60);

    return (
      <Col lg={6} md={8} xs={24}>
        <div style={{ position: "relative" }}>
          <a href={`/video/${video._id}`}>
            {" "}
            {/*상세 화면으로 가기 위해 링크 걸음 */}
            <img
              style={{ width: "100%" }}
              alt="thumbnail"
              src={`http://localhost:5000/${video.thumbnail}`}
            />
            <div
              className="duration"
              style={{
                bottom: 0,
                right: 0,
                position: "absolute",
                margin: "4px",
                color: "#fff",
                backgroundColor: "rgba(17, 17, 17, 0.8)",
                opacity: 0.8,
                padding: "2px 4px",
                borderRadius: "2px",
                letterSpacing: "0.5px",
                fontSize: "12px",
                fontWeight: "500",
                lineHeight: "12px",
              }}
            >
              <span>
                {minutes} : {seconds}
              </span>
            </div>
          </a>
        </div>
        <br />
        {/* Meta 이부분은 유저 아바타 */}
        <Meta avatar={<Avatar src={video.writer.image} />} title={video.title} description="" />
        <span>{video.writer.name} </span>
        <br />
        <span style={{ marginLeft: "3rem" }}> {video.views}</span>-{" "}
        <span> {moment(video.createdAt).format("MMM Do YY")} </span>
      </Col>
    );
  });
  // <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100vh",}} >
  //   <h2>시작페이지</h2>
  //   {/* <button onClick={onClickHandler}>로그아웃</button> */}
  // </div>
  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <Title level={2}> Recommended </Title>
      <hr />
      <Row gutter={16}>{renderCards}</Row>
      <button onClick={onClickHandler}>로그아웃</button>
    </div>
  );
}

export default withRouter(SubscriptionPage);
