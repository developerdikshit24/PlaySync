import React from 'react';
import { BsDot } from 'react-icons/bs';
import { SlOptionsVertical } from 'react-icons/sl';
import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { formatTimeAgo } from '../utils/formatTimeAgo';
import { useRef } from 'react';
import { useState } from 'react';
import reportUser from '../utils/reportUser.js';
import formatVideoDuration from '../utils/formatVideoDuration.js';
const VideoCard = forwardRef(({ video }, ref) => {
    const [duration, setDuration] = useState(0);
    const videoRef = useRef();

    const handleLoadedMetadata = () => {
        if (videoRef.current?.duration) {
            setDuration(videoRef.current.duration);
        }
    };


    return (
        <div ref={ref} className="card bg-base-100 overflow-hidden dark:bg-base-300 hover:bg-base-200 transition-all ease-in-out duration-300 shadow-lg w-full">
            {/* ✅ Wrap only clickable area in <Link> */}
            <Link className='overflow-hidden rounded-lg' to={`/watch/${video._id}`}>
                <figure className="relative aspect-video rounded-lg overflow-hidden">
                    <video
                        src={`${video.videofile}`}
                        preload="metadata"
                        ref={videoRef}
                        onLoadedMetadata={handleLoadedMetadata}
                        className="w-full h-full object-cover rounded-lg"
                        poster={video?.thumbnail}
                        title={video?.title}
                    />
                    <div className="absolute bottom-2 right-2  text-white flex items-center gap-1 bg-black/80 bg-opacity-60 p-1 rounded-sm">
                        <p className='text-sm text-center '>{formatVideoDuration(duration)}</p>
                    </div>
                </figure>
            </Link>

            <div className="flex justify-between px-2 pb-2">
                <div className='flex gap-4'>
                    <div className="avatar block cursor-pointer mt-3 pl-1 ">
                        <div className="ring-primary ring-offset-base-100 w-8 rounded-full ring-2 ring-offset-2">
                            <img src={`${video.Owner.avatar}`} />
                        </div>
                    </div>

                    <div>
                        <Link to={`/watch/${video._id}`}>
                            <h2 className="card-title pt-2 line-clamp-1">{video.title}</h2>
                        </Link>

                        <div className='flex items-center gap-3 py-1'>
                            <p className='text-xs lg:text-xs text-base-content/60'>{video.Owner.fullName}</p>
                        </div>

                        <div className='flex items-center text-base-content/60 text-xs '>
                            <p>{video.views} views</p>
                            <BsDot className='text-xl' />
                            <p>{formatTimeAgo(video.createdAt)}</p>
                        </div>
                    </div>
                </div>
                <div className='flex dropdown dropdown-end justify-end pl-2 pt-3 text-sm lg:text-lg'>
                    <SlOptionsVertical tabIndex={0} role="button" />
                    <ul tabIndex={0} className="dropdown-content menu bg-base-300 rounded-box z-1 w-52 p-2 right-2 top-2 shadow-sm">
                        <li className="hover:font-bold font-semibold">
                            <Link to={`/channel/${video.Owner.userName}`} className="text-base-content">View Channel</Link>
                            <button onClick={reportUser} className="text-error">Report</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
});

export default VideoCard
