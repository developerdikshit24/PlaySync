import { useState, useRef } from 'react'
import { BsDot } from 'react-icons/bs'
import { SlOptionsVertical } from 'react-icons/sl'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { deleteHistoryItemThunk } from '../store/historyStore'
import { formatTimeAgo } from '../utils/formatTimeAgo'
import formatVideoDuration from '../utils/formatVideoDuration.js';

const HistoryVideoCard = ({ video }) => {
    const dispatch = useDispatch();
    const [duration, setDuration] = useState(0);
    const videoRef = useRef();

    const handleLoadedMetadata = () => {
        if (videoRef.current?.duration) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleRemoveVideo = () => {
        const payload = { 'videoId': video._id }
        dispatch(deleteHistoryItemThunk(payload))
    }
    return (
        <div className="carousel-item h-full">
            <div className="p-2 flex md:gap-4 gap-1 transition-all duration-300 ease-in-out hover:bg-base-200 rounded shadow w-full">
                <div className="card h-fit shadow-sm flex p-1 md:p-0 justify-center">
                    <Link to={`/watch/${video._id}`}>
                        <figure className="relative rounded-md overflow-hidden ">
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
                <div className='w-full md:p-2'>
                    <Link to={`/watch/${video._id}`}>
                        <h1 className='lg:text-lg md:text-base text-sm font-semibold lg:font-bold'>{video.title}</h1>
                        <p className='text-xxs lg:text-xs text-base-content/60'>{video.owner.userName}</p>
                        <div className='flex items-center text-base-content/60 text-xxs md:text-sm  '>
                            <p>{video.views} view</p>
                            <BsDot className='text-xl' />
                            <p>{formatTimeAgo(video.createdAt)}</p>
                        </div>
                    </Link>
                </div>
                <div className='flex dropdown  dropdown-end justify-end p-2 text-sm lg:text-xl'>
                    <SlOptionsVertical tabIndex={0} role="button" />
                    <ul tabIndex={0} className="dropdown-content menu bg-base-200 rounded-box z-1 w-52 p-2 right-2 top-2 shadow-sm">
                        <li onClick={handleRemoveVideo} className="hover:font-bold font-semibold" ><a className="text-error">Remove</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default HistoryVideoCard