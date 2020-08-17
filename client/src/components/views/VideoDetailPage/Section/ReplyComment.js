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
              <SingleComment key={index} refreshFuntion={props.refreshFuntion} //videoId랑 videoId랑 똑같은거라 생각하면됨
                comment={comment} videoId={props.videoId} /> 
              <ReplyComment key={index} refreshFuntion={props.refreshFuntion} commentLists={props.commentLists}
                videoId={props.videoId} parentCommentId={comment._id} />
            </div>
          )}
        </>
      );
    });
  //23은 본 댓글이랑 대댓글 연결하기 위해, 본 댓글은 responseTo가 없음

  const onHandleChange = () => {setOpenReplyComments(!OpenReplyComments);};

  return (
    // childCommentNumber가 0 보다 크면 랜더링 되게끔
    <div>
      {ChildCommentNumber > 0 && (
        <p style={{ fontSize: "14px", margin: 0, color: "gray" }} onClick={onHandleChange}>
          View {ChildCommentNumber} more Comment(s)
        </p>
      )}
      {OpenReplyComments && renderReplyComment(props.parentCommentId)}
    </div>
    //OpenReplyComments 가 True 일때 대댓글이 보이게함
  );
}

export default ReplyComment;
