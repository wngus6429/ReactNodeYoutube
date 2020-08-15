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
  //정보를 타고  response로 옴 https://velog.io/@velopert/react-hooks
  //만약 useEffect 에서 설정한 함수가 컴포넌트가 화면에 가장 처음 렌더링 될 때만 
  //실행되고 업데이트 할 경우에는 실행 할 필요가 없는 경우엔 함수의 두번째 파라미터로 
  //비어있는 배열을 넣어주시면 됩니다.
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
  }, []); //[]을 넣음으로서 한번만 , 아무것도 없이 비어있으면 계속 실행

  const renderCards = Video.map((video, index) => {
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor(video.duration - minutes * 60);

    return (// 전체가 24사이즈, 미디움사이즈 8 , 화면이 가장 클때는 칼럼 사이즈가 6
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
      </div>
  )
}

export default withRouter(LandingPage)
