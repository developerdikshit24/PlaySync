import React, { useEffect, useState } from 'react'
import { SlOptionsVertical } from "react-icons/sl";
import { Link } from 'react-router-dom';
import VideoCard from '../Component/VideoCard.jsx'
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getChannelProfile } from '../store/authStore.js';
import ScreenLoader from '../Component/ScreenLoader.jsx';
import UserVideoCard from '../Component/UserVideoCard.jsx';
import SubscribeButton from '../Component/SubscribeButton.jsx';
import PlaylistVideos from '../Component/PlaylistVideos.jsx';
import PlaylistVideoCard from '../Component/PlaylistVideoCard.jsx';
import { getAllPlaylistThunk } from '../store/playlistStore.js';
import ChannelAbout from '../Component/ChannelAbout.jsx';
import { getUserTweetsByIdThunk } from '../store/tweetStore.js';
import TweetCard from '../Component/TweetCard.jsx';
import ChannelProfileSkeleton from '../Component/SkeletonLoading/ChannelProfileSkeleton.jsx';
import LoginRequired from '../Component/LoginRequired.jsx';
import { getAllChannelVideoViewsThunk } from '../store/videosStore.js';
import { toast } from 'react-toastify';
import reportUser from '../utils/reportUser.js';

const Channel = () => {
  const dispatch = useDispatch()
  const { loggedUser, channelProfile, isFindingChannel } = useSelector(state => state.authentication);
  const [selectedTab, setSelectedTab] = useState('Video');
  const { allPlaylist, isFetchingPlaylist } = useSelector(state => state.playlist)
  const { allTweet, isFetchingTweet } = useSelector(state => state.tweet)
  const { channelVideosView, isdeleting } = useSelector(state => state.video)

  const { userName } = useParams()
  const Tabs = ['Video', 'Playlist', 'Tweet', 'About'];

  if (!loggedUser) {
    return <LoginRequired />;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`http://localhost:5173/channel/${userName}`).then(() => {
      toast.info("Link Copied!")
    })
  }

  useEffect(() => {
    if (userName) {
      dispatch(getChannelProfile(userName)).then((res) => {
        dispatch(getAllPlaylistThunk(res.payload?._id));
        dispatch(getUserTweetsByIdThunk(res.payload?._id));
        dispatch(getAllChannelVideoViewsThunk(res.payload._id))
      });
    }
  }, [userName]);

  if (isFindingChannel || isFetchingPlaylist || isFetchingTweet) {
    return <ChannelProfileSkeleton />;
  }

  return (
    <div className={`h-full overflow-y-scroll  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full transition-all duration-300`}>
      {isdeleting && <ScreenLoader />}
      <div className='w-full mt-18 h-auto dark:bg-base-200 '>
        <div className='w-full flex flex-col '>
          {/* Opion Button */}
          <div className='w-full pr-6 md:pt-5 pt-4 bg-base-200 cursor-pointer dropdown dropdown-end flex justify-end md:text-2xl text-lg sm:text-xl'>
            <SlOptionsVertical tabIndex={0} />
            <ul tabIndex={0} className="dropdown-content menu bg-base-300 rounded-box z-1 w-52 p-2 ml-1 shadow-sm">
              <li onClick={handleCopy} className="hover:font-bold font-semibold" ><a>Copy Url</a></li>
              {loggedUser?._id === channelProfile?._id ? <li className="hover:font-bold font-semibold" ><Link to={'/setting'}>Edit</Link></li>
                : <li onClick={reportUser} className="hover:font-bold font-semibold" ><a className="text-error">Report</a></li>
              }
            </ul>
          </div>
          <div className='w-full flex justify-around bg-base-200'>
            <div className='flex w-full sm:px-6 px-4 md:px-10 pb-2 gap-4 '>
              <div className='flex justify-center items-center'>
                <div className="avatar cursor-pointer pb-14 md:pb-0">
                  <div className="ring-primary ring-offset-base-100  w-16 sm:w-20 md:w-30 rounded-full ring-2 ring-offset-2">
                    <img src={`${channelProfile?.avatar}`} />
                  </div>
                </div>
              </div>
              <div className=' w-full flex flex-col md:flex-row justify-between '>
                <div className='flex md:w-1/2 w-full justify-between h-full flex-col'>
                  <div className='md:p-3 p-2'>
                    <h1 className='text-lg sm:text-xl md:text-3xl font-bold'>{channelProfile?.fullName}</h1>
                    <p className='text-xs sm:text-sm text-base-content/65'>@{channelProfile?.userName}</p>
                  </div>
                  <div className='flex gap-5 p-1 md:p-3 md:text-base sm:text-sm text-xs'>
                    <div className='text-center font-semibold'>
                      <p>{channelProfile?.subscribersCount}</p>
                      <a className='text-base-content/35'>Subscribers</a>
                    </div>
                    <div className='text-center font-semibold'>
                      <p>{channelProfile?.channelSubscribedToCount}</p>
                      <a className='text-base-content/35'>Subscribed</a>
                    </div>

                  </div>
                </div>
                <div className='md:w-1/2 w-full flex justify-end items-end text-white md:p-4 p-2'>
                  <SubscribeButton isSubscribe={channelProfile?.isSubscribed} channelId={channelProfile?._id} />
                </div>
              </div>
            </div>
          </div>
          <div className='flex sm:gap-3 md:gap-4 bg-base-200  sm:pl-2 md:pl-4 border-t border-t-accent/65 pt-2'>
            {Tabs.map((tab, index) => {
              return <button key={index} onClick={() => { setSelectedTab(tab) }} className={`btn btn-sm ${selectedTab === tab && 'text-primary btn-active '}  md:btn-m btn-ghost font-semibold`}>{tab}</button>
            })}
          </div>
          <div className='w-full relative '>
            <div className="md:px-6 py-4 w-full flex dark:bg-base-300 h-full">
              <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-2 mb-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                {selectedTab === 'Video' &&
                  channelProfile?.publishVideo
                    .filter(video => {
                      const isOwner = loggedUser?._id === video?.owner;
                      return isOwner || video.isPublished;
                    })
                    .map(video => (
                      <UserVideoCard
                        key={video._id}
                        video={video}
                        channel={channelProfile}
                      />
                    ))
                }

                {selectedTab === 'Playlist' && <PlaylistVideoCard playlist={allPlaylist} />}
              </div>
              {selectedTab === 'About' && <ChannelAbout totalViews={channelVideosView} about={channelProfile} />}
              {selectedTab === 'Tweet' && <div className='container md:w-2/3 m-auto'>{allTweet.length ? allTweet.map(tweet => <TweetCard key={tweet._id} tweet={tweet} />) : <div> No Tweet Available</div>} </div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Channel