import React from 'react'
import styles from './CreateGroup.module.css'
import { useState } from 'react'
export default function CreateGroup({addGroup}) {
  const [groupName,setGroupName]=useState('')
  function handleClick(e)
  {
    e.preventDefault()
    if(!groupName) return
    const groupID=crypto.randomUUID()
    addGroup({groupName,groupID})
    setGroupName('')
  }
  return (
    <form onSubmit={(e)=>handleClick(e)}>
    <div className={styles.container}>
        <input type='text' value={groupName} onChange={e=>setGroupName(e.target.value)}
          placeholder='Enter GroupName'/>
        <button >👋Create</button>
    </div>
    </form>
  )
}
