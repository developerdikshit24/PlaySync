import { useEffect, useRef, useState } from 'react'
import VideoPlayer from '../Component/VideoPlayer'
import { CgAdd } from 'react-icons/cg';
import { MdCancel, MdOutlineContentCopy } from "react-icons/md"
import { useSidebar } from '../context/SiderbarToggle.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { uploadVideoOnCloudThunk, deleteVideoFromCloudThunk, publishVideoThunk, addDraftVideoInUpload, removeDraftVideoInUpload } from '../store/videosStore.js'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { addDraftVideo, addDraftVideoThunk, removeDraftVideoThunk } from '../store/authStore.js';
import LoginRequired from '../Component/LoginRequired.jsx';
import { addVideoInPlaylistThunk, getAllPlaylistThunk } from '../store/playlistStore.js';
import ScreenLoader from '../Component/ScreenLoader.jsx';

const CreateContent = () => {

  const dispatch = useDispatch()
  const { isUploading, uploadedVideo, isPublishing } = useSelector(state => state.video);
  const { loggedUser, draftVideo } = useSelector(state => state.authentication);
  const { allPlaylist, isAddingVideo } = useSelector(state => state.playlist)
  const [selected, setSelected] = useState('public');
  const [isThumbnailFileUploaded, setIsThumbnailFileUploaded] = useState(null)
  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const { setIsOpen } = useSidebar();
  const { register, handleSubmit, reset } = useForm();
  const Navigate = useNavigate();
  const [preview, setPreview] = useState(null)

  const handelUploadThumbnail = () => {
    thumbnailInputRef.current.click();
  };
  const handelUploadVideo = () => {
    videoInputRef.current.click();
  };

  const handleVideoFile = (e) => {
    const file = e.target.files[0];
    dispatch(uploadVideoOnCloudThunk(file))
      .then((res) => {
        dispatch(addDraftVideoThunk({ 'videoUrl': res.payload }))
      });

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
  const handelRemoveUploadedVideo = () => {
    dispatch(removeDraftVideoThunk(uploadedVideo));
    dispatch(deleteVideoFromCloudThunk(uploadedVideo));
    dispatch(removeDraftVideoInUpload());

    setPreview("");
  }

  const handleVideoPublish = (data) => {
    const payload = {
      title: data.title,
      description: data.description,
      video: uploadedVideo,
      thumbnail: isThumbnailFileUploaded,
      isPublished: (selected === 'public')
    }


    dispatch(publishVideoThunk(payload))
      .then((res) => {
        if (data.playlistId) {
          const playlistPayload = {
            videoId: res.payload._id,
            playlistId: data.playlistId
          }
          dispatch(addVideoInPlaylistThunk(playlistPayload))
        }
        dispatch(removeDraftVideoInUpload())
        dispatch(removeDraftVideoThunk(draftVideo))
        Navigate('/')
        setIsThumbnailFileUploaded('')
        setSelected('')
        setPreview("")
        reset()
      })

  }

  if (!loggedUser) {
    return <LoginRequired />;
  }

  useEffect(() => {
    setIsOpen(false)
    dispatch(getAllPlaylistThunk(loggedUser._id));

    if (loggedUser?.draftVideo) {
      dispatch(addDraftVideo(loggedUser.draftVideo))
      dispatch(addDraftVideoInUpload(loggedUser.draftVideo))
    }

  }, [loggedUser])

  return (
    <div className={`flex h-full gap-2 justify-center w-full  overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]  `}>
      {(isAddingVideo || isPublishing) && <ScreenLoader />}
      <div className='w-full flex mt-18 md:flex-row flex-col'>
        <div className='w-full md:w-3/5 px-2 md:px-6 pt-4 pb-1 '>
          {draftVideo ?
            <div className='relative'>
              <VideoPlayer src={draftVideo} />
              <p onClick={handelRemoveUploadedVideo} className='text-3xl z-40 cursor-pointer absolute -top-2 -right-2'><MdCancel /></p>
            </div>
            :
            <div className="max-w-[1280px] mx-auto flex flex-col">
              {isUploading ? <div className="lg:min-h-[522px] md:h-[400px] h-[200px] w-full flex flex-col items-center justify-center gap-4 bg-base-200 dark:bg-base-100 rounded-xl shadow-md border-2 border-dashed  transition-all duration-300">
                <span className="loading loading-spinner loading-lg text-primary" />
                <p className="text-lg md:text-xl font-semibold text-base-content">Uploading Video...</p>
              </div>
                : <div>
                  <div onClick={handelUploadVideo} className="aspect-video w-full gap-2 border-2 border-dashed border-neutral-400 cursor-pointer bg-base-300 dark:bg-base-100 flex flex-col justify-center items-center relative rounded-lg  transition-opacity duration-300">
                    <CgAdd className="w-1/2 h-1/2 text-base-content/65 z-20 transition-all ease-in-out duration-200" />
                    <span className="text-xs md:text-base text-base-content/65">Click To Upload Video</span>
                  </div>
                  <input
                    type="file"
                    ref={videoInputRef}
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoFile}
                  />
                </div>
              }

            </div>}
          <div className='w-full md:mt-4 mt-2 items-center rounded-md flex justify-center'>
            <p className='w-1/4 bg-base-200 flex justify-center md:text-base text-xs font-bold p-2 md:p-4'>Video URL</p>
            <p className='w-3/4 md:text-base text-base-content/40 text-xs bg-base-100 p-2 md:p-4'>The Url Show After Publish Video</p>
            <p className='md:p-4 p-2  text-base-content/40 bg-base-200'><MdOutlineContentCopy className='md:text-3xl pt-0.5' /></p>
          </div>
        </div>
        <div className='w-full md:w-2/5 bg-base-200 px-2 md:px-6 pt-4 rounded-tr-xl rounded-tl-xl md:overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] '>
          <h1 className='md:text-3xl text-xl font-bold pb-3 md:pb-4'>Details</h1>
          <form onSubmit={handleSubmit(handleVideoPublish)}>
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
                <div onClick={handelUploadThumbnail} className='w-30 h-18 bg-base-100 overflow-hidden relative cursor-pointer rounded-md flex justify-center border-2  border-dashed border-neutral-500 items-center '>
                  <CgAdd className='md:text-5xl absolute z-20 md:text-xl-content/85 transition-all ease-in-out duration-200 text-lg md:text-xl-content/65' />
                  <input
                    type="file"
                    ref={thumbnailInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleThumbnailFile}
                  />
                  {preview && <img src={`${preview}`} className='object-cover' alt="Image Preview" />}
                </div>
              </div>
              <div>
                <legend className="fieldset-legend">Automatic</legend>
                <div className="w-30 h-18 bg-base-100 rounded-md flex border-2 border-dashed border-neutral-500 justify-center items-center ">
                  {uploadedVideo && (
                    <video
                      src={uploadedVideo}
                      preload="metadata"
                      muted
                      playsInline
                      onPlay={(e) => e.target.pause()}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  )}
                </div>
              </div>

            </fieldset>

            <fieldset className="w-full mt-2">
              <legend className="text-base md:text-lg font-semibold">Playlist</legend>
              <div className="w-full rounded-md ">
                <select
                  {...register('playlistId')}
                  defaultValue=""
                  className="select select-bordered bg-base-200 md:w-full"
                >
                  <option value="" className='text-[8px] md:text-[18px]' disabled>Select Playlist</option>
                  {allPlaylist.length ? allPlaylist?.map((playlist) => (
                    <option className='w-fit text-[8px] md:text-[18px]  p-2' key={playlist._id} value={playlist._id}>
                      {playlist.name}
                    </option>
                  )) : <option className='w-fit text-[8px] md:text-[16px]  p-2' disabled>No Playlists Available</option>}
                </select>
              </div>
            </fieldset>

            <fieldset className="fieldset mt-4">
              <legend className="text-lg md:text-xl font-bold">Visibility</legend>
              <div className="bg-base-100 p-6 rounded-xl shadow-xl w-full mt-2">
                <p className="text-xs md:text-sm text-gray-400 mb-4">
                  Choose when to publish and who can see your video
                </p>

                <div className="space-y-4">
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
                          Only you can watch your video in Channel Profile.
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
              <button disabled={(isAddingVideo || isPublishing)} className='btn btn-primary md:btn-md btn-sm '>{(isAddingVideo || isPublishing) ? <div>Publishing... <span class="loading loading-spinner loading-md"></span></div> : "Publish"}</button>
              <div className='btn btn-neutral md:btn-md btn-sm'>Cancel</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateContent