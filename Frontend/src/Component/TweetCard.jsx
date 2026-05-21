import React, { useEffect, useState } from 'react'
import { FaRegShareSquare, FaShareSquare } from 'react-icons/fa';
import { FcLike } from 'react-icons/fc';
import { GoHeart } from 'react-icons/go';
import { SlOptionsVertical } from 'react-icons/sl';
import { BiComment, BiSolidComment } from "react-icons/bi";
import { useDispatch, useSelector } from 'react-redux';
import { toggleTweetLikeThunk } from '../store/likeStore.js';
import { addTweetCommentThunk, getTweetCommentsThunk } from '../store/commentStore.js';
import CommentCard from "./CommentCard";
import { deleteTweetThunk } from '../store/tweetStore.js';
import UpdateTweet from './UpdateTweet.jsx';
import { addHistoryThunk } from '../store/historyStore.js';
import ScreenLoader from './ScreenLoader.jsx';
import { toast } from 'react-toastify';
import { formatParagraphs } from '../utils/formatParagraphs.js';
import reportUser from '../utils/reportUser.js';
import { Link } from 'react-router-dom';

const TweetCard = ({ tweet }) => {
    const dispatch = useDispatch()
    const [isCommentActive, setIsCommentActive] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [isLikedTweet, setIsLikedTweet] = useState(tweet.isLikedTweet)
    const { loggedUser } = useSelector(state => state.authentication);
    const [tweetComments, setTweetComments] = useState([])
    const [value, setValue] = useState('')
    const [isUpdateTweet, setIsUpdateTweet] = useState(false)
    const [tweetLike, setTweetLike] = useState(tweet?.likeCount)
    const [tweetCommentLike, setTweetCommentLike] = useState(tweet.commentCount)
    const toggleExpanded = () => setExpanded(!expanded);
    const toggleLike = () => {
        dispatch(toggleTweetLikeThunk(tweet._id)).then((res) => {
            setIsLikedTweet(res.payload)
            dispatch(addHistoryThunk({ "tweetId": tweet._id }))
            if (isLikedTweet) {
                setTweetLike(tweetLike - 1)
            } else {
                setTweetLike(tweetLike + 1)
            }
        })
    }
    const formatted = formatParagraphs(tweet.description)

    const handelAddComent = () => {
        const payload = {
            tweetId: tweet._id,
            content: value
        }
        if (value) {
            dispatch(addTweetCommentThunk(payload)).then(() => {
                setValue('')
                dispatch(getTweetCommentsThunk(tweet._id)).then((res) => {
                    setTweetComments(res.payload.Comments);
                    setTweetCommentLike(tweetCommentLike + 1)
                });
            })
            dispatch(addHistoryThunk({ "tweetId": tweet._id }))
        }
    }
    const handleDelete = () => {
        dispatch(deleteTweetThunk(tweet._id))
    }

    const handleShare = (link) => {
        navigator.clipboard.writeText(`http://localhost:5173/channel/${link}`).then(() => {
            toast.info("Link Copied!")
        })
    }
    useEffect(() => {
        if (tweet.commentCount) {
            dispatch(getTweetCommentsThunk(tweet._id)).then((res) => setTweetComments(res.payload.Comments))
        }
    }, [])

    return (
        <div>
            {!tweet && <ScreenLoader />}
            <div className={`w-full relative shadow-lg bg-base-100 dark:bg-base-200 mb-2 overflow-hidden rounded-lg`}>
                <div className="h-full w-full flex flex-col justify-between">
                    <div className='w-full dropdown  dropdown-end flex justify-between items-center mb-3 h-12 px-4'>
                        <div className="flex items-start mt-6 pl-3 ">
                            <div className="avatar cursor-pointer pt-2">
                                <div className="ring-primary ring-offset-base-100 w-8 rounded-full ring-2 ring-offset-2">
                                    <img src={tweet.user?.avatar} />
                                </div>
                            </div>
                            <div className='pl-4 space-y-0.5'>
                                <h2 className="md:text-xl text-lg  font-semibold">{tweet.user?.fullName}</h2>
                                <p className='text-xs lg:text-xs text-base-content/60'>{tweet.user?.userName}</p>
                            </div>

                        </div>
                        <div>
                            <SlOptionsVertical tabIndex={0} role="button" className="text-xl mt-1 focus-within:outline-none cursor-pointer" />
                            <ul tabIndex={1} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 ml-1 shadow-sm">
                                {loggedUser?._id === tweet.user?._id ?
                                    <div>
                                        <li onClick={() => { setIsUpdateTweet(true) }} className="hover:font-bold font-semibold" ><a>Edit</a></li>
                                        <li onClick={handleDelete} className="hover:font-bold font-semibold" ><a className="text-error">Delete</a></li>
                                    </div>
                                    :
                                    <div>
                                        <li className="hover:font-bold font-semibold" ><Link to={`/channel/${tweet.user?.userName}`}>View Channel</Link></li>
                                        <li onClick={reportUser} className="hover:font-bold font-semibold" ><a className="text-error">Report</a></li>
                                    </div>
                                }

                            </ul>
                        </div>
                    </div>

                    <div className="w-full flex justify-center ">
                        <div className="text-left p-3 w-[95%]">
                            <h2 className="md:text-xl text-md font-bold my-2">{tweet.title}</h2>

                            <div className={`text-base-content/85  w-full md:text-base text-[10px] transition-all duration-300 ${expanded ? '' : 'line-clamp-5'}`}>{
                                formatted.map((p, i) => (
                                    <p
                                        key={i}
                                        dangerouslySetInnerHTML={{ __html: p }}
                                        className="mb-1"
                                    />
                                ))
                            }</div>
                            {tweet.description?.length > 462 && <button
                                className="mt-2 text-base-content/65 text-[10px] md:text-sm"
                                onClick={toggleExpanded}
                            >
                                {expanded ? 'Show less' : 'Show more'}
                            </button>}
                        </div>
                    </div>
                    {tweet.media && <div className="w-full h-[200px] md:h-[300px] px-2 rounded-lg bg-cover">
                        <img src={tweet.media} className='object-contain rounded-xl w-full h-full' />
                    </div>}
                    <div className="w-full flex p-2 justify-around items-center">
                        <div onClick={toggleLike} className="md:text-2xl text-xl flex flex-col items-center cursor-pointer m-1 w-fit">
                            {isLikedTweet ? <FcLike /> : <GoHeart />}
                            <p className="md:text-sm text-xs pt-1">{tweetLike}</p>
                        </div>
                        <div className="md:text-2xl text-xl  flex flex-col items-center cursor-pointer m-1 w-fit" onClick={() => setIsCommentActive(!isCommentActive)}>
                            {isCommentActive ? <BiSolidComment /> : <BiComment />}
                            <p className="md:text-sm text-xs pt-1">{tweetCommentLike}</p>
                        </div>
                        <div onClick={() => { handleShare(tweet.user.userName) }} className="md:text-2xl text-xl cursor-pointer m-1 w-fit">
                            <FaShareSquare />
                        </div>

                    </div>
                </div>
            </div>
            {/* {Comment Section} */}
            {isCommentActive && <div className="md:p-4 bg-base-200">
                {/* Header */}
                <h2 className="md:text-lg font-bold mt-4 mb-4">{tweetCommentLike} Comments</h2>

                {/* Input area */}
                <div className="flex gap-4">
                    <input
                        value={value}
                        onChange={(e) => { setValue(e.target.value) }}
                        type="text"
                        placeholder="Add a comment..."
                        className="input input-bordered w-full mb-4 md:mb-6"
                    />
                    <button disabled={!value} onClick={handelAddComent} className="btn btn-accent rounded-lg">Send</button>
                </div>

                {/* Single Comment Sample */}
                <div className="flex flex-col gap-4">
                    {tweetComments.length ? tweetComments.map(comment => <CommentCard key={comment._id} comment={comment} />)
                        : <div>No Comment</div>}
                </div>
            </div>}
            {isUpdateTweet && <UpdateTweet tweet={tweet} onClose={() => setIsUpdateTweet(false)} />}

        </div>
    )
}

export default TweetCard