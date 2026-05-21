import { useEffect, useState } from "react";
import CommentCard from "./CommentCard";
import { useDispatch, useSelector } from "react-redux";
import { addCommentThunk, getVideoCommentsThunk } from "../store/commentStore";
import ScreenLoader from './ScreenLoader.jsx'

const CommentSection = () => {
    const dispatch = useDispatch()
    const { selectedVideo } = useSelector(state => state.video);
    const { videoComments, isFetchingComment, isDeleting } = useSelector(state => state.comment);
    const [comment, setComment] = useState('')
    const [commentCount, setCommentCount] = useState(selectedVideo?.commentCount)

    const handleComment = () => {
        if (comment.trim() == '') return
        const payload = {
            videoId: selectedVideo?._id,
            content: comment
        }
        setComment('')
        dispatch(addCommentThunk(payload)).then((res) => {
            if (selectedVideo) {
                dispatch(getVideoCommentsThunk(selectedVideo?._id))
                setCommentCount(prev => prev + 1)
            }
})
        
    }
    useEffect(() => {
        if (selectedVideo && !isDeleting) {
            dispatch(getVideoCommentsThunk(selectedVideo?._id))
        }
    }, [selectedVideo, isDeleting])

    if (isFetchingComment) {
        return <ScreenLoader />
    }
    return (
        <div className="md:p-4">
            <h2 className="md:text-lg font-bold mt-4 mb-4">{commentCount} Comments</h2>
            <div className="flex gap-4">
                <input
                    type="text"
                    value={comment}
                    onChange={(e) => { setComment(e.target.value) }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleComment();
                        }
                    }}
                    placeholder="Add a comment..."
                    className="input input-bordered w-full mb-4 md:mb-6"
                />
                <button disabled={!comment} onClick={handleComment} className="btn btn-accent rounded-lg">Send</button>
            </div>
            {isFetchingComment ? (
                <ScreenLoader />
            ) : Array.isArray(videoComments?.Comments) && videoComments.Comments.length > 0 ? (
                videoComments.Comments.map((comment) => (
                    <CommentCard key={comment._id} comment={comment} />
                ))
            ) : (
                <p>No Comments</p>
            )}

        </div>
    );
};

export default CommentSection;
