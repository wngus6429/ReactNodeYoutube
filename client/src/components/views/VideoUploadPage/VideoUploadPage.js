/** @format */

import React, { useState } from "react";
import { Typography, Button, Form, message, Input } from "antd";
import { PlusSquareOutlined } from "@ant-design/icons";
import Dropzone from "react-dropzone";
import Axios from "axios";
import { useSelector } from "react-redux";
import TextArea from "antd/lib/input/TextArea";
import { withRouter } from "react-router-dom";

const { Title } = Typography;

const PrivateOptions = [
  { value: 0, label: "Private" },
  { value: 1, label: "Public" },
];

const CategoryOptions = [
  { value: 0, label: "Film & Animation" },
  { value: 1, label: "Auto & Vehicles" },
  { value: 2, label: "Music" },
  { value: 3, label: "Pets & Animals" },
];

function VideoUploadPage(props) {
  const user = useSelector((state) => state.user); //리덕스 State 보면 유저정보를 다 가져와서 넣음.
  const [VideoTitle, setVideoTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Private, setPrivate] = useState(0); //Private 0, Public 1
  const [Category, setCategory] = useState("Film & Animation");
  const [FilePath, setFilePath] = useState("");
  const [Duration, setDuration] = useState("");
  const [ThumbnailPath, setThumbnailPath] = useState("");

  const VideoTitleHandler = (event) => {
    setVideoTitle(event.currentTarget.value);
  };
  const DescriptionHandler = (event) => {
    setDescription(event.currentTarget.value);
  };
  const onPrivateChange = (event) => {
    setPrivate(event.currentTarget.value);
  };
  const onCategoryChange = (event) => {
    setCategory(event.currentTarget.value);
  };
  //서버에 request 를 보내고 axios를 이용하는데. axios가 제이쿼리의 ajax와 똑같다고 보면됨.
  const onDrop = (files) => {
    let formData = new FormData();
    const config = {//같이 Axios로 보내야함 그래서 header 에 타입을 설정하는거
      header: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]); //[0]한 이유는 정보의 0번쨰 내용을 바로 가져오기 위해
    console.log(files);
    Axios.post("/api/video/uploadfiles", formData, config).then((response) => {
      if (response.data.success) {
        //console.log(response.data); //밑에 url 파일 경로
        let variable = { url: response.data.url, fileName: response.data.fileName };
        setFilePath(response.data.url);
        Axios.post("/api/video/thumbnail", variable).then((response) => {
          if (response.data.success) {
            setDuration(response.data.fileDuration); //video.js 126줄
            setThumbnailPath(response.data.url); //video.js 125줄
            //console.log(response.data);
          } else {
            alert("Fail Thumbnail making");
          }
        });
      } else {
        alert("Video Upload Failed");
      }
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    //밑에 자료들은 리덕스를 통해서 가져온다. import { useSelector } from "react-redux";
    //const user = useSelector((state) => state.user); 에서 데이터 가져온거 활용
    const variables = {
      writer: user.userData._id, title: VideoTitle,
      description: Description,  privacy: Private,
      filePath: FilePath,        category: Category,
      duration: Duration,        thumbnail: ThumbnailPath,
    };
    Axios.post("/api/video/uploadVideo", variables).then((response) => {
      if (response.data.success) {
        //console.log(response.data); //석세스 츠루
        message.success("Upload Success");
        console.log(props);
        setTimeout(() => {
          props.history.push("/");
        }, 2000);
        //3초후에 / 페이지로 보내는거임
      } else {
        alert("Video Upload Fail");
      }
    });
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}>Upload Video</Title>
      </div>
      <Form onSubmit={onSubmit}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* image plus 밑에 multiple은 복수 올리기 maxSize는 파일 사이즈*/}
          <Dropzone onDrop={onDrop} multiple={false} maxSize={1000000000}>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{ width: "300px",  height: "240px", border: "1px solid lightgray",
                  display: "flex", alignItems: "center", justifyContent: "center" }}
                {...getRootProps()}
              >
                <PlusSquareOutlined style={{ fontSize: "30px" }} />
                <input {...getInputProps()} />
              </div>
            )}
          </Dropzone>
          {/* Tuhumnail */}
          {ThumbnailPath && (
            <div>
            <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" />
          </div>
            //위에 ThumbnailPath가 있을때만 밑에께 렌더링 되어라
            )}
        </div>
        <br />
        <br />
        <label>Title</label>
        <Input onChange={VideoTitleHandler} value={VideoTitle} />
        <br />
        <br />
        <label>Description</label>
        <TextArea onChange={DescriptionHandler} value={Description} />
        <br />
        <br />
        <select onChange={onPrivateChange}>
          {PrivateOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
          {/* 맵은 항상 index를 넣어야 에러가 뜨지 않음 */}
        </select>
        <br />
        <br />
        <select onChange={onCategoryChange}>
          {CategoryOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <Button type="primary" size="large" onClick={onSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default withRouter(VideoUploadPage);
