import GoogleLoginButton from '../Component/GoogleLoginButton'
import { Link } from 'react-router-dom'
import AuthText from '../Component/AuthText'
import { FaArrowRightLong } from 'react-icons/fa6'
import { useForm } from 'react-hook-form';
import { loginUserThunk } from '../store/authStore';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ScreenLoader from '../Component/ScreenLoader';
import { useEffect } from 'react';



const Login = () => {
  const Navigate = useNavigate()
  const { register, handleSubmit } = useForm();
  const {isAuthenticating, loggedUser} = useSelector((state) => state.authentication);
  const dispatch = useDispatch()
  const handleLogin = (data) => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.userId);
    let payload;
    if (isEmail) {
      payload = {
        email: data.userId,
        password: data.password
      }
    } else {
      payload = {
        userName: data.userId,
        password: data.password
      }
    }
    dispatch(loginUserThunk(payload))
     
  }

  useEffect(() => {
    if (loggedUser) Navigate('/')
  
  }, [loggedUser])
  

  return (
    <div className='dark:bg-base-300  w-full fixed h-[100svh]'>
      {isAuthenticating && <ScreenLoader />}
      <div className='w-full  h-full flex justify-center items-center'>
        <AuthText />
        <div className='w-2/5 h-auto flex flex-col bg-base-200/65 rounded-4xl backdrop-blur-md border border-neutral-700 '>
          <div className='flex w-full justify-between items-start p-4 '>
            <div className=' p-5 mt-16 py-3'>
              <h1 className='text-5xl text-lobster  font-extrabold '>Welcome back!</h1>
              <p className='text-sm p-1 text-base-content/60'> Doesn't have an account? <Link to={'/signup'} className='text-primary font-bold underline'>Sign up</Link></p>
            </div>
            <Link to={"/"} className='flex p-2 items-center gap-2 bg-base-100/40 rounded-lg text-xs border cursor-pointer hover:bg-base-100/65 transition-all ease-in-out duration-200 border-neutral-700 '>Back to website <span><FaArrowRightLong /></span> </Link>
          </div>
          <div className='w-full px-5 flex  justify-center  '>
            <form className='w-11/12 mb-4' onSubmit={handleSubmit(handleLogin)}>
              <fieldset className="fieldset">
                <legend  className="fieldset-legend">Username/Email</legend>
                <input {...register('userId')} type="text" autoComplete='username' className="input w-full lowercase bg-base-100/30 focus-within:outline-none focus-within:border-primary " placeholder="@username/email" />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Password</legend>
                <input {...register('password')} autoComplete='current-password' type="password" className="input w-full bg-base-100/30 focus-within:outline-none focus-within:border-primary" placeholder="Type here" />
                <p className='text-sm p-1 text-base-content/60'>forget password?</p>
              </fieldset>
              <button className='btn btn-accent w-full mt-4 text-md'>Login</button>
              <div className="divider font-bold">OR</div>
              <GoogleLoginButton />
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login