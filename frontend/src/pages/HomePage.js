// pages/index.js
import { useState } from 'react';
import CreateGroup from '../components/CreateGroup/CreateGroup';
import GroupCard from '../components/GroupCard/GroupCard';
import useLocalStorage from '../hooks/useLocalStorage';
import './Home.css'
const HomePage = () => {
  const [groups,setGroups]=useLocalStorage('groups',[])
  const addGroup=({groupName,groupID})=>{
    setGroups(prev=>([...prev,{groupID,groupName}]))
  }
  const removeGroup=({groupID})=>{
    setGroups(prev=>[...prev.filter(it=>it.groupID!==groupID)])
  }
  return (
    <div>
      <h2>Video Call</h2>
      <CreateGroup addGroup={addGroup}/>
      {groups.map(group=>
        <GroupCard 
          removeGroup={removeGroup}
          groupID={group?.groupID} groupName={group?.groupName} key={group?.groupID}/>
        )}
    </div>
  );
};

export default HomePage;
