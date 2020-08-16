/** @format */

import React, { useEffect, useState } from "react";
import { Row, Col, List, Avatar } from "antd";
import Axios from "axios";
import SideVideo from "./Section/SideVideo";
import Subscribe from "./Section/Subscribe";
import Comment from "./Section/Comment";
import LikeDislike from "./Section/LikeDislikes";

//전체가 24임. 가로 , 메인 영상 큰곳이 18이고 오른쪽께 8 정도의 가로 넓이를 가진다
function VideoDetailPage(props) {
  const videoId = props.match.params.videoId; //App.js Path에 적었으니까
  const variable = { videoId: videoId };

  const [VideoDetail, setvideoDetail] = useState([]);
  const [Comments, setComments] = useState([]);

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

    Axios.post("/api/comment/getComments", variable).then((response) => {
      if (response.data.success) {
        setComments(response.data.comments);
        console.log(response.data.comments);
      } else {
        alert("Fail");
      }
    });
  }, []);

  const refreshFuntion = (newComment) => {
    setComments(Comments.concat(newComment));
    //여기서 위에 저장하고, 저장한게 밑으로 Comment 컴포넌트로 가서 생성
  };

  //밑에 if 적는 이유는 writer가 있으면 표시 한다는 이야기 이거 안 붙이면 71번 에러남 (이미지 가져오기전 렌더링 되어서)
  if (VideoDetail.writer) {
    //본인이 작성한 글에 subscription 버튼이 보이면 안되니까 밑에꺼 작성, 두개가 다르면 Subscribe 컴포넌트 소환
    const subscribeButton = VideoDetail.writer._id !== localStorage.getItem("userId") && (
      <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem("userId")} />
    );

    return (
      <Row gutter={[16, 16]}>
        <Col lg={18} xs={24}>
          <div style={{ width: "100%", padding: "3rem 4rem" }}>
            <video
              style={{ width: "100%" }}
              src={`http://localhost:5000/${VideoDetail.filePath}`}
              controls={true}
              //autoPlay={true}
              loop={true}
            ></video>
            <List.Item
              actions={[
                <LikeDislike video userId={localStorage.getItem("userId")} videoId={videoId} />,
                subscribeButton,
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
            <Comment refreshFuntion={refreshFuntion} commentLists={Comments} {...props} />
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

export default VideoDetailPage;
//export default withRouter(VideoDetailPage);
