import { useEffect, useRef, useState, useCallback, use } from "react";
import VideoCard from "../Component/VideoCard.jsx";
import { useDispatch } from 'react-redux';
import { getAllVideoThunk } from "../store/videosStore.js";
import { useSelector } from "react-redux";
import { useSearchPage } from "../context/SearchVideoLoad.jsx";
import VideoSkeleton from "../Component/SkeletonLoading/VideoSkeleton.jsx";

const Home = () => {
  const dispatch = useDispatch()
  const { allVideos, isFetchVideo, allSearchVideos } = useSelector(state => state.video);
  const [pages, setPages] = useState(1);
  const { setPage, hasMoreSearchVideo } = useSearchPage();
  const [hasMore, setHasMore] = useState(false);
  const allVideoObserver = useRef();
  const SearchVideoObserver = useRef();
  const fetchVideos = async (pages) => {
    dispatch(getAllVideoThunk(pages))
      .then((res) => {
        if (res.payload && typeof res.payload.hasNextPage !== "undefined") {
          setHasMore(res.payload.hasNextPage);
        } else {
          setHasMore(false);
        }
      });
  };

  useEffect(() => {
    fetchVideos(1);
  }, []);

  useEffect(() => {
    if (pages !== 1) fetchVideos(pages);
  }, [pages]);

  const lastAllVideoRef = useCallback(
    (node) => {
      if (allVideoObserver.current) allVideoObserver.current.disconnect();
      allVideoObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPages(prev => prev + 1);
        }
      });
      if (node) allVideoObserver.current.observe(node);
    },
    [hasMore]
  );

  const lastSearchVideoRef = useCallback(
    (node) => {
      if (SearchVideoObserver.current) SearchVideoObserver.current.disconnect();
      SearchVideoObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreSearchVideo) {
          setPage((prevPages) => prevPages + 1);
        }
      });
      if (node) SearchVideoObserver.current.observe(node);
    },
    [hasMoreSearchVideo]
  );
  return (
    <>
      <div className={`overflow-y-scroll  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full transition-all duration-300`}>
        <div className='w-full relative mt-18'>
          <div className="w-full h-full">
            <div className="md:px-6 py-4 w-full  h-full  dark:bg-base-300 bg-base-100">
              <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-2 mb-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                {allSearchVideos.length ?
                  allSearchVideos.filter(video => video.isPublished).map((item, index) => {
                    const isLast = index === allSearchVideos.length - 1;
                    return (<VideoCard key={index} video={item} ref={isLast ? lastSearchVideoRef : null} />);
                  }) :
                  allVideos.map((item, index) => {
                    const isLast = index === allVideos.length - 1;
                    return (<VideoCard key={index} video={item} ref={isLast ? lastAllVideoRef : null} />);
                  })}
                {isFetchVideo && <VideoSkeleton />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home