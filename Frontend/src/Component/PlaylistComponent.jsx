import React, { useEffect, useRef, useState } from 'react'
import { SlOptionsVertical } from "react-icons/sl";
import { MdEdit } from "react-icons/md";
import { FaPlay, FaPlus } from "react-icons/fa";
import { BsDot } from "react-icons/bs";
import ScreenLoader from './ScreenLoader.jsx'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deletePlaylistThunk, getAllPlaylistThunk, removeVideoFromPlaylistThunk } from '../store/playlistStore.js';
import UpdatePlaylist from './UpdatePlaylist.jsx';
import { getChannelProfile } from '../store/authStore.js';
import PlaylistSkeleton from './SkeletonLoading/PlaylistSkeleton.jsx';
import { formatTimeAgo } from '../utils/formatTimeAgo.js';
import formatVideoDuration from '../utils/formatVideoDuration.js';

const PlaylistComponent = () => {
  const { playlistId } = useParams();
  const dispatch = useDispatch()
  const Navigate = useNavigate()
  const { allPlaylist, isUpdatingPlaylist, isFetchingPlaylist, isAddingVideo } = useSelector(state => state.playlist);
  const { loggedUser, channelProfile, isFindingChannel } = useSelector(state => state.authentication);
  const [updatePlaylist, setUpdatePlaylist] = useState(false)
  const [removeVideo, setRemoveVideo] = useState([])
  const [selectedPlaylist, setSelectedPlaylist] = useState(allPlaylist.find(playlist => playlist?._id === playlistId));

  useEffect(() => {
    if (!allPlaylist.length && loggedUser?._id) {
      dispatch(getAllPlaylistThunk(loggedUser?._id));
      dispatch(getChannelProfile(loggedUser?.userName))
    }
  }, [loggedUser, removeVideo]);

  useEffect(() => {
    const found = allPlaylist.find((p) => p?._id === playlistId);
    setSelectedPlaylist(found || null);
  }, [playlistId, allPlaylist]);

  const [duration, setDuration] = useState(0);
  const videoRef = useRef();

  const handleLoadedMetadata = () => {
    if (videoRef.current?.duration) {
      setDuration(videoRef.current.duration);
    }
  };

  const handelRemoveVideo = () => {
    if (removeVideo.length) {
      dispatch(removeVideoFromPlaylistThunk({ playlistId: selectedPlaylist?._id, videoId: removeVideo })).then(() => { setRemoveVideo([]) })
    }
  }
  const handelDeletePlaylist = () => {
    dispatch(deletePlaylistThunk(selectedPlaylist?._id)).then(() => {
      Navigate('/playlist/my-playlist')
    })
  }

  if (!selectedPlaylist || isFindingChannel) {
    return <div className='mt-18'><PlaylistSkeleton /></div>
  }
  return (
    <> 
      <div className='flex h-full w-full'>
        <UpdatePlaylist
          isOpen={updatePlaylist}
          onClose={() => setUpdatePlaylist(false)}
          videos={channelProfile.publishVideo || []}
          selectedPlaylist={selectedPlaylist}
        />
        {(isUpdatingPlaylist || isFetchingPlaylist || isAddingVideo) && <ScreenLoader />}
        <div className="lg:w-[35%] mt-18 rounded-md m-4 border backdrop-blur-3xl relative overflow-hidden border-neutral-700 hidden lg:block w-full">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-2xl scale-150"
            style={{
              backgroundImage: `url(${selectedPlaylist.videos[0].thumbnail})`,
            }}
          ></div>

          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 h-full flex flex-col overflow-hidden">
            <div className="flex justify-center items-center p-4">
              <div className="card md:w-72 lg:w-80 xl:w-11/12 shadow-sm">
                <figure className="relative rounded-md overflow-hidden">
                  <video
                    src={selectedPlaylist.videos[0].videofile}
                    alt="Thumbnail"
                    className="w-5/6 h-auto rounded-lg aspect-video object-cover"
                    poster={selectedPlaylist.videos[0].thumbnail}
                  />
                </figure>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-base-200 px-5 py-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {
                loggedUser._id === selectedPlaylist.owner &&
                <div className="flex items-center gap-3 py-2">
                  <Link state={{ fromPlaylist: true, playlist: selectedPlaylist }} to={`/watch/${selectedPlaylist.videos[0]._id}`} className="rounded-full p-4 w-14 h-14 text-2xl flex justify-center items-center hover:bg-base-300/35 hover:text-primary">
                    <FaPlay />
                  </Link>
                  <button onClick={() => setUpdatePlaylist(true)} className="rounded-full p-4 w-14 h-14 text-2xl flex justify-center items-center hover:bg-base-300/35 hover:text-primary">
                    <MdEdit />
                  </button>
                </div>
              }

              <h1 className="text-2xl font-bold">{selectedPlaylist.name}</h1>
              <div className="flex items-center flex-wrap gap-3 py-1 w-full">
                <p className="text-xs lg:text-xs text-base-content/60 break-words">
                  {selectedPlaylist.description}
                </p>
              </div>
              <div className="flex gap-2 py-3 text-base-content/55 text-sm items-center">
                <div className="avatar cursor-pointer">
                  <div className="w-5 rounded-full ring-offset-2">
                    <img src={selectedPlaylist.user.avatar} />
                  </div>
                </div>
                {selectedPlaylist.user.fullName}
              </div>
            </div>

            <div className="w-full bg-base-200 text-base-content/65 py-4 px-5 mt-auto">
              <div className="flex justify-between text-sm">
                <div className="flex items-center">
                  <p>Playlist</p>
                  <BsDot className="text-xl" />
                  <p>Public</p>
                  <BsDot className="text-xl" />
                  <p>{selectedPlaylist.videoCount} videos</p>
                </div>
                <div className="text-sm">Created on 24 Oct</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-[65%] m-4 mt-18 rounded-md border backdrop-blur-3xl relative overflow-hidden border-neutral-700 block w-full">
          <div className="w-full h-full relative ">
            <div className="sticky top-0 flex w-full justify-between items-center font-bold text-sm lg:text-lg bg-base-200 p-3 lg:p-5 z-10">
              <h1>{selectedPlaylist.name}</h1>
              <div className='flex dropdown  dropdown-end justify-end p-2 text-sm lg:text-xl'>
                <SlOptionsVertical tabIndex={0} role="button" />
                <ul tabIndex={0} className="dropdown-content menu bg-base-300 rounded-box z-1 w-52 p-2 right-2 top-2 shadow-sm">
                  {loggedUser._id === selectedPlaylist.owner ? < li onClick={handelDeletePlaylist} className="hover:font-bold font-semibold" ><a className="text-error">Delete Playlist</a></li>
                    : <li className="hover:font-bold font-semibold" >Report</li>}
                </ul>
              </div>
            </div>
            <div className='overflow-y-auto h-full pb-12 md:pb-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
              {/* Add as many content items as you like to test scrolling */}
              {selectedPlaylist.videos.map((video) => (
                <div key={video._id} className=" p-3 flex md:gap-3 gap-1 transition-all duration-300 ease-in-out hover:bg-neutral rounded shadow">
                  <div className="card h-fit shadow-sm flex p-1 md:p-0 justify-center">
                    <Link state={{ fromPlaylist: true, playlist: selectedPlaylist }} to={`/watch/${video._id}`}>
                      <figure className="relative rounded-md overflow-hidden ">
                        {/* Image */}
                        <video
                          src={video.videofile}
                          alt="Shoes"
                          className="lg:w-54 w-40 aspect-video object-cover"
                          poster={video.thumbnail}
                          preload="metadata"
                          ref={videoRef}
                          onLoadedMetadata={handleLoadedMetadata}
                        />
                        <div className="absolute bottom-2 right-2  text-white flex items-center gap-1 bg-black/80 bg-opacity-60 p-1 rounded-sm">
                          <p className='text-xs text-center '>{formatVideoDuration(duration)}</p>
                        </div>
                      </figure>
                    </Link>
                  </div>
                  <div className='w-full '>
                    <Link state={{ fromPlaylist: true, playlist: selectedPlaylist }} to={`/watch/${video._id}`}>
                      <h1 className='lg:text-lg md:text-base text-sm font-semibold lg:font-bold'>{video.title}</h1>
                      <p className='text-xxs lg:text-xs text-base-content/60'>{selectedPlaylist.user.userName}</p>
                      <div className='flex items-center text-base-content/60 text-xxs md:text-sm  '>
                        <p>{video.views} view</p>
                        <BsDot className='text-xl' />
                        <p>{ formatTimeAgo(video.createdAt) }</p>
                      </div>
                    </Link>
                  </div>
                  <div className='flex dropdown  dropdown-end justify-end p-2 text-sm lg:text-xl'>
                    <SlOptionsVertical tabIndex={0} role="button" />
                    <ul tabIndex={0} className="dropdown-content menu bg-base-300 rounded-box z-1 w-52 p-2 right-2 top-2 shadow-sm">
                      <li className="hover:font-bold font-semibold" ><a>Not Intrested</a></li>
                      {(selectedPlaylist.owner == loggedUser._id && selectedPlaylist.videos.length > 1) && < li onClick={() => { handelRemoveVideo(); setRemoveVideo([video._id]) }} className="hover:font-bold font-semibold" ><a className="text-error">Remove</a></li>}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default PlaylistComponent