import { useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { SlOptionsVertical } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";
import { deleteCommentThunk, updateCommentThunk } from "../store/commentStore";
import { toggleCommentLikeThunk } from "../store/likeStore.js";
import { Link } from "react-router-dom";
import reportUser from '../utils/reportUser.js';
const CommentCard = ({ comment }) => {
    const dispatch = useDispatch()
    const { loggedUser } = useSelector(state => state.authentication);
    const [showReplies, setShowReplies] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false)
    const [updateComment, setUpdateComment] = useState(comment.content)
    const handelDelete = (commentId) => {
        dispatch(deleteCommentThunk(commentId))
    }
    const handleLikeComment = (commentId) => {
        dispatch(toggleCommentLikeThunk(commentId))
    }
    const handelUpdateComment = (commentId) => {
        const payload = {
            commentId,
            content: updateComment
        }
        dispatch(updateCommentThunk(payload)).then(() => {
            setIsUpdate(false)
        })
    }
    return (
        <div className="flex items-start h-fit gap-3 py-4 border-b border-base-300 hover:bg-base-200 px-4 rounded-lg transition-all ease-in-out duration-300">
            <div className="avatar ">
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <Link to={`/channel/${comment.user.userName}`}><img src={`${comment.user.avatar}`} alt="avatar" /></Link>
                </div>
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <Link to={`/channel/${comment.user.userName}`}><span className="font-semibold text-sm md:text-base">@{comment.user.userName}</span></Link>
                </div>
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        className="text-xs input disabled:input-ghost p-1.5 disabled:text-base-content h-fit md:text-sm mt-1"
                        disabled={!isUpdate}
                        value={updateComment}
                        onChange={(e) => { setUpdateComment(e.target.value) }}
                    />
                    {isUpdate &&
                        <div>
                            {comment.content === updateComment ?
                                <button
                                    className="btn btn-outline btn-sm"
                                    onClick={() => { setIsUpdate(false) }}
                                >
                                    Cancel
                                </button> :
                                <button
                                    onClick={() => { handelUpdateComment(comment._id) }}
                                    disabled={comment.content === updateComment}
                                    className="btn btn-primary btn-sm">update
                                </button>}


                        </div>
                    }
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <button onClick={() => { handleLikeComment(comment._id) }} className="flex items-center gap-1 hover:text-primary">
                        <FaThumbsUp className="text-xs" />
                        {comment.likes}
                    </button>
                    <button
                        onClick={() => setShowReplies(!showReplies)}
                        className="flex items-center gap-1 hover:text-secondary"
                    >
                        {showReplies ? <FaChevronUp /> : <FaChevronDown />}
                        {comment.replies} replies
                    </button>
                </div>
                {showReplies && (
                    <div className="mt-4 md:ml-8">
                        <input
                            type="text"
                            placeholder="Add a reply..."
                            className="input input-bordered w-full mb-4"
                        />
                        {Array(3).fill().map((_, index) => (
                            <div key={index} className="flex items-start gap-3 py-3 border-b border-base-300">
                                <div className="avatar">
                                    <div className="w-8 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
                                        <img
                                            src={`https://api.dicebear.com/7.x/thumbs/svg?seed=ReplyUser${index}`}
                                            alt="avatar"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm">@ReplyUser{index + 1}</span>
                                    </div>
                                    <p className="text-sm mt-1">This is a sample reply #{index + 1}</p>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                        <button className="flex items-center gap-1 hover:text-primary">
                                            <FaThumbsUp className="text-xs" />
                                            {Math.floor(Math.random() * 100)}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>

            <div className='flex dropdown  dropdown-end w-fit justify-end p-2  text-md'>
                <SlOptionsVertical tabIndex={0} role="button" className="cursor-pointer" />
                {
                    loggedUser?._id === comment.owner ?
                        <ul tabIndex={0} className="dropdown-content menu bg-base-300 rounded-box z-1 w-52 p-2 ml-1 shadow-sm">
                            <li onClick={() => { setIsUpdate(true) }} className="hover:font-bold font-semibold" ><a>Edit</a></li>
                            <li onClick={() => { handelDelete(comment._id) }} className="hover:font-bold font-semibold" ><a className="text-error">Delete</a></li>
                        </ul>
                        :
                        <ul tabIndex={0} className="dropdown-content menu bg-base-300 rounded-box z-1 w-52 p-2 ml-1 shadow-sm">
                            <li className="hover:font-bold font-semibold" ><Link to={`/channel/${comment.user.userName}`}>View User</Link></li>
                            <li onClick={reportUser} className="hover:font-bold font-semibold" ><a className="text-error">Report user</a></li>
                        </ul>
                }
            </div>
        </div >

    );
};


export default CommentCard