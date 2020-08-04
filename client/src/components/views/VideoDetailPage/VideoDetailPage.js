/** @format */

import React, { useEffect, useState } from "react";
import { Row, Col, List, Avatar, Button } from "antd";
import Axios from "axios";
import { withRouter } from "react-router-dom";
import SideVideo from "./Section/SideVideo";
import Subscribe from "./Section/Subscribe";

//전체가 24임. 가로 , 메인 영상 큰곳이 18이고 오른쪽께 8 정도의 가로 넓이를 가진다
function VideoDetailPage(props) {
  const videoId = props.match.params.videoId; //App.js Path에 적었으니까
  const variable = { videoId: videoId };

  const [VideoDetail, setvideoDetail] = useState([]);
  useEffect(() => {
    //비디오에 해당하는 ID를 보내야 가져올수 있겟지
    Axios.post("/api/video/getVideoDetail", variable).then((response) => {
      if (response.data.success) {
        console.log(response);
        setvideoDetail(response.data.videoDetail);
      } else {
        alert("Video Information Import Fail");
      }
    });
  }, []);

  if (VideoDetail.writer) {
    return (
      <Row gutter={[16, 16]}>
        <Col lg={18} xs={24}>
          <div style={{ width: "100%", padding: "3rem 4rem" }}>
            <a href="/subscription">
              <button>Subscribe</button>
            </a>
            <video
              style={{ width: "100%" }}
              src={`http://localhost:5000/${VideoDetail.filePath}`}
              controls={true}
              //autoPlay={true}
              loop={true}
            ></video>
            <List.Item
              actions={[
                <Subscribe
                  userTo={VideoDetail.writer._id}
                  userFrom={localStorage.getItem("userId")}
                />,
              ]}
            >
              {/* 이렇게 할수 있는 이유는 populate로 정보를 다 긁어와서 활용이 가능한거임 */}
              <List.Item.Meta
                avatar={<Avatar src={VideoDetail.writer.image} />}
                title={VideoDetail.writer.name}
                description={VideoDetail.description}
              />
            </List.Item>

            {/* Comments */}
          </div>
        </Col>
        <Col lg={6} xs={24}>
          <SideVideo />
        </Col>
      </Row>
    );
  } else {
    return <div>...loading</div>;
  }
}

export default withRouter(VideoDetailPage);
