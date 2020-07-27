/** @format */

import React, {useState}from "react";
import { Typography, Button, Form, message, Input } from "antd";
import { PlusSquareOutlined } from '@ant-design/icons';
import Dropzone from "react-dropzone";
import TextArea from "antd/lib/input/TextArea";

const { Title } = Typography;

const PrivateOptions = [{value:0, label:"Private"},{value:1, label:"Public"}]

const CategoryOptions = [{value:0, label:"Film & Animation"}, {value:1, label:"Auto & Vehicles"},
                         {value:2, label:"Music"}, {value:3, label:"Pets & Animals"}]

function VideoUploadPage() {

    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0) //Private 0, Public 1
    const [Category, setCategory] = useState("Film & Animation")

    const VideoTitleHandler = (event) =>{
        setVideoTitle(event.currentTarget.value)
    }
    const DescriptionHandler = (event) =>{
        setDescription(event.currentTarget.value)
    }
    const onPrivateChange = (event) =>{
        setPrivate(event.currentTarget.value)
    }
    const onCategoryChange = (event) =>{
        setCategory(event.currentTarget.value)
    }
    
  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}>Upload Video</Title>
      </div>
      <Form onSubmit>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* image plus */}
          <Dropzone onDrop multiple maxSize>
            {({ getRootProps, getInputProps }) => (
              <div style={{ width: "300px", height: "240px", border: "1px solid lightgray", display: "flex", alignItems: "center", justifyContent: "center", }}
                {...getRootProps()}
              >
                  <PlusSquareOutlined style={{fontSize:'30px'}}/>
                <input {...getInputProps()} />
              </div>
            )}
          </Dropzone>
          {/* Tuhumnail */}
          <div>
            <img src alt />
          </div>
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
               <option key={index} value={item.value}>{item.label}</option>))}
          {/* 맵은 항상 index를 넣어야 에러가 뜨지 않음 */}
        </select>
        <br />
        <br />
        <select onChange={onCategoryChange}>
            {CategoryOptions.map((item, index)=>(
               <option key={index} value={item.value}>{item.label}</option>))}
        </select>
        <br />
        <br />
        <Button type="primary" size="large" onClick>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default VideoUploadPage;
