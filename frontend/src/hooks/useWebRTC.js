import { useRef, useEffect, useState, useCallback, } from 'react'
import { socket } from './../socketUtils'

const config = {
    iceServers: [{
        urls: 'turn:openrelay.metered.ca:80',
        username: 'openrelayproject',
        credential: 'openrelayproject',
    }],
}
function useWebRTC({room}) {
    const [localStream, setLocalStream] = useState(null)
    const [clients,setClients]=useState([])
    const peerConnectionRef=useRef({})
    const remoteStreamsRef=useRef({})
    const [isAudioEnabled,setAudioEnabled]=useState(true)
    const [isVideoEnabled,setVideoEnabled]=useState(true)
    const [user,setUser]=useState({})
    const startCapture=useCallback(async ()=>{
        try {
            return await navigator.mediaDevices.getUserMedia({video:true,audio:{
                noiseSuppression:true,
                echoCancellation:true
            }})
        } catch (error) {
         throw error   
        }
    },[])
    const toggleAudio=useCallback(()=>{
        if(!localStream) return
        localStream.getAudioTracks()&&localStream.getAudioTracks().forEach(track=>{
            track.enabled=!isAudioEnabled
        })
        setAudioEnabled(prev=>!prev)
    },[localStream,isAudioEnabled])
    const toggleVideo=useCallback(()=>{
        if(!localStream) return
        localStream.getVideoTracks().forEach(track=>{
            track.enabled=!isVideoEnabled
        })
        setVideoEnabled(prev=>!prev)
    },[localStream,isVideoEnabled])
    
    useEffect(()=>{
        startCapture().then(stream=>{
            socket.connect()
            setLocalStream(stream)
            // Join The Room
            socket.emit('user-join',{room:room})
            //Handle The Offer received
            socket.on("offer",async ({peerID,offer})=>{
                console.log("recv offer",peerID,offer);
                if(peerConnectionRef.current[peerID])
                    peerConnectionRef.current[peerID].close()
                const pc=new RTCPeerConnection(config)
                peerConnectionRef.current[peerID]=pc
                pc.ontrack=async e=>{
                    if(!e.track) return
                    console.log("Track Received");
                    remoteStreamsRef.current[peerID].addTrack(e.track)

                }
                pc.onicecandidate=async e=>{
                    if(!e.candidate) return
                    console.log("ice generated")
                    socket.emit('ice',{
                        peerID:peerID,
                        candidate:e.candidate
                    })
                    
                }
                await pc.setRemoteDescription(offer)
                stream.getTracks().forEach(track=>{
                    pc.addTrack(track)  
                })
                const answer=await pc.createAnswer()
                await pc.setLocalDescription(answer)
                console.log("Senfdin g answer",answer);
                socket.emit('answer',{
                    answer:answer,
                    peerID:peerID
                })


            })
       
            //Handle answer
            socket.on('answer',async ({peerID,answer})=>{
                console.log("recv answer");
                await peerConnectionRef.current[peerID].setRemoteDescription(answer)
            })
            //handle ICE
            socket.on('ice',async ({peerID,candidate})=>{
                await peerConnectionRef.current[peerID].addIceCandidate(candidate)
            })
            socket.on('voice',async({peerID,audio,video})=>{
                // console.log("recv  audio change",audio,video);
                setUser(prev=>({...prev,[peerID]:{audio:audio,video:video}}))
            })
            //Add New Peer
            socket.on('add-peer',async ({peerID,createOffer:makeOffer})=>{
                if(clients.includes(peerID))
                    return console.warn("Already joined")
                setClients(prev=>[...prev,peerID])
                setUser(prev=>({...prev,[peerID]:{
                    audio:true,
                    video:true
                }}))
                remoteStreamsRef.current[peerID]=new MediaStream()
                if(makeOffer)
                {
                    if(peerConnectionRef.current[peerID])
                        peerConnectionRef.current[peerID].close()
                    const pc=new RTCPeerConnection(config)
                    peerConnectionRef.current[peerID]=pc
                    pc.ontrack=async e=>{
                        if(!e.track) return
                        // console.log("Track Received",e.track);
                        remoteStreamsRef.current[peerID].addTrack(e.track)
                    }
                    pc.onicecandidate=async e=>{
                        if(!e.candidate) return
                        console.log("ice generated")
                        socket.emit('ice',{
                            peerID:peerID,
                            candidate:e.candidate
                        })
                    }
                    stream.getTracks().forEach(track=>{
                        pc.addTrack(track)  
                    })
                    const offer=await pc.createOffer()
                    await pc.setLocalDescription(offer)
                    socket.emit("offer",{
                        offer:offer,
                        peerID:peerID
                    })
                }
            })           
            //Handle Peer Leaves
            socket.on('user-leave',async({peerID})=>{
                setClients(prev=>[...prev.filter(it=>it!==peerID)])
                delete peerConnectionRef.current[peerID]
                delete remoteStreamsRef.current[peerID]
            })
        })
        return ()=>{

            socket.off('add-peer')
            socket.off('ice')
            socket.off('voice')
            socket.off('answer')
            socket.off('offer')
            socket.disconnect()
        }

    },[])
    
    useEffect(()=>{

        socket.emit('voice',{room:room,audio:isAudioEnabled,video:isVideoEnabled})

    },[isAudioEnabled,isVideoEnabled,clients])

    return {
        localStream,
        remoteStreamsRef,
        clients,
        isAudioEnabled,
        toggleAudio,
        isVideoEnabled,
        toggleVideo,
        user
    }
}
export default useWebRTC