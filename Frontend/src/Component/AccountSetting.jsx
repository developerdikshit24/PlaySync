import { useEffect, useState, useRef, useCallback } from 'react'
import { FaCheck, FaPlus, FaTimes } from 'react-icons/fa';
import { MdAlternateEmail } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import Cropper from "react-easy-crop";
import getCroppedImg from '../constant.js';
import { updateAccountThunk, changeAvatarThunk } from '../store/authStore.js';
import { toast } from 'react-toastify';
import { FaInstagram, FaFacebook, FaSquareXTwitter } from "react-icons/fa6"

const AccountSetting = () => {
    const [isUpdate, setIsUpdate] = useState(false)
    const fileInputRef = useRef(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const { handleSubmit, setValue, register } = useForm()
    const { loggedUser, isUpdateData } = useSelector(state => state.authentication);
    const dispatch = useDispatch();
    useEffect(() => {
        setValue('email', loggedUser?.email);
        setValue('fullName', loggedUser?.fullName);
        setValue('userName', loggedUser?.userName);
        setValue('bio', loggedUser?.bio);
        setValue('socialMedia.Instagram', loggedUser?.socialMdiaLink?.Instagram)
        setValue('socialMedia.Twetter', loggedUser?.socialMdiaLink?.Twetter)
        setValue('socialMedia.Facebook', loggedUser?.socialMdiaLink?.Facebook)
    })
    const handleUpdate = (data) => {
        dispatch(updateAccountThunk(data))
        setIsUpdate(false)
    }
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setImageSrc(reader.result);
                setShowCropper(true);
            };
        }
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCropDone = async () => {
        try {
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            const file = new File([croppedImageBlob], "avatar.jpg", { type: "image/jpeg" });
            setShowCropper(false);
            dispatch(changeAvatarThunk(file))
        } catch (error) {
            toast.error(error)
        }
    };


    const handleCropCancel = () => {
        setShowCropper(false);
    };

    return (
        <div className='h-full'>
            <div className="flex flex-col h-full gap-4 md:p-6 p-4 overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" >
                <h1 className="md:text-2xl text-xl font-bold">Presonal Details</h1>
                <div className='w-full flex flex-col '>
                    <div className='w-full relative flex justify-center-safe '>
                        <div className="avatar cursor-pointer">
                            <div className="ring-primary ring-offset-base-100 md:w-18 w-14 rounded-full ring-2 ring-offset-2">
                                <img src={`${loggedUser?.avatar}`}  title='Profile Picture'/>
                            </div>
                            <button onClick={handleClick}
                                className='absolute z-20 text-sm md:text-lg cursor-pointer text-white -right-1 -bottom-1 bg-purple-700 rounded-full p-1'
                            >
                                <FaPlus />
                            </button>
                            <input ref={fileInputRef} type="file" accept='image/*' onChange={handleFileChange} className='hidden' />
                        </div>
                    </div>
                    <div className='flex w-full justify-center'>
                        <form className='md:w-4/5 w-full space-y-3 flex flex-col justify-center' onSubmit={handleSubmit(handleUpdate)}>
                            <legend className="fieldset-legend md:text-base text-sm text-base-content/80">FullName</legend>
                            <label className="input validator w-full focus-within:outline-none">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2.5"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </g>
                                </svg>
                                <input
                                    {...register('fullName')}
                                    type="text"
                                    required
                                    placeholder="fullname"
                                    pattern="[A-Za-z]+(?: [A-Za-z]+)*"
                                    minLength="3"
                                    maxLength="30"
                                    title="Full Name"
                                    className='w-full'
                                    disabled={!isUpdate}

                                />
                            </label>
                            <legend className="fieldset-legend md:text-base text-sm text-base-content/80">Username</legend>
                            <label className="input validator w-full focus-within:outline-none">
                                <MdAlternateEmail className="text-lg opacity-50" />
                                <input
                                    {...register('userName')}
                                    type="text"
                                    required
                                    placeholder="Username"
                                    pattern="[A-Za-z][A-Za-z0-9\-]*"
                                    minLength="3"
                                    maxLength="30"
                                    title="userName"
                                    disabled={!isUpdate}
                                />
                            </label>

                            <legend className="fieldset-legend md:text-base text-sm text-base-content/80">Email</legend>
                            <label className="input validator w-full focus-within:outline-none">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2.5"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                    </g>
                                </svg>
                                <input {...register('email')} title='Email' type="email" disabled placeholder="mail@site.com" />
                            </label>
                            <fieldset className="fieldset">
                                <legend className="fieldset-legend md:text-base text-sm text-base-content/80">Bio</legend>
                                <textarea {...register("bio")} disabled={!isUpdate} title='Bio' className="textarea w-full h-24 focus-within:outline-none" placeholder="Bio"></textarea>
                            </fieldset>
                            <legend className="fieldset-legend md:text-lg text-base text-base-content/80">Social Media Links</legend>
                            <div className='w-full px-4'>
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend text-sm text-base-content/80">Instagram</legend>
                                    <label className="input validator w-full focus-within:outline-none">
                                        <FaInstagram/>
                                        <input
                                            type="url"
                                            placeholder="https://"
                                            title="Instagram"
                                            disabled={!isUpdate}
                                            {...register('socialMedia.Instagram')}

                                        />
                                    </label>
                                </fieldset>
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend text-sm text-base-content/80">Facebook</legend>
                                    <label className="input validator w-full focus-within:outline-none">
                                        <FaFacebook/>
                                        <input
                                            type="url"
                                            placeholder="https://"
                                            title="Facebook"
                                            disabled={!isUpdate}
                                            {...register('socialMedia.Facebook')}
                                        />
                                    </label>
                                </fieldset>
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend  text-sm text-base-content/80">Twitter</legend>
                                    <label className="input validator w-full focus-within:outline-none">
                                        <FaSquareXTwitter/>
                                        <input
                                            type="url"
                                            placeholder="https://"
                                            title="Twitter"
                                            disabled={!isUpdate}
                                            {...register('socialMedia.Twetter')}
                                        />
                                    </label>
                                </fieldset>
                            </div>
                            <div className='w-full flex mt-2 justify-center'>
                                {isUpdate ? <button type='submit' className='btn btn-primary'>Save</button> : <div onClick={() => { setIsUpdate(true) }} className='btn btn-primary'>Update Details</div>}

                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {showCropper && (
                <div className='fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50'>
                    <div className='relative w-80 h-80 bg-gray-900 rounded-lg overflow-hidden'>
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                            cropShape="rect"
                            showGrid={false}
                        />
                    </div>
                    <div className='flex gap-8 mt-4 text-white'>
                        <button className='p-2 rounded-full' onClick={handleCropCancel}><FaTimes /></button>
                        <button className='p-2 rounded-full' onClick={handleCropDone}><FaCheck /></button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AccountSetting