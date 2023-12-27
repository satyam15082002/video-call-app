import React, { useEffect ,useRef} from 'react'
import style from './LocalVideo.module.css'
export default function LocalVideo({localStream}) {
    const videoRef=useRef(null)
    const mainRef=useRef(null)
    useEffect(()=>{
        videoRef.current.srcObject=localStream
    },[localStream])
    function handleClick()
    {
        mainRef.current.requestFullscreen()
    }
  return (
    <div className={style.container} ref={mainRef} onClick={()=>handleClick()} >
        <video ref={videoRef} playsInline autoPlay/>
    </div>
  )
}
