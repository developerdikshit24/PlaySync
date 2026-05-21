import React from 'react'
import PlaylistVideos from '../Component/PlaylistVideos.jsx'
import { Outlet } from 'react-router-dom';
const Playlist = () => {
  return (
    <div className='w-full'>
      <Outlet/>
    </div>
  )
}

export default Playlist