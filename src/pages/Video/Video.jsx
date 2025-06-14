import React from 'react'
import vid from "../../assets/video/Video-Page.mp4"
import "./Video.css"

const Video = () => {
  return (
    <div className='vid-cont' >
      <video src={vid} controls ></video>
    </div>
  )
}

export default Video
