import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { updateTweetThunk } from '../store/tweetStore';
import ScreenLoader from './ScreenLoader';

const UpdateTweet = ({ tweet, onClose }) => {
    const dispatch = useDispatch()
    const [title, setTitle] = useState(tweet.title);
    const [description, setDescription] = useState(tweet.description);
    const { isUpdating } = useSelector(state => state.tweet);
    const handleUpdate = () => {
        if (tweet.title === title && tweet.description === description) {
            toast.info("No Changes Found")
        }
        const payload = {
            tweetId: tweet._id,
            title,
            description
        }
        dispatch(updateTweetThunk(payload)).then(() => {
            onClose()
        })
    }

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
            {isUpdating && <ScreenLoader />}
            <div className="bg-base-200 w-full max-w-3xl rounded-lg shadow-lg flex flex-col max-h-[90vh] overflow-hidden animate-scaleIn">
                <div className="p-5 border-b border-base-300 flex justify-between items-center">
                    <h2 className="text-lg font-bold">Update Tweet</h2>
                    <button className="btn btn-sm btn-circle btn-ghost" onClick={() => {
                        onClose();
                    }}>✕</button>
                </div>
                <div className="flex-1 p-5 overflow-y-auto w-full">
                    <div className="form-control mb-4 flex flex-col gap-2">
                        <label className="label font-medium">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => { setTitle(e.target.value) }}
                            className="input input-bordered w-full"
                            placeholder="Enter playlist title"
                        />
                    </div>

                    <div className="form-control mb-4 flex flex-col gap-2">
                        <label className="label font-medium">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => { setDescription(e.target.value) }}
                            className="textarea textarea-bordered h-fit w-full"
                            placeholder="Enter playlist description"
                        />
                    </div>
                    <div className="form-control mb-4 flex flex-col gap-2">
                        <label className="label font-medium">Media</label>
                        {tweet.media && <div className="w-full h-[200px] md:h-[300px] px-2 rounded-lg bg-cover">
                            <img src={tweet.media} className='object-contain rounded-xl w-full h-full' />
                        </div>}
                    </div>
                </div>
                <div className="border-t border-base-300 p-4 flex justify-end">
                    <button disabled={isUpdating}
                        className="btn btn-primary"
                        onClick={handleUpdate}
                    >
                        Update Tweet
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UpdateTweet

