import { BsDot } from 'react-icons/bs';
import { SlOptionsVertical } from 'react-icons/sl';
import React, { forwardRef, memo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteVideoThunk } from '../store/videosStore';
import { formatTimeAgo } from '../utils/formatTimeAgo';
import reportUser from '../utils/reportUser.js';
import formatVideoDuration from '../utils/formatVideoDuration.js';

const UserVideoCard = forwardRef(({ video, channel }, ref) => {
    const dispatch = useDispatch();
    const Navigate = useNavigate()
    const [duration, setDuration] = useState(0);
    const videoRef = useRef();

    const handleLoadedMetadata = () => {
        if (videoRef.current?.duration) {
            setDuration(videoRef.current.duration);
        }
    };
    const { loggedUser } = useSelector(state => state.authentication);

    const handleDeleteVideo = (videoId) => {
        dispatch(deleteVideoThunk(videoId)).then(() => {
            Navigate(0);
        });
    }
    return (
        <div ref={ref} className="card bg-base-100 dark:bg-base-300 hover:bg-base-200 transition-all ease-in-out duration-300 shadow-sm w-full">

            <Link to={`/watch/${video._id}`}>
                <figure className="relative aspect-video overflow-hidden">
                    <video
                        src={`${video.videofile}`}
                        className="w-full h-full object-cover rounded-md"
                        poster={video?.thumbnail}
                        preload="metadata"
                        ref={videoRef}
                        onLoadedMetadata={handleLoadedMetadata}
                    />
                    <div className="absolute bottom-2 right-2  text-white flex items-center gap-1 bg-black/80 bg-opacity-60 p-1 rounded-sm">
                        <p className='text-sm text-center '>{formatVideoDuration(duration)}</p>
                    </div>
                </figure>
            </Link>

            <div className="flex  justify-between px-2 pb-2">
                <div className='flex gap-4'>
                    <div className="avatar block cursor-pointer mt-3 pl-1">
                        <div className="ring-primary ring-offset-base-100 w-8 rounded-full ring-2 ring-offset-2">
                            <img src={`${channel?.avatar}`} />
                        </div>
                    </div>

                    <div>
                        {/* Make only title clickable */}
                        <Link to={`/watch/${video?._id}`}>
                            <h2 className="card-title pt-2 line-clamp-1">{video?.title}</h2>
                        </Link>

                        <div className='flex items-center gap-3 py-1'>
                            <p className='text-xs lg:text-xs text-base-content/60'>{channel?.userName}</p>
                        </div>

                        <div className='flex items-center text-base-content/60 text-xs '>
                            <p>{video?.views} views</p>
                            <BsDot className='text-xl' />
                            <p>{formatTimeAgo(video?.createdAt)}</p>
                        </div>
                    </div>
                </div>
                <div className='flex dropdown dropdown-end justify-end pt-4 text-sm lg:text-lg'>
                    <SlOptionsVertical tabIndex={0} role="button" />
                    {loggedUser._id === channel?._id ? <ul tabIndex={0} className="dropdown-content menu bg-base-300 rounded-box z-1 w-52 p-2 ml-1 shadow-sm">
                        <li className="hover:font-bold font-semibold" ><Link to={`/updateVideo/${video._id}`}>Edit</Link ></li>
                        <li className="hover:font-bold font-semibold" ><a onClick={() => { handleDeleteVideo(video._id) }} className="text-error">Delete</a></li>
                    </ul>
                        :
                        <ul tabIndex={0} className="dropdown-content menu bg-base-300 rounded-box z-1 w-52 p-2 ml-1 shadow-sm">
                            <li className="hover:font-bold font-semibold" ><Link to={`/channel/${channel?.userName}`}>View Channel</Link ></li>
                            <li onClick={reportUser} className="hover:font-bold font-semibold" ><a className="text-error">Report</a></li>
                        </ul>}
                </div>
            </div>
        </div>
    );
});

export default UserVideoCard;
