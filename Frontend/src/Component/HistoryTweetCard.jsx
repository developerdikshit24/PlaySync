import { SlOptionsVertical } from 'react-icons/sl'
import { useDispatch } from 'react-redux';
import { deleteHistoryItemThunk } from '../store/historyStore';
import { Link } from 'react-router-dom';

const HistoryTweetCard = ({ tweet, index, total }) => {
    
    const dispatch = useDispatch();
    const handleDeleteTweetFromHistory = () => {
        const payload = { tweetId: tweet._id };
        dispatch(deleteHistoryItemThunk(payload))
    };

    const currentId = `slide${index + 1}`;
    const prevId = `slide${index === 0 ? total : index}`;
    const nextId = `slide${(index + 1) % total === 0 ? 1 : (index + 2)}`;

    return (
        <div id={currentId} className="carousel-item relative w-full">
            <div className='mx-1 w-full'>
                <div className={`w-full relative mb-2 overflow-hidden bg-base-100 dark:bg-base-200 shadow-md rounded-lg`}>
                    <div className="h-full w-full flex flex-col justify-between pb-4">
                        {/* Top section: Avatar and options */}
                        <div className='w-full dropdown dropdown-end flex justify-between items-center mb-3 h-12 px-4'>
                            <Link to={`/channel/${tweet.owner.userName}`} className="flex items-start mt-6 pl-3 ">
                                <div className="avatar cursor-pointer">
                                    <div className="ring-primary ring-offset-base-100 w-8 rounded-full ring-2 ring-offset-2">
                                        <img src={tweet.owner.avatar} alt="avatar" />
                                    </div>
                                </div>
                                <div className='pl-4 space-y-0.5'>
                                    <h2 className="md:text-xl text-lg font-semibold">{tweet.owner.fullName}</h2>
                                    <p className='text-xs lg:text-xs text-base-content/60'>{tweet.owner.userName}</p>
                                </div>
                            </Link>
                            <div>
                                <SlOptionsVertical tabIndex={0} role="button" className="text-xl mt-1 focus-within:outline-none cursor-pointer" />
                                <ul tabIndex={1} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 ml-1 shadow-sm">
                                    <li onClick={handleDeleteTweetFromHistory} className="hover:font-bold font-semibold">
                                        <a className="text-error">Remove</a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Tweet content */}

                        <Link to={`/channel/${tweet.owner.userName}`} className="w-full flex justify-center">
                            <div className="text-left p-3 w-[95%]">
                                <h2 className="md:text-xl text-md font-bold my-2">{tweet.title}</h2>
                                <p className={`text-base-content/85 w-full md:text-base text-[10px] transition-all duration-300 line-clamp-2`}>
                                    {tweet.description}
                                </p>
                            </div>
                        </Link>

                        {/* Tweet image if present */}
                        {tweet.media && (
                            <div className="w-full h-[200px] md:h-[200px] px-2 rounded-lg bg-cover">
                                <img src={tweet.media} className='object-contain rounded-xl w-full h-full' alt="media" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Carousel navigation buttons */}
            <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between z-10">
                <a href={`#${prevId}`} className="btn btn-circle">❮</a>
                <a href={`#${nextId}`} className="btn btn-circle">❯</a>
            </div>
        </div>
    );
};

export default HistoryTweetCard;
