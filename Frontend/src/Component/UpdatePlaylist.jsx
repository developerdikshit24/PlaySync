import React, { useState, useEffect } from 'react';
import { BsDot } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { updatePlaylistThunk, removeVideoFromPlaylistThunk, addVideoInPlaylistThunk } from '../store/playlistStore.js';
import { toast } from 'react-toastify';

const UpdatePlaylist = ({ isOpen, onClose, videos, selectedPlaylist }) => {
    const dispatch = useDispatch();
    const [selectedVideos, setSelectedVideos] = useState([]);
    const [initialVideos, setInitialVideos] = useState([]);
    const [removeVideos, setRemoveVideos] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (selectedPlaylist) {
            const initial = selectedPlaylist.videos.map(video => video._id);
            setName(selectedPlaylist.name || '');
            setDescription(selectedPlaylist.description || '');
            setSelectedVideos(initial);
            setInitialVideos(initial);
            setRemoveVideos([]);
        }
    }, [selectedPlaylist]);

    if (!isOpen) return null;

    const toggleVideo = (id) => {
        if (selectedVideos.includes(id)) {
            setSelectedVideos(prev => prev.filter(v => v !== id));
        } else {
            setSelectedVideos(prev => [...prev, id]);
        }
    };

    const markForRemoval = (id) => {
        setRemoveVideos(prev =>
            prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
        );
    };

    const handleUpdate = async () => {
        const remainingVideoCount = initialVideos.filter(id => !removeVideos.includes(id)).length;
        if (remainingVideoCount === 0) {
            toast.warning("Playlist must have at least one video.")
            return;
        }

        const updatedData = {
            playlistId: selectedPlaylist._id,
            name,
            description,
        };

        const newVideos = selectedVideos.filter(id => !initialVideos.includes(id));

        if (removeVideos.length > 0) {
            dispatch(removeVideoFromPlaylistThunk({ playlistId: selectedPlaylist._id, videoId: removeVideos }));
        }

        if (newVideos.length > 0) {
            dispatch(addVideoInPlaylistThunk({
                playlistId: selectedPlaylist._id,
                videoId: newVideos
            }));
        }

        dispatch(updatePlaylistThunk(updatedData)).then(() => {
            onClose();
            setSelectedVideos([]);
        });
    };


    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="bg-base-200 w-full max-w-3xl rounded-lg shadow-lg flex flex-col max-h-[90vh] overflow-hidden animate-scaleIn">
                <div className="p-5 border-b border-base-300 flex justify-between items-center">
                    <h2 className="text-lg font-bold">Update Playlist</h2>
                    <button className="btn btn-sm btn-circle btn-ghost" onClick={() => {
                        onClose();
                        setSelectedVideos([]);
                        setRemoveVideos([]);
                    }}>✕</button>
                </div>

                <div className="flex-1 p-5 overflow-y-auto w-full">
                    <div className="form-control mb-4 flex flex-col gap-2">
                        <label className="label font-medium">Title</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input input-bordered w-full"
                        />
                    </div>

                    <div className="form-control mb-4 flex flex-col gap-2">
                        <label className="label font-medium">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="textarea textarea-bordered w-full"
                        />
                    </div>

                    <h2 className="text-lg font-bold py-4">All Videos</h2>
                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-3">
                        {videos.filter(video => video.isPublished).map((video) => {
                            const isAlreadyInPlaylist = initialVideos.includes(video._id);
                            const isMarkedForRemoval = removeVideos.includes(video._id);
                            const isSelected = selectedVideos.includes(video._id);

                            return (
                                <div
                                    key={video._id}
                                    className={`card relative group border 
                                    ${isAlreadyInPlaylist && !isMarkedForRemoval ? 'border-success' : ''} 
                                    ${isMarkedForRemoval ? 'border-error' : ''} 
                                    ${!isAlreadyInPlaylist && isSelected ? 'border-primary' : 'border-base-300'}`}
                                >
                                    <figure className="relative">
                                        <video
                                            src={video.videofile}
                                            alt={video.title}
                                            className="w-full h-32 object-cover"
                                            poster={video.thumbnail}
                                        />

                                        {isAlreadyInPlaylist ? (
                                            <button
                                                className="absolute top-2 right-2 btn btn-xs btn-error opacity-0 group-hover:opacity-100 transition"
                                                onClick={() => markForRemoval(video._id)}
                                            >
                                                {isMarkedForRemoval ? "Undo" : "Remove"}
                                            </button>
                                        ) : (
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                readOnly
                                                className="checkbox checkbox-primary absolute top-2 left-2"
                                                onClick={() => toggleVideo(video._id)}
                                            />
                                        )}
                                    </figure>

                                    <div className="card-body p-2">
                                        <h2 className="text-md font-semibold">{video.title}</h2>
                                        <div className='flex items-center'>
                                            <p className='text-xs text-base-content/60 line-clamp-2'>{video?.description}</p>
                                        </div>
                                        <div className='flex w-fit text-base-content/60 text-xs'>
                                            <p>{video?.views} views</p>
                                            <BsDot className='text-xl' />
                                            <p>5 days ago</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="border-t border-base-300 p-4 flex justify-end">
                    <button
                        className="btn btn-primary"
                        onClick={handleUpdate}
                        disabled={!name.trim()}
                    >
                        Update Playlist
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdatePlaylist;
