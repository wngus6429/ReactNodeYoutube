/** @format */

import React, { useEffect, useState } from "react";
import Axios from "axios";
import { LikeFilled, DislikeOutlined } from "@ant-design/icons";

function LikeDislikes(props) {
  const [Likes, setLikes] = useState(0);
  const [LikeAction, setLikeAction] = useState(null);

  const [DisLikes, setDisLikes] = useState(0);
  const [DisLikeAction, setDisLikeAction] = useState(null);

  let variable = {};
  if (props.video) {
    variable = { videoId: props.videoId, userId: props.userId }; //videoDetail 67
  } else {
    variable = { commentId: props.commentId, userId: props.userId }; //singleComment 46
  }

  useEffect(() => {
    Axios.post("/api/like/getLikes", variable).then((response) => {
      if (response.data.success) {
        //얼마나 많은 좋아요를 받았는지
        setLikes(response.data.likes.length);
        //내가 이미 그 좋아요를 눌렀는지
        response.data.likes.map((like) => { 
          //15분경
          if (like.userId === props.userId) {
            //뒤는 로컬스토리지의 자신, 앞에꺼는 response.data.likes 많은 사람들이 누른거
            setLikeAction("liked");
          }
        });
      } else {
        alert("Like information import fail");
      }
    });

    Axios.post("/api/like/getDisLikes", variable).then((response) => {
      if (response.data.success) {
        //얼마나 많은 싫어요를 받았는지
        setDisLikes(response.data.dislikes.length);
        //내가 이미 그 싫어요를 눌렀는지
        response.data.dislikes.map((dislike) => {
          //모든 Dislike의 정보를 가져와서 내 자신이랑 비교하는 거임
          if (dislike.userId === props.userId) {
            //뒤는 내 자신, 앞에꺼는 response.data.likes 많은 사람들이 누른거
            setDisLikeAction("disliked");
          }
        });
      } else {
        alert("DisLike information import fail");
      }
    });
  }, []);

  const onLike = () => {
    //클릭이 안되어 있을때
    if (LikeAction === null) {
      Axios.post("/api/like/upLike", variable).then((response) => {
        if (response.data.success) {
          setLikes(Likes + 1);
          setLikeAction("liked");
          if (DisLikeAction !== null) {
            //dislike가 클릭 되어 있을때를 생각
            setDisLikeAction(null);
            setDisLikes(DisLikes - 1);
          }
        } else {
          alert("Uplike up fail");
        }
      });
    } else {
      //클릭이 되어 있었을때
      Axios.post("/api/like/unLike", variable).then((response) => {
        if (response.data.success) {
          setLikes(Likes - 1);
          setLikeAction(null);
        } else {
          alert("Uplike down fail");
        }
      });
    }
  };

  const onDislike = () => {
    if (DisLikeAction !== null) {
      //null이 아닐때 즉, dislike가 클릭이 되어 있을때
      Axios.post("/api/like/unDislike", variable).then((response) => {
        if (response.data.success) {
          setDisLikes(DisLikes - 1);
          setDisLikeAction(null);
        } else {
          alert("dislike delete fail");
        }
      });
    } else {
      Axios.post("/api/like/upDislike", variable).then((response) => {
        if (response.data.success) {
          setDisLikes(DisLikeAction + 1);
          setDisLikeAction("disliked");

          if (LikeAction !== null) {
            //Like가 클릭되어 있다면
            setLikeAction(null);
            setLikes(Likes - 1);
          }
        } else {
          alert("dislike delete fail");
        }
      });
    }
  };

  return (
    <div>
      <span key="comment-basic-like">
        <LikeFilled style={{ fontSize: "12px" }} onClick={onLike} />
        <span style={{ paddingLeft: "8px", cursor: "auto" }}>{Likes}</span>
      </span>
      &nbsp;&nbsp;
      <span key="comment-basic-dislike">
        <DislikeOutlined style={{ fontSize: "12px" }} onClick={onDislike} />
        <span style={{ paddingLeft: "8px", cursor: "auto" }}>{DisLikes}</span>
      </span>
    </div>
  );
}

export default LikeDislikes;
