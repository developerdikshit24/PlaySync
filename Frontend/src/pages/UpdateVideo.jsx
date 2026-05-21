import { useEffect, useRef, useState } from 'react'
import VideoPlayer from '../Component/VideoPlayer'
import { CgAdd } from 'react-icons/cg';
import { MdOutlineContentCopy } from "react-icons/md"
import { useSidebar } from '../context/SiderbarToggle.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getVideoByIdThunk, updateVideoThunk } from '../store/videosStore.js'
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ScreenLoader from '../Component/ScreenLoader.jsx';
const CreateContent = () => {
    const dispatch = useDispatch()
    const { isUpdating, selectedVideo } = useSelector(state => state.video);
    const { loggedUser } = useSelector(state => state.authentication)
    const [selected, setSelected] = useState('private');
    const [isThumbnailFileUploaded, setIsThumbnailFileUploaded] = useState(null)
    const thumbnailInputRef = useRef(null);
    const { setIsOpen } = useSidebar();
    const { register, handleSubmit, setValue } = useForm();
    const Navigate = useNavigate()
    const { videoid } = useParams()
    const [preview, setPreview] = useState(null)

    useEffect(() => {
        if (videoid) {
            dispatch(getVideoByIdThunk(videoid))
                .then(() => {
                    setValue('title', selectedVideo?.title)
                    setValue('description', selectedVideo?.description)
                    setSelected(selectedVideo?.isPublished ? 'public' : 'private')
                })
        }
        setIsOpen(false)
    }, [videoid])

    const handelUploadThumbnail = () => {
        thumbnailInputRef.current.click();
    };

    const handleThumbnailFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setPreview(reader.result);
            };

            reader.readAsDataURL(file);
            setIsThumbnailFileUploaded(file);
        }
    };

    const handleVideoUpdate = (data) => {
        const payload = {
            id: selectedVideo._id,
            title: data.title,
            description: data.description,
            isPublished: selected === 'public',
            thumbnail: isThumbnailFileUploaded
        }
        dispatch(updateVideoThunk(payload))
            .then(() => { Navigate(`/channel/${loggedUser.userName}`) })

    }

    return (
        <div className={`flex h-full gap-2 justify-center w-full `}>
            {isUpdating && <ScreenLoader />}
            <div className='w-full flex mt-18  md:flex-row flex-col  '>
                <div className='w-full md:w-3/5 md:h-full h-8/12 overflow-hidden px-2 md:px-6 pt-4  overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] '>
                    <div className='relative'>
                        <VideoPlayer src={selectedVideo?.videofile} thumbnail={selected?.thumbnail} title='The IIT Dream | Stand-up Comedy Special by Madhur Virli' />
                    </div>
                    <div className='w-full md:mt-4 mt-2 overflow-hidden rounded-md flex justify-center'>
                        <p className='w-1/4 bg-base-200 flex justify-center md:text-base text-sm font-bold p-2 md:p-4'>Video URL</p>
                        <Link to="/watch/6830af0367e7e65f90cc6239" target='_blank' className='w-3/4 md:text-base text-md bg-base-100 p-2 md:p-4'>http://localhost:5173/watch/6830af0367e7e65f90cc6239</Link>
                        <p className='md:p-4 p-2 cursor-pointer bg-base-200'><MdOutlineContentCopy className='md:text-3xl pt-0.5' /></p>
                    </div>
                </div>
                <div className='w-full md:w-2/5 h-4/5 md:h-auto bg-base-200 overflow-hidden px-2 md:px-6 pt-4 overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] '>
                    <h1 className='md:text-3xl text-xl font-bold pb-3 md:pb-4'>Details</h1>
                    <form onSubmit={handleSubmit(handleVideoUpdate)}>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend text-lg md:text-xl">Title</legend>
                            <input {...register('title')} type="text" className="input w-full focus-within:outline-none" placeholder="Type here" />
                        </fieldset>
                        <fieldset className="fieldset mt-2">
                            <legend className="fieldset-legend  text-lg md:text-xl">Desription</legend>
                            <textarea {...register('description')} className="textarea h-24 w-full focus-within:outline-none" placeholder="Descriptioon"></textarea>
                        </fieldset>
                        <fieldset className="fieldset flex  mt-2">
                            <legend className="fieldset-legend text-lg md:text-xl">Thumbnail</legend>
                            <div>
                                <legend className="fieldset-legend">Add New</legend>
                                <div onClick={handelUploadThumbnail} className='w-30 h-18 bg-base-100 relative cursor-pointer rounded-md flex justify-center border-2 overflow-hidden border-dashed border-neutral-500 items-center '>
                                    <CgAdd className='md:text-5xl absolute z-20 md:text-xl-content/85 transition-all ease-in-out duration-200 text-lg md:text-xl-content/65' />
                                    <input
                                        type="file"
                                        ref={thumbnailInputRef}
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleThumbnailFile}
                                    />
                                    <img src={preview ? `${preview}` : `${selectedVideo?.thumbnail}`} className='object-cover' alt="" />
                                </div>
                            </div>
                            <div>
                                <legend className="fieldset-legend">Automatic</legend>
                                <div className="w-30 h-18 bg-base-100 rounded-md flex border-2 border-dashed border-neutral-500 justify-center items-center overflow-hidden">
                                    <video
                                        src={`${selectedVideo?.videofile}`}
                                        preload="metadata"
                                        muted
                                        playsInline
                                        onPlay={(e) => e.target.pause()}
                                        className="w-full h-full object-cover pointer-events-none"
                                    />
                                </div>
                            </div>

                        </fieldset>
                        {/* TODO AUTOCHECK PLAYLIST AVAILABLE OR NOT */}
                        <fieldset className="fieldset mt-2">
                            <legend className="fieldset-legend text-lg md:text-xl">Playlist</legend>
                            <select disabled title='Add Video in Playlist from Playlist Section' className="select">
                                <option title='Add Video in Playlist from Playlist Section'>Add Video in Playlist from Playlist Section</option>
                            </select>
                        </fieldset>
                        <fieldset className="fieldset mt-4">
                            <legend className="text-lg md:text-xl font-bold">Visibility</legend>
                            <div className="bg-base-100 p-6 rounded-xl shadow-xl w-full mt-2">
                                <p className="text-xs md:text-sm text-gray-400 mb-4">
                                    Update who can see your video
                                </p>

                                <div className="space-y-4">
                                    {/* Private Option */}
                                    <div className="border border-base-300 rounded-lg p-4 cursor-pointer hover:border-primary transition"
                                        onClick={() => setSelected('private')}>
                                        <label className="flex items-start space-x-3">
                                            <input
                                                type="radio"
                                                name="visibility"
                                                className="radio radio-primary mt-1"
                                                checked={selected === 'private'}
                                                onChange={() => setSelected('private')}
                                            />
                                            <div>
                                                <p className="font-semibold">Private</p>
                                                <p className="text-xs md:text-sm text-gray-500">
                                                    Only you and people who you choose can watch your video
                                                </p>
                                            </div>
                                        </label>
                                    </div>

                                    {/* Public Option */}
                                    <div className="border border-base-300 rounded-lg p-4 cursor-pointer hover:border-primary transition"
                                        onClick={() => setSelected('public')}>
                                        <label className="flex items-start space-x-3">
                                            <input
                                                type="radio"
                                                name="visibility"
                                                className="radio radio-primary mt-1"
                                                checked={selected === 'public'}
                                                onChange={() => setSelected('public')}
                                            />
                                            <div>
                                                <p className="font-semibold">Public</p>
                                                <p className="text-xs md:text-sm text-gray-500">
                                                    Everyone can watch your video
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <div className='w-full flex gap-2 p-4'>
                            <button disabled={isUpdating} className='btn btn-primary md:btn-md btn-sm '>{(isUpdating) ? <div>Updating... <span className="loading loading-spinner loading-md"></span></div> : "Update"}</button>
                            <div className='btn btn-neutral md:btn-md btn-sm'>Cancel</div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateContent