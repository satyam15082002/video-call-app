import React, { useEffect,useRef, useState } from 'react'

export default function Video({videoStream}) {
    const videoRef=useRef(null)
    useEffect(()=>{
        videoRef.current.srcObject=videoStream
        console.log("Video :-----",videoStream);
    },[videoStream])
  return (
    <>
      <div>
        <video ref={videoRef} playsInline autoPlay  controls  className='remote-video'/>
      </div>
    </>
  )
}


