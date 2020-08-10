/** @format */

import React, { useEffect, useState } from "react";
import SingleComment from "./SingleComment";

function ReplyComment(props) {
  const [ChildCommentNumber, setChildCommentNumber] = useState(0);
  const [OpenReplyComments, setOpenReplyComments] = useState(false);

  useEffect(() => {
    let commentNumber = 0;
    props.commentLists.map((comment) => {
      if (comment.responseTo === props.parentCommentId) commentNumber++;
    });
    setChildCommentNumber(commentNumber);
  }, [props.commentLists]);
  //커멘트리스트가 부모에서 오는데. 비디오디테일페이지 , 이게 바뀔때마다 위에부분을 다시 실행하라

  const renderReplyComment = (parentCommentId) =>
    props.commentLists.map((comment, index) => {
      return (
        <>
          {comment.responseTo === parentCommentId && (
            <div style={{ width: "80%", marginLeft: "40px" }}>
              <SingleComment
                key={index}
                refreshFuntion={props.refreshFuntion}
                comment={comment}
                videoId={props.videoId} //videoId랑 videoId랑 똑같은거라 생각하면됨
              />
              <ReplyComment
                key={index}
                refreshFuntion={props.refreshFuntion}
                commentLists={props.commentLists}
                videoId={props.videoId}
                parentCommentId={comment._id}
              />
            </div>
          )}
        </>
      );
    });
  //여기

  const onHandleChange = () => {
    setOpenReplyComments(!OpenReplyComments);
  };

  return (
    <div>
      {ChildCommentNumber > 0 && (
        <p style={{ fontSize: "14px", margin: 0, color: "gray" }} onClick={onHandleChange}>
          View {ChildCommentNumber} more Comment(s)
        </p>
      )}
      {OpenReplyComments && renderReplyComment(props.parentCommentId)}
    </div>
  );
}

export default ReplyComment;
