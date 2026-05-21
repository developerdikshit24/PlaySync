import React, { useEffect, useState } from 'react'
import { useSidebar } from '../context/SiderbarToggle.jsx';
import VideoPlayer from '../Component/VideoPlayer.jsx'
import { BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { IoIosShareAlt } from "react-icons/io";
import { SlOptions, SlOptionsVertical } from 'react-icons/sl';
import Description from '../Component/Description.jsx';
import CommentSection from '../Component/CommentSection.jsx'
import { Link, useLocation, useParams } from 'react-router-dom';
import { BsDot } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { addViewsThunk, getAllVideoThunk, getVideoByIdThunk, removeSelectedVideo } from '../store/videosStore.js';
import ScreenLoader from '../Component/ScreenLoader.jsx';
import SubscribeButton from '../Component/SubscribeButton.jsx';
import WatchVideoSkeleton from '../Component/SkeletonLoading/WatchVideoSkeleton.jsx'
import { getLikeVideoThunk, setVideoLike, toggleVideoLikeThunk } from '../store/likeStore.js';
import { addHistoryThunk } from '../store/historyStore.js';
import LoginRequired from '../Component/LoginRequired.jsx';
import { formatTimeAgo } from '../utils/formatTimeAgo.js'
import { toast } from 'react-toastify';
import reportUser from '../utils/reportUser.js';
const Watch = () => {
    const location = useLocation();
    const fromPlaylist = location.state?.fromPlaylist || false;
    const playlistData = location.state?.playlist || null;
    const dispatch = useDispatch()
    const { setIsOpen } = useSidebar();
    const { videoid } = useParams();
    const { isFetchVideo, selectedVideo, allVideos } = useSelector(state => state.video);
    const { likedVideos, isVideoLiked, isFetchingLikeVideo } = useSelector(state => state.like)
    const { loggedUser, isAuthenticating, isHistorySave } = useSelector(state => state.authentication)
    const [likeCount, setLikeCount] = useState(0)
    
    if (!loggedUser) {
        return <LoginRequired />;
    }

    useEffect(() => {
        setIsOpen(false);
        if (isHistorySave) {
            dispatch(addHistoryThunk({ "videoId": videoid }))
        }
        dispatch(removeSelectedVideo());
        dispatch(addViewsThunk({ "videoId": videoid }))
        dispatch(getAllVideoThunk());

    }, [videoid]);

    const handleLike = (videoId) => {
        dispatch(toggleVideoLikeThunk(videoId)).then(() => {
            dispatch(getLikeVideoThunk()).then(res => {
                if (res.payload.Video && res.payload.Video.length > 0) {
                    const isLiked = res.payload.Video.some(item => item.video === selectedVideo?._id);
                    dispatch(setVideoLike(isLiked));
                    if (isLiked) {
                        setLikeCount(likeCount + 1)
                    } else if (likeCount !== 0) {
                        setLikeCount(likeCount - 1)
                    }
                }
            })
        })
    }
    const handleDislike = (videoId) => {
        if (isVideoLiked) {
            handleLike(videoId)
        }
    }

    const handleShare = () => {
        navigator.clipboard.writeText(`http://localhost:5173/watch/${videoid}`).then(() => {
            toast.info("Link Copied!")
        })
    }

    useEffect(() => {
        if (selectedVideo && likedVideos.length > 0) {
            const isLiked = likedVideos.some(item => item.video === selectedVideo._id);
            dispatch(setVideoLike(isLiked));
            setLikeCount(selectedVideo.likeCount)
        }
    }, [isFetchingLikeVideo]);

    if (isFetchVideo || !selectedVideo) {
        return <WatchVideoSkeleton />
    }
    return (
        <div className={`flex xl:h-full gap-2 justify-center w-full`}>
            {isFetchingLikeVideo || isAuthenticating && <ScreenLoader />}
            <div className='w-full flex mt-18'>
                <div className='lg:w-3/4 flex w-full flex-col '>
                    <div className='rounded-lg h-full overflow-hidden px-2 md:px-6 md:pt-4  overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] '>

                        <div className="max-w-[1280px] w-full mx-auto">
                            <VideoPlayer src={selectedVideo.videofile} thumbnail={selectedVideo.thumbnail} title='The IIT Dream | Stand-up Comedy Special by Madhur Virli' />
                        </div>
                        {/* Channel and Like Section */}
                        <div className='w-full h-fit'>
                            <div className='p-1  md:p-2'>
                                <h1 className='md:text-2xl text-lg font-bold'>{selectedVideo.title} </h1>
                                <div className='flex items-center'>
                                    <p className='md:text-xs text-[8px] text-base-content/65'>{selectedVideo.views} views</p>
                                    <BsDot className='md:text-2xl text-xl' />
                                    <p className='md:text-xs text-[8px] text-base-content/65'>{formatTimeAgo(selectedVideo.createdAt)}</p>
                                </div>
                            </div>
                            <div className='flex w-full shadow-lg items-center md:flex-row mt-4 md:mt-2 justify-between flex-col  md:p-2'>
                                <div className='flex gap-2 w-full md:w-1/2 md:gap-4 mb-2 md:mb-0 px-1 md:px-0 justify-between items-center'>
                                    <Link className='flex gap-3 md:gap-4 justify-center items-center' to={`/channel/${selectedVideo.owner.userName}`}>
                                        <div className="avatar block cursor-pointer">
                                            <div className="ring-primary ring-offset-base-100 w-6 md:w-9 h-auto rounded-full ring-2 ring-offset-2">
                                                <img src={`${selectedVideo.owner.avatar}`} />
                                            </div>
                                        </div>
                                        <div className="flex flex-col ">
                                            <h1 className='md:font-bold font-semibold md:text-base text-sm'>{selectedVideo.owner.fullName}</h1>
                                            <p className='md:text-xs text-base-content/65 text-[9px]'>{selectedVideo.subscribers} subscribers</p>
                                        </div>
                                    </Link>
                                    <div className='flex md:ml-4'>
                                        <SubscribeButton isSubscribe={selectedVideo.isSubscribed} channelId={selectedVideo.owner._id} />
                                    </div>
                                </div>
                                <div className=' w-full md:w-fit flex md:gap-6 justify-between md:justify-center items-center'>
                                    <div className='flex items-center '>
                                        <button className='btn btn-ghost btn-xs md:btn-md bg-base-200 rounded-l-xl pr-2 shadow-lg border-r-2 border-r-base-100 text-[10px] md:text-base justify-center rounded-r-none'>
                                            {isVideoLiked ? <BiSolidLike onClick={() => { handleLike(selectedVideo._id) }} className='md:text-2xl text-lg' /> :
                                                <BiLike onClick={() => { handleLike(selectedVideo._id) }} className='md:text-2xl text-lg' />}{likeCount}</button>
                                        <button onClick={() => { handleDislike(selectedVideo._id) }} className='btn btn-ghost btn-xs shadow-lg md:btn-md bg-base-200 rounded-r-xl pl-2  rounded-l-none '><BiSolidDislike className='md:text-2xl text-lg ' /></button>
                                        <button onClick={handleShare} className='btn btn-xs md:btn-md ml-2 shadow-xl btn-ghost bg-base-200 rounded-xl md:text-base text-[10px] '><IoIosShareAlt className='md:text-2xl text-lg ' /> Share</button>
                                    </div>
                                    <div className='dropdown dropdown-end p-2 rounded-full hover:bg-base-200 transition-all ease-in-out duration-300'>
                                        <SlOptions tabIndex={0} role="button" className="md:text-xl  focus-within:outline-none cursor-pointer" />
                                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 ml-1 shadow-sm">
                                            <li className="hover:font-bold font-semibold" ><Link to={`/channel/${selectedVideo.owner.userName}`}>View Channel</Link></li>
                                            <li onClick={reportUser} className="hover:font-bold font-semibold" ><a className="text-error">Report</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='w-full'>
                            <Description text={`${selectedVideo.description}`} />
                        </div>
                        <div className='w-full'>
                            <CommentSection />
                        </div>
                    </div>
                </div>
                <div className='hidden w-2/5 flex-col md:flex overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
                    {fromPlaylist &&
                        <div className='min-h-4/5 pb-4'>
                            <div className=" rounded-md m-1 mt-2 h-full backdrop-blur-3xl border border-neutral-700 relative overflow-hidden hidden lg:block">
                                <div className="w-full h-full relative ">
                                    <div className="sticky top-0  w-full font-bold text-sm lg:text-lg bg-base-200 p-3 lg:p-5 z-10">
                                        {playlistData.name}
                                    </div>
                                    <div className='overflow-y-auto h-full space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
                                        {/* Add as many content items as you like to test scrolling */}
                                        {playlistData.videos.map((video) => (
                                            <div key={video._id} className={` p-3 shadow-lg flex md:gap-3 gap-1 transition-all duration-300 ease-in-out hover:bg-neutral ${video._id === selectedVideo._id && 'bg-primary/20 hover:bg-primary/30'} rounded shadow`}>
                                                <div className="card h-fit shadow-sm flex p-1 md:p-0 justify-center">
                                                    <Link state={{ fromPlaylist: true, playlist: playlistData }} aria-disabled={video._id === selectedVideo._id} to={`/watch/${video._id}`}>
                                                        <figure className="relative rounded-md overflow-hidden ">
                                                            <video
                                                                src={`${video.videofile}`}
                                                                alt="Shoes"
                                                                className="lg:w-56 w-40 aspect-video object-cover"
                                                                poster={video.thumbnail}
                                                            />
                                                        </figure>
                                                    </Link>
                                                </div>
                                                <div className='w-full shadow-lg '>
                                                    <Link state={{ fromPlaylist: true, playlist: playlistData }} to={`/watch/${video._id}`}>
                                                        <h1 className='lg:text-lg md:text-base text-sm font-semibold lg:font-bold'>{video.title}</h1>
                                                        <p className='text-xxs lg:text-xs text-base-content/60'>{playlistData.user.userName}</p>
                                                        <div className='flex items-center text-base-content/60 text-xxs md:text-sm  '>
                                                            <p>{video.views} view</p>
                                                            <BsDot className='text-xl' />
                                                            <p>{formatTimeAgo(video.createdAt)}</p>
                                                        </div>
                                                    </Link>
                                                </div>
                                                <div className='flex dropdown  dropdown-end justify-end p-2 text-sm lg:text-xl'>
                                                    <SlOptionsVertical tabIndex={0} role="button" />
                                                    <ul tabIndex={0} className="dropdown-content menu bg-base-300 rounded-box z-1 w-52 p-2 right-2 top-2 shadow-sm">
                                                        <li className="hover:font-bold font-semibold" ><a>Not Intrested</a></li>
                                                        {(playlistData.owner == loggedUser._id && playlistData.videos.length > 1) && < li onClick={() => { handelRemoveVideo(); setRemoveVideo([video._id]) }} className="hover:font-bold font-semibold" ><a className="text-error">Remove</a></li>}
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    <div className="w-full h-full relative ">
                        <div className=' h-full space-y-2 '>
                            <h1 className='p-3 font-bold top-0 w-full'>All Videos</h1>
                            {/* Add as many content items as you like to test scrolling */}
                            {allVideos.map((item, i) => {
                                return (
                                    <div key={item._id} className=" p-2 flex shadow-lg md:gap-4 gap-1 transition-all duration-300 ease-in-out hover:bg-base-200 rounded">
                                        <Link to={`/watch/${item._id}`}>
                                            <div className="card  w-40 h-24 shadow-sm flex p-1 md:p-0 justify-center">
                                                <figure className="relative rounded-md overflow-hidden">
                                                    {/* Image */}
                                                    <video
                                                        src={`${item.videofile}`}
                                                        alt="Shoes"
                                                        className="lg:w-50 w-40 h-auto object-contain"
                                                        poster={`${item.thumbnail}`}
                                                    />
                                                </figure>
                                            </div>
                                        </Link>
                                        <div className='w-full'>
                                            <Link to={`/watch/${item._id}`}>
                                                <h1 className='lg:text-lg md:text-base text-sm font-semibold lg:font-bold line-clamp-1'>{`${item.title}`}</h1>
                                                <p className='line-clamp-1 w-4/5  lg:text-xs'>{`${item.description}`} </p>
                                                <p className='text-xs lg:text-xs pb-1 text-base-content/60'>{`${item.Owner.userName}`}</p>
                                                <div className='flex items-center text-base-content/60 text-xxs md:text-sm  '>
                                                    <p>{`${item.views}`} view</p>
                                                    <BsDot className='text-xl' />
                                                    <p>{`${formatTimeAgo(item.createdAt)}`}</p>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className='flex dropdown  dropdown-end justify-end p-2 text-sm lg:text-xl'>
                                            <SlOptionsVertical tabIndex={0} role="button" />
                                            <ul tabIndex={0} className="dropdown-content menu bg-base-300 rounded-box z-1 w-52 p-2 right-2 top-2 shadow-sm">
                                                <li className="hover:font-bold font-semibold" ><Link to={`/channel/${`${item.Owner.userName}`}`}>View Channel</Link></li>
                                                <li onClick={reportUser} className="hover:font-bold font-semibold" ><a className="text-error">Report</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                )
                            }
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Watch