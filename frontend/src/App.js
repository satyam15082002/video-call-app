import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import RoomPage from './pages/RoomPage'


export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/'  element={<HomePage/>}/>
      <Route path='/room' element={<RoomPage/>}/>
    </Routes>

    </BrowserRouter>
  )
}
