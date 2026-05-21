import { FaPlus } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io"
import { LuSend } from "react-icons/lu";
import { GiCancel } from "react-icons/gi";
import { useSidebar } from '../context/SiderbarToggle.jsx';
import { useState, useRef, useEffect, use } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from "react-redux";
import { createTweetThunk, getAllTweetThunk } from "../store/tweetStore.js";
import TweetCard from "../Component/TweetCard.jsx";
import { toast } from "react-toastify";
import TweetPageSkeleton from "../Component/SkeletonLoading/TweetCardSkeleton.jsx";
import LoginRequired from "../Component/LoginRequired.jsx";

const Tweets = () => {
    const { isOpen } = useSidebar();
    const inputMediaRef = useRef()
    const dispatch = useDispatch()
    const { register, handleSubmit, reset } = useForm()
    const [isCreatePostAction, setIsCreatePostAction] = useState(false)
    const { loggedUser } = useSelector(state => state.authentication)
    const [preview, setPreview] = useState('');
    const [mediaUrl, setMediaUrl] = useState('')
    const { allTweet, isFetchingTweet } = useSelector(state => state.tweet)

    if (!loggedUser) {
        return <LoginRequired />;
    }
    const handleMediaClick = () => {
        inputMediaRef.current.click();
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
        setMediaUrl(file)
    };

    const handelCreateTweet = (data) => {
        if (!data) {
            toast.warning("Data is Required")
            return
        }
        data.mediafile = mediaUrl
        dispatch(createTweetThunk(data)).then(() =>
           { dispatch(getAllTweetThunk());
            reset()})

    }
    useEffect(() => {
        if (!allTweet.length) {
            dispatch(getAllTweetThunk())
        }
    }, [])
    
    if (isFetchingTweet) {
        return <TweetPageSkeleton/>
    }
    
    return (
        <div className={`flex  xl:h-full gap-2 justify-center w-full bg-base-200 dark:bg-base-300`}>
            <div className={`lg:w-[40%] max-w-md mt-18 md:m-4 md:mt-18 rounded-md backdrop-blur-3xl relative overflow-hidden shadow-lg ${isCreatePostAction ? "block lg:block w-full " : 'hidden  lg:block'} `}>
                <div style={{
                    backgroundImage: `url(${loggedUser?.avatar})`,
                }} className="absolute inset-0  bg-cover bg-center bg-no-repeat blur-2xl scale-150"></div>
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="relative z-10 h-full overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-4 md:p-0">
                    <div className='min-h-full w-full flex justify-center flex-col items-center '>
                        <div onClick={() => { setIsCreatePostAction(false) }} className="w-full lg:hidden block cursor-pointer">
                            <IoMdArrowRoundBack className="text-2xl" />
                        </div>
                        <form onSubmit={handleSubmit(handelCreateTweet)} className='flex h-full flex-col gap-5 w-4/5 justify-center items-center'>
                            <div className="avatar">
                                <div className="w-24 border-2 border-indigo-800 rounded-full ">
                                    <img src={loggedUser?.avatar} />
                                </div>
                            </div>
                            <input {...register('title')} type="text" placeholder="Title" className="input focus-within:border-indigo-800 focus-within:outline-none w-full mt-4" />
                            <textarea {...register('description')} className="textarea focus-within:outline-none focus-within:border-indigo-800 w-full" placeholder="Description"></textarea>
                            <div className='w-full flex justify-between'>
                                <div onClick={handleMediaClick} className='flex w-fit gap-2 hover:border-indigo-900  items-center btn '><FaPlus className='text-xl' /> Attach Media</div>
                                <input ref={inputMediaRef} onChange={handleFileChange} accept="image/*" className='hidden focus-within:outline-none' type="file" />
                                {preview && <div className='h-auto w-auto max-w-48 bg-cover relative rounded-md mb-4 max-h-46'>
                                    <img src={preview} className='object-contain w-full h-full' />
                                    <div onClick={() => { setPreview('') }} className='absolute z-50 -top-2 -right-2 bg-black p-1 rounded-full cursor-pointer text-xl'><GiCancel /></div>
                                </div>}

                            </div>
                            <button className='btn btn-accent mb-3 hover:border-indigo-700 text-xl' >Post <LuSend className='text-xl' /></button>
                        </form>
                    </div>
                </div>
            </div>
            <div className={`lg:w-[60%] w-full relative p-3 rounded-md  overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isCreatePostAction ? 'hidden lg:block' : "block lg:block"}`}>
                <div className='w-full  mt-16 flex gap-2 flex-col'>
                    {/* Button to create new tweet */}
                    <div className='lg:hidden flex  fixed bottom-8 z-30  h-auto items-center justify-between p-2'>
                        <div onClick={() => { setIsCreatePostAction(true) }} className='btn btn-ghost text-lg items-center flex gap-2 hover:bg-accent bg-base-100'>
                            <FaPlus className='text-xl' /> Create
                        </div>
                    </div>
                    {allTweet.length ? allTweet.map(tweet => <TweetCard key={tweet._id} tweet={tweet} />): <div> No Tweet Available</div>}
                </div >
            </div >
        </div >
    )
}

export default Tweets