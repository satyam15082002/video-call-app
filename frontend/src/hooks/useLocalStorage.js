import { useEffect, useState } from 'react';

const getStoredValue=(key,initialValue)=>{
  const storedValue=localStorage.getItem(key)

  if(storedValue) 
    return JSON.parse(storedValue)

  if(initialValue instanceof Function) return initialValue()

  return initialValue
}
export default function useLocalStorage(key, initialValue) {

  const [value, setValue] = useState(()=>getStoredValue(key,initialValue));

  useEffect(()=>{
    localStorage.setItem(key,JSON.stringify(value))
  },[value])

  return [value, setValue];
}
