/** @format */

import React, { useState } from "react";
import { Comment, Avatar} from "antd";
import { useSelector } from "react-redux";
import Axios from "axios";
import LikeDislikes from "./LikeDislikes";

//const { TextArea } = Input;

function SingleComment(props) {
  const user = useSelector((state) => state.user);
  const [OpenReply, setOpenReply] = useState(false);
  const [CommentValue, setCommentValue] = useState(""); //string 빈공간

  const onClickReplyOpen = () => {
    setOpenReply(!OpenReply);
  };

  const onHandleChange = (event) => {
    setCommentValue(event.currentTarget.value); //타이핑 가능하게
  };

  const onSubmit = (event) => {
    event.preventDefault();
    //모든 정보를 댓글 내용들을 request 보내줘야지,
    const variables = {
      content: CommentValue,
      writer: user.userData._id, //리덕스에서 가져와봄
      videoId: props.videoId, //즉 비디오ID라고 보면됨
      responseTo: props.comment._id,
    };
    Axios.post("/api/comment/saveComment", variables).then((response) => {
      if (response.data.success) {
        console.log(response.data.result);
        setCommentValue("");
        setOpenReply(false);
        props.refreshFuntion(response.data.result);
      } else {
        alert("Comment Save Failed");
      }
    });
  };

  const actions = [
    <LikeDislikes userId={localStorage.getItem("userId")} commentId={props.comment._id} />,
    <span onClick={onClickReplyOpen} key="comment-basic-reply-to">
      Reply To
    </span>,
  ];

  return (
    <div>
      <Comment
        actions={actions}
        author={props.comment.writer.name}
        avatar={<Avatar src={props.comment.writer.image} alt="image" />}
        content={<p>{props.comment.content}</p>}
      ></Comment>
      {/* OpenReply가 true 일 때만 뒤에 꺼 보임, 초기치가 위에 false라서 눌러야 보임 */}
      {OpenReply && (
        <form style={{ display: "flex" }} onSubmit={onSubmit}>
          <textarea
            style={{ width: "100%", borderRadius: "5px" }}
            onChange={onHandleChange}
            value={CommentValue}
            placeholder="Let's Comment Input"
          ></textarea>
          <br />
          <button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
export default SingleComment;
