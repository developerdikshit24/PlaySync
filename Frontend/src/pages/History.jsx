import React, { useEffect } from 'react'
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { deleteAllHistoryThunk, getAllHistoryThunk } from '../store/historyStore.js';
import HistoryVideoCard from '../Component/HistoryVideoCard.jsx';
import ScreenLoader from '../Component/ScreenLoader.jsx';
import HistoryTweetCard from '../Component/HistoryTweetCard.jsx';
import { setHistorySetting, toggelHistorySettingThunk } from '../store/authStore.js';
import HistoryPageSkeleton from '../Component/SkeletonLoading/HistorySkeleton.jsx'
import LoginRequired from '../Component/LoginRequired.jsx';
const History = () => {

  const dispatch = useDispatch();
  const { allHistory, isFetchingHistory, isUpdating } = useSelector(state => state.history)
  const { isHistorySave, isUpdateData, loggedUser } = useSelector(state => state.authentication)
  
  if (!loggedUser) {
    return <LoginRequired />;
  }

  useEffect(() => {
    dispatch(getAllHistoryThunk())
  }, [])

  const handleDeleteAllData = () => {
    dispatch(deleteAllHistoryThunk())
  }

  if (isFetchingHistory) {
    return <HistoryPageSkeleton/>
  }
  

  const handelToggleHistorySetting = () => {
    dispatch(toggelHistorySettingThunk()).then((res)=>{dispatch(setHistorySetting(res.payload))})
  }
  return (
    <div className={`flex h-full gap-2 w-full`}>
      {(isUpdating || isUpdateData) && <ScreenLoader />}
      {/* History Section */}
      <div className={`lg:w-[60%] mt-24 borderbackdrop-blur-3xl relative overflow-hidden "block lg:block w-full `}>
        <div className='w-full h-full overflow-y-scroll scroll-smooth pl-2  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
          <div className='p-4 text-3xl font-bold '>History</div>
          {/* Tweet History */}
          <div className='relative'>
            <div className='p-4 text-xl sticky top-0 bg-base-300 z-20 w-full font-bold'>Tweets</div>
            <div>
              <div className="carousel w-full bg-base-200 dark:bg-base-300">
                {Array.isArray(allHistory?.tweets) &&
                  allHistory.tweets.map((tweet, index) => (
                    <HistoryTweetCard key={tweet._id} tweet={tweet} index={index} total={allHistory.tweets.length} />
                  ))}
              </div>
            </div>
          </div>
          {/* Video watch history */}
          <div className='relative mt-4'>
            <div className='p-4 text-xl sticky top-0 bg-base-300 z-10 font-bold'>Videos</div>
            <div className="carousel carousel-vertical rounded-box w-full ">
              {Array.isArray(allHistory?.videos) && allHistory.videos.map(video => (
                <HistoryVideoCard key={video._id} video={video} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={`lg:w-[40%] mt-24 borderbackdrop-blur-3xl relative justify-center items-center  overflow-hidden p-2 "block lg:block hidden`}>
        <div className='w-full'>
          <h1 className='text-3xl p-2 font-bold'>Manage History</h1>
          <div className='p-2 text-sm text-base-content/60'>You can manage your history here. You can clear all history.</div>
          <div className='flex flex-col w-full p-4 gap-2'>
            <button onClick={handleDeleteAllData} className='btn btn-ghost w-fit rounded-md gap-3'> <RiDeleteBin6Line className='text-2xl text-error' /> Clear All History</button>
            <div className='flex justify-between w-full items-center p-4'>
              <div className={``}>Save My History</div>
              <input onChange={handelToggleHistorySetting } type="checkbox" checked={isHistorySave} className="toggle font-bold checked:text-primary toggle-sm" />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default History