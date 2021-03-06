/** @format */

import React, { useState } from "react";
import Axios from "axios";
import { useSelector } from "react-redux"; //리덕스 훅에서 온거,
import SingleComment from "./SingleComment";
import ReplyComment from "./ReplyComment";

function Comment(props) {
  //console.log(props);
  const videoId = props.match.params.videoId; //url에서 가져오는거임

  const user = useSelector((state) => state.user);
  //state에서 user정보를 가져와서 넣은거, 리덕스 devtool에서 확인, 2번째탭

  const [commentValue, setcommentValue] = useState("");
  const handleClick = (event) => {
    //이거 있어야 당연히 textarea 입력 넣기 가능
    setcommentValue(event.currentTarget.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const variables = {
      content: commentValue, //62줄에 있는거
      writer: user.userData._id, //리덕스에서 가져와봄
      videoId: videoId, //즉 비디오ID라고 보면됨, 댓글이 있는 위치쯤 되겠지?
    };
    Axios.post("/api/comment/saveComment", variables).then((response) => {
      if (response.data.success) {
        console.log(response.data.result);
        setcommentValue(""); //이렇게 해줘야 글 쓰고 submit하면 텅빈 input이 됨
        props.refreshFuntion(response.data.result); //videoDetailPage로감
      } else {
        alert("Comment Save Failed");
      }
    });
  };

  return (
    <div>
      <br />
      <p>Comment</p>
      <hr />
      {/* commentLists 이게 있으면, true라면, map으로 돌려서 표시함 */}
      {/* 첫번째 댓글은 responseTo가 없고 대댓글들은 있다.  !comment.responseTo*/}
      {/* !comment.responseTo는 responseTo가 없는 애들만 표시  */}
      {props.commentLists &&
        props.commentLists.map(
          (comment, index) =>
            !comment.responseTo && (
              <>
                <SingleComment refreshFuntion={props.refreshFuntion} comment={comment}
                  videoId={videoId} />
                <ReplyComment  refreshFuntion={props.refreshFuntion} parentCommentId={comment._id}
                  videoId={videoId} commentLists={props.commentLists} />
              </>
            )
        )}
      {/* Comment Lists */}
      {/* Root Comment Form */}
      <form style={{ display: "flex" }} onSubmit={onSubmit}>
        <textarea style={{ width: "100%", borderRadius: "5px" }} onChange={handleClick}
          value={commentValue} placeholder="Let's Comment Input" ></textarea>
        <br />
        <button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default Comment;
