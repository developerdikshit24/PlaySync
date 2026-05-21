import React, { useEffect, useState } from 'react'
import { FaPlus } from "react-icons/fa";
import { RiPlayList2Line } from "react-icons/ri";
import CreatePlaylist from './CreatePlaylist';
import { useDispatch, useSelector } from 'react-redux';
import { getChannelProfile } from '../store/authStore';
import { getAllPlaylistThunk } from '../store/playlistStore';
import { Link } from 'react-router-dom';
import PlaylistVideoCard from './PlaylistVideoCard';
import VideoSkeleton from './SkeletonLoading/VideoSkeleton';
import LoginRequired from './LoginRequired';


const PlaylistVideos = () => {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const { loggedUser, channelProfile, isFindingChannel } = useSelector(state => state.authentication);
    const { allPlaylist, isFetchingPlaylist } = useSelector(state => state.playlist)

    if (!loggedUser) {
        return <LoginRequired />;
    }

    useEffect(() => {
        if (loggedUser) {
            dispatch(getAllPlaylistThunk(loggedUser?._id))
            dispatch(getChannelProfile(loggedUser?.userName))
        }
    }, [loggedUser])
    
    return (
        <div className='w-full h-full overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
            <div className='w-full relative mt-18'>
                <div className="p-6 w-full h-full dark:bg-base-300 bg-base-100">
                    <div className='w-full'><p className='text-2xl  font-bold '>Playlist</p></div>
                    <button onClick={() => { setShowModal(true) }} className='btn font-bold my-4 '><FaPlus className='text-xl ' /> Create</button>
                    <CreatePlaylist isOpen={showModal} videos={channelProfile?.publishVideo} onClose={() => setShowModal(false)} />
                    <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-2 mb-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                        <PlaylistVideoCard playlist={allPlaylist} />
                        {(isFetchingPlaylist || isFindingChannel) && <VideoSkeleton />}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default PlaylistVideos