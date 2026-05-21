import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNotificationsThunk, markAllSeenThunk, resetUnseen } from '../store/notification.js';
import ScreenLoader from './ScreenLoader.jsx';
import { formatTimeAgo } from '../utils/formatTimeAgo.js';
import { Link } from 'react-router-dom';
const Notification = () => {
    const dispatch = useDispatch();
    const { notifications, isFetchingNotifications } = useSelector(state => state.notification);
    useEffect(() => {
        if (!notifications.length) {
            dispatch(getNotificationsThunk())
        }
        dispatch(resetUnseen())
        dispatch(markAllSeenThunk())
    }, []);
   
    return (
        <div className=' md:w-xl w-sm flex h-fit flex-col  rounded-md absolute overflow-hidden top-14 right-1  lg:right-28 bg-base-300'>
            {isFetchingNotifications && <ScreenLoader />}
            <div className=' w-full h-full  overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
                <h1 className='font-bold sticky top-0 text-xl p-4 z-40 bg-base-200'>Notification</h1>
                {notifications.map(item => (
                    <div key={item._id} className=' w-full flex items-center '>
                        <div className='flex justify-between  gap-4 md:gap-2 p-4 w-full'>
                            <Link to={`/watch/${item.media.videoId}`}>
                                <div className='flex  gap-4 md:gap-3'>
                                    <div className="avatar md:pt-3 cursor-pointer">
                                        <div className="ring-primary ring-offset-base-100 w-12 h-12 rounded-full ring-2 ring-offset-2">
                                            <img src={item.uploaderInfo.avatar} />
                                        </div>
                                    </div>
                                    <div className='md:p-2 mext-xs md:text-md font-bold'>
                                        <h1>
                                            {item.media.title}
                                        </h1>
                                        <p className='text-sm text-base-content/60'>
                                            {item.uploaderInfo.fullName}
                                        </p>
                                        <p className='text-xs text-base-content/40 '>{formatTimeAgo(item.createdAt)}</p>
                                    </div>
                                </div>
                            </Link>
                            <div className="card h-fit md:flex hidden shadow-sm  p-1 md:p-0 justify-center">
                                <Link to={`/watch/${item.media.videoId}`}>
                                    <figure className="relative rounded-md overflow-hidden">
                                        {/* Image */}
                                        <img
                                            src={item.media.thumbnail}
                                            alt="Shoes"
                                            className="lg:w-30 w-20 h-auto"
                                        />
                                    </figure>
                                </Link>
                            </div>

                        </div>
                    </div>
                ))}

            </div>

        </div>
    )
}

export default Notification