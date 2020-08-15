/** @format */

import React, { useEffect, useState } from "react";
import Axios from "axios";

function SideVideo() {
  const [sideVideos, setsideVideos] = useState([]);

  useEffect(() => {
    //랜딩페이지 오자마자
    Axios.get("/api/video/getVideos").then((response) => {
      if (response.data.success) {
        //console.log(response.data.videos);
        setsideVideos(response.data.videos);
      } else {
        alert("Failed to get Videos");
      }
    });
  }, []);

  const sideVideoItem = sideVideos.map((video, index) => {
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor(video.duration - minutes * 60);
    return (
      <div key={index} style={{ display: "flex", marginTop: "1rem" }}>
        <div style={{ width: "60%", marginRight: "1rem" }}>
          <a href={`/video/${video._id}`} style={{ color: "gray" }}>
            <img style={{ width: "100%" }} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail"/>
          </a>
        </div>
        <div style={{ width: "40%" }}>
          <a href={`/video/${video._id}`} style={{ color: "gray" }}>
            <span style={{ fontSize: "21px", color: "black" }}>{video.title} </span>
            <br />
            <span style={{fontSize:"15px"}}>{video.writer.name}</span>
            <br />
            <span style={{fontSize:"15px"}}>{video.views}</span>
            <br />
            <span style={{fontSize:"15px"}}>
              {minutes} : {seconds}
            </span>
            <br />
          </a>
        </div>
      </div>
    );
  });

  return (
    <React.Fragment>
      <div style={{ marginTop: "3rem" }}></div>
      {sideVideoItem}
    </React.Fragment>
  );
}

export default SideVideo;
