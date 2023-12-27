import React ,{useRef,useEffect, useState}from 'react'
import styles from './RemoteVideo.module.css'
export default function RemoteVideo({ videoStream ,isAudioEnabled,isVideoEnabled}) {

    const videoRef=useRef(null)
    const mainRef=useRef(null)
    const[isFullScreen,setFullScreen]=useState(false)
    useEffect(()=>{
        videoRef.current.srcObject=videoStream
    },[videoStream])
    return (
        <div ref={mainRef} className={styles.container}>
            <video ref={videoRef} autoPlay playsInline style={{'objectFit':isFullScreen?"contain":"cover"}}  />
            <div className={styles.videoInfo}>
                <button  className={`${styles.icon} ${isVideoEnabled?styles.videoOn:styles.videoOff}`}></button>
                <button onClick={()=>handleClick()} 
                     className={`${styles.icon} ${isFullScreen?styles.miniMize:styles.maxMize}`}></button>

                <button  className={`${styles.icon} ${isAudioEnabled?styles.micOn:styles.micOff}`} ></button>
            </div>
        </div>
    )

    function handleClick()
    {
        if (isFullScreen) {
            document.exitFullscreen(); // Use document instead of mainRef.current
            setFullScreen(false);
          } else {
            const element = mainRef.current; // Save a reference to the element
            const requestFullscreen =
              element.requestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen || element.msRequestFullscreen;
      
            if (requestFullscreen) {
              requestFullscreen.call(element);
              setFullScreen(true);
            }
          }
    }
}