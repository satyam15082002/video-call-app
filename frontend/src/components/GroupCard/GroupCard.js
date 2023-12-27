import React from 'react'
import styles from './GroupCard.module.css'
import { Link } from 'react-router-dom';
export default function GroupCard({groupName,groupID,removeGroup}) {
    function shareLink()
    {
        if(navigator.share)
        {
            navigator.share({
                title:`Invitation Link for ${groupName}`,
                text:'',
                url:`${window.location.protocol}//${window.location.host}/room?roomName=${groupID}&groupName=${groupName}`
            }).then(res=>{
                console.log("Shared");
            })
        }
        else
            alert("Your Device Does not Support SHaring")
    }
  return (
    <div className={styles.card}>
        <div className={styles.cardHeader}>
                <span>{groupName}</span>
        </div>
        <div className={styles.cardFooter}>
            <Link to={`/room?roomName=${groupID}&groupName=${groupName}`} target='_blank'>JoinRoom</Link>         
            <button onClick={()=>shareLink()}>
                Share Group
            </button>
            <button onClick={()=>removeGroup({groupID})}>
                Delete
            </button>
        </div>
    </div>
  )
}
