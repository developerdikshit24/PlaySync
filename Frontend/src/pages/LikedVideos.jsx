import { useEffect } from 'react'
import { BsDot } from 'react-icons/bs'
import { SlOptionsVertical } from 'react-icons/sl'
import { useDispatch, useSelector } from 'react-redux'
import { getAllLikeVideoContentThunk } from '../store/likeStore.js'
import UserVideoCard from '../Component/UserVideoCard.jsx'
import VideoSkeleton from '../Component/SkeletonLoading/VideoSkeleton.jsx'
import LoginRequired from '../Component/LoginRequired.jsx'
const LikedVideos = () => {
    const dispatch = useDispatch()
    const { likedVideoContent, isFetchingLikeVideo } = useSelector(state => state.like);
    const { loggedUser } = useSelector(state => state.authentication);

    if (!loggedUser) {
        return <LoginRequired />;
    }

    useEffect(() => {
        dispatch(getAllLikeVideoContentThunk())
    }, [])
    if (isFetchingLikeVideo) {
        return <div className='mt-18 w-full'>
            <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-2 mb-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 px-3">
                <VideoSkeleton />
            </div>
        </div>
    }
    return (
        <div className=' w-full mt-18 overflow-y-scroll  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>

            <div className="md:px-6 w-full  h-full dark:bg-base-300 bg-base-100">
                <div className='w-full'><p className='text-2xl p-5 font-bold '>Liked Videos {`(${likedVideoContent.length})`}</p></div>
                {likedVideoContent.length ? <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-2 mb-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                    {likedVideoContent.map(item => <UserVideoCard video={item?.videoContent} key={item._id} channel={item?.userData} />)}
                    {isFetchingLikeVideo &&
                        <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-2 mb-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                            <VideoSkeleton />
                        </div>}
                </div>
                    : <div className='text-center md:text-lg text-sm  text-base-content/70'>No Liked Videos</div>
                }
            </div>
        </div>
    )
}

export default LikedVideos
