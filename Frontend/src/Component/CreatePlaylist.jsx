import { useState } from 'react';
import { BsDot } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { createPlaylistThunk } from '../store/playlistStore.js';

const CreatePlaylist = ({ isOpen, onClose, videos }) => {
    const dispatch = useDispatch()
    const [selectedVideos, setSelectedVideos] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const { loggedUser } = useSelector(state => state.authentication);
    if (!isOpen) return null;

    const toggleVideo = (id) => {
        setSelectedVideos(prev =>
            prev.includes(id)
                ? prev.filter(vidId => vidId !== id)
                : [...prev, id]
        );
    };

    const handleCreate = () => {
        const playlistData = {
            _id: loggedUser._id,
            name,
            description,
            videos: selectedVideos,

        };
        dispatch(createPlaylistThunk(playlistData)).then(() => {
            setName('')
            setDescription('')
            setSelectedVideos([])
            onClose()
        })


    };
    
    return (
        <div className="fixed inset-0 z-50 bg-base-300/60 flex items-center justify-center">
            {/* Modal Container */}
            <div className="bg-base-200 dark:bg-base-200 w-full max-w-3xl rounded-lg shadow-lg flex flex-col max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="p-5 border-b border-base-300 flex justify-between items-center">
                    <h2 className="text-lg font-bold">Create Playlist</h2>
                    <button className="btn btn-sm btn-circle btn-ghost" onClick={() => {
                        onClose();
                        setSelectedVideos([]);
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
                            placeholder="Enter playlist title"
                        />
                    </div>

                    <div className="form-control mb-4 flex flex-col gap-2">
                        <label className="label font-medium">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="textarea textarea-bordered w-full"
                            placeholder="Enter playlist description"
                        />
                    </div>

                    {/* Video Grid */}
                    <h2 className="text-lg font-bold py-4">All Videos</h2>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-3">
                        {videos?.filter(video => video.isPublished).map((video) => {
                            const isSelected = selectedVideos.includes(video._id);
                            return (
                                <div
                                    key={video._id}
                                    className={`card border cursor-pointer ${isSelected ? 'border-primary' : 'border-base-300'
                                        }`}
                                    onClick={() => toggleVideo(video._id)}
                                >
                                    <figure className="relative">
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="w-full h-32 aspect-video object-cover"
                                        />
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            readOnly
                                            className="checkbox checkbox-primary absolute top-2 left-2"
                                        />
                                    </figure>
                                    <div className="card-body p-2">
                                        <h2 className="text-md font-semibold">{video.title}</h2>
                                        <div className='flex items-center'>
                                            <p className='text-xs lg:text-xs line-clamp-2 text-base-content/60'>{video?.description}</p>
                                        </div>
                                        <div className='flex w-fit text-base-content/60 text-xs '>
                                            <p className='w-fit'>{video?.views} views</p>
                                            <BsDot className='text-xl' />
                                            <p>5 days ago</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-base-300 p-4 flex justify-end">
                    <button
                        className="btn btn-primary"
                        onClick={handleCreate}
                        disabled={!name.trim() || selectedVideos.length === 0}
                    >
                        Create Playlist ({selectedVideos.length} videos)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePlaylist;
