import React from 'react'
import { useForm } from 'react-hook-form';
import GoogleLoginButton from "../Component/GoogleLoginButton.jsx";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import AuthText from '../Component/AuthText.jsx';
import { useNavigate } from 'react-router-dom';
import { registerUserThunk } from '../store/authStore.js';
import { useDispatch, useSelector } from 'react-redux';
import ScreenLoader from '../Component/ScreenLoader.jsx';


const Signup = () => {
  const navigate = useNavigate()
  const { loggedUser, isAuthenticating } = useSelector(state => state.authentication)
  const dispatch = useDispatch()
  const { handleSubmit, register } = useForm()
  const handleCreateAccount = (data) => {
    dispatch(registerUserThunk(data))
      .then(() => {
        if (loggedUser) {
          navigate('/login')
        }
      })

  }

  return (
    <div className='dark:bg-base-300  w-full fixed h-[100svh]'>
      {isAuthenticating && <ScreenLoader />}
      <div className='w-full  h-full flex justify-center items-center'>
        <AuthText />
        <div className='w-2/5 flex flex-col bg-base-200/65 rounded-4xl backdrop-blur-md border border-neutral-700 '>
          <div className='flex w-full justify-between items-start p-4 '>
            <div className=' p-5 mt-8 py-3'>
              <h1 className='text-4xl text-lobster  font-extrabold '>Create new account</h1>
              <p className='text-sm p-1 text-base-content/60'>Have an account? <Link to={'/login'} className='text-primary font-bold underline'>Log in</Link></p>
            </div>
            <Link to={'/'} className='flex p-2 items-center gap-2 bg-base-100/40 rounded-lg text-xs border cursor-pointer hover:bg-base-100/65 active:bg-base-100/85 transition-all ease-in-out duration-200 border-neutral-700 '>Back to website <span><FaArrowRightLong /></span> </Link>
          </div>
          <div className='w-full px-5 flex justify-center  '>
            <form onSubmit={handleSubmit(handleCreateAccount)} className='w-11/12 mb-4 ' action="">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">FullName</legend>
                <input {...register('fullName')} type="text" aria-label='Fullname' className="input w-full bg-base-100/30 focus-within:outline-none focus-within:border-primary" placeholder="Type here" />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Username</legend>
                <input {...register('userName')} type="text" className="input w-full lowercase bg-base-100/30 focus-within:outline-none focus-within:border-primary " placeholder="@username" />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Email</legend>
                <input {...register('email')} type="text" className="input w-full bg-base-100/30 focus-within:outline-none focus-within:border-primary" placeholder="Type here" />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Password</legend>
                <input {...register('password')} type="text" className="input w-full bg-base-100/30 focus-within:outline-none focus-within:border-primary" placeholder="Type here" />
              </fieldset>
              <button className='btn btn-accent w-full mt-4 text-lg'>Create</button>
              <div className="divider font-bold">OR</div>
              <GoogleLoginButton />

            </form>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Signup