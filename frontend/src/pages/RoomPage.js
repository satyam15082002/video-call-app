// import './App.css'
import useWebRTC from './../hooks/useWebRTC';
import VideoControls from './../components/VideoControls/VideoControls';
import LocalVideo from './../components/LocalVideo/LocalVideo';
import RemoteVideo from './../components/RemoteVideo/RemoteVideo';

const getRoomName=()=>
{
  const roomName=new URLSearchParams(window.location.search).get('roomName')
  const groupName=new URLSearchParams(window.location.search).get('groupName')

  return {room:roomName,groupName:groupName}
}
export default function RoomPage() {
  const{ groupName,room:roomName}=getRoomName()
  const {user,localStream,clients,remoteStreamsRef,isAudioEnabled,
          toggleAudio,isVideoEnabled,toggleVideo}=useWebRTC({room:roomName})
  return (
    <div>
      <h2>Video Call : {groupName}   </h2>
      <div className='container'>
        {clients.map(peerID=>
          <RemoteVideo 
            isAudioEnabled={user[peerID]?.audio}
            isVideoEnabled={user[peerID]?.video}
            videoStream={remoteStreamsRef.current[peerID]} key={peerID}/>
          )}
      </div>
      <LocalVideo localStream={localStream}/>
      <VideoControls 
        isAudioEnabled={isAudioEnabled}
        isVideoEnabled={isVideoEnabled}
        toggleAudio={toggleAudio}
        toggleVideo={toggleVideo}  />
    </div>
  );
}
