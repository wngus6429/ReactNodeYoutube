/** @format */

import React, { useEffect, useState } from "react";
import { Card, Avatar, Col, Typography, Row } from "antd";
import Axios from "axios";
import moment from "moment";
import {withRouter} from "react-router-dom"

const { Title } = Typography;
const { Meta } = Card;



function LandingPage(props) {
  const [Video, setVideo] = useState([]); //배열에다가 당연 담아야지

  //랜딩페이지 오자마자 밑에꺼 실행, axios.get으로 서버로 보내고
  //index.js 에서 정보를 타고  response로 옴
  //Dom이 로드되자마자 무엇을 한번 할것인지. 뒤에 있으면 한번실행 없으면 계속 실행
  useEffect(() => {
    //랜딩페이지 오자마자
    Axios.get("/api/video/getVideos").then((response) => {
      if (response.data.success) {
        console.log(response.data);
        setVideo(response.data.videos);
      } else {
        alert("Video Rendering Fail");
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

  const renderCards = Video.map((video, index) => {
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor(video.duration - minutes * 60);

    return (
      <Col lg={6} md={8} xs={24}>
        <div style={{ position: "relative" }}>
           <a href={`/video/${video._id}`}> {/*상세 화면으로 가기 위해 링크 걸음 */}
            <img style={{ width: "100%" }} alt="thumbnail" src={`http://localhost:5000/${video.thumbnail}`} />
            <div className="duration" style={{ bottom: 0, right: 0, position: "absolute", margin: "4px",
                color: "#fff", backgroundColor: "rgba(17, 17, 17, 0.8)", opacity: 0.8,
                padding: "2px 4px", borderRadius: "2px", letterSpacing: "0.5px",
                fontSize: "12px", fontWeight: "500", lineHeight: "12px", }}    >
              <span>
                {minutes} : {seconds}
              </span>
            </div>
          </a>
        </div>
        <br />
        {/* Meta 이부분은 유저 아바타 */}
        <Meta avatar={<Avatar src={video.writer.image} /> }
                title={video.title} description="" />
            <span>{video.writer.name} </span><br />
            <span style={{ marginLeft: '3rem' }}> {video.views}</span>
            - <span> {moment(video.createdAt).format("MMM Do YY")} </span>
        </Col>

    )})
    // <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100vh",}} >
    //   <h2>시작페이지</h2>
    //   {/* <button onClick={onClickHandler}>로그아웃</button> */}
    // </div>
    return (
      <div style={{ width: '85%', margin: '3rem auto' }}>
          <Title level={2} > Recommended </Title>
          <hr />
          <Row gutter={16}>
              {renderCards}
          </Row>
          <button onClick={onClickHandler}>로그아웃</button>
      </div>
  )
}

export default withRouter(LandingPage)
