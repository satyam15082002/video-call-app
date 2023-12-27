import React from 'react'
import style from './VideoControls.module.css'
import { useNavigate } from 'react-router-dom'
export default function VideoControls(
 {isAudioEnabled,isVideoEnabled,toggleAudio,toggleVideo}
) {
  const navigate=useNavigate()
  return (
    <div className={style.container}>
        <button onClick={()=>toggleVideo()} className={`${style.icon} ${isVideoEnabled?style.videoOn:style.videoOff}`}></button>
        <button onClick={()=>toggleAudio()} className={`${style.icon} ${isAudioEnabled?style.micOn:style.micOff}`} ></button>
        <button onClick={()=>navigate('/')} className={`${style.icon} ${style.callEnd}`}></button>
    </div>
  )
}
