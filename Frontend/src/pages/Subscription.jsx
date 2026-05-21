import React, { useEffect } from 'react'
import VideoCard from '../Component/VideoCard'
import { useSidebar } from '../context/SiderbarToggle.jsx'
import { useDispatch, useSelector } from 'react-redux';
import { getSubsribedChannelsThunk } from '../store/subscriptionStore.js';
import { Link } from 'react-router-dom';
import UserVideoCard from '../Component/UserVideoCard.jsx';
import SubscriptionSkeleton from '../Component/SkeletonLoading/SubscriptionSkeleton.jsx';
import LoginRequired from '../Component/LoginRequired.jsx';
const Subscription = () => {
  const { isOpen } = useSidebar();
  const dispatch = useDispatch()
  const { subscribedChannels, isFetchingSubChannels } = useSelector(state => state.subscription)
  const { loggedUser } = useSelector(state => state.authentication)
  if (!loggedUser) {
    return <LoginRequired />;
  }
  useEffect(() => {
    dispatch(getSubsribedChannelsThunk())
  }, [])

  if (isFetchingSubChannels) {
    return <SubscriptionSkeleton />

  }
  return (
    <div className={` overflow-y-scroll px-6  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full h-full transition-all duration-300 `}>
      <div className='w-full relative mt-28'>
        {subscribedChannels.length ? <div >
          <div className='text-xl pb-4 font-bold'>Channels {`( ${subscribedChannels.length} )`}</div>
          <div className=' bg-base-100 dark:bg-base-300 carousel carousel-end backdrop-blur-md z-50 items-center pr-8 p-4 flex gap-3 '>
            {
              subscribedChannels.map(item =>
                <Link key={item._id} to={`/channel/${item?.subscribeChannel.userName}`}>
                  <div className="avatar cursor-pointer pr-4 carousel-item">
                    <div className="ring-primary ring-offset-base-100 w-20 rounded-full ring-2 ring-offset-2">
                      <img src={`${item?.subscribeChannel.avatar}`} />
                    </div>
                  </div>
                </Link>)
            }
          </div>
          <div className='text-xl py-4  font-bold'>Videos </div>
          <div className="grid grid-cols-1   sm:grid-cols-2 md:grid-cols-2 mb-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
            {subscribedChannels.map(item => item.channelVideo.filter(video => video.isPublished).map(video => <UserVideoCard video={video} channel={item.subscribeChannel} />))}
          </div>

        </div>
          : <div className='text-center md:text-lg text-sm  text-base-content/70'>No Subscribed Channel</div>}
      </div>

    </div>
  )
}

export default Subscription