import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { changePasswordThunk } from '../store/authStore'
import { toast } from 'react-toastify'
const ChangePassword = () => {
    const dispatch = useDispatch()
    const { register, handleSubmit, reset } = useForm()

    const handleChangePassword = (data) => { 
        if (data.newPassword === data.confirmPassword) {
            dispatch(changePasswordThunk(data))
            reset()
        } else {
            toast.error("New Password and Confirm Password do not match");
        }
        
    }
    return (
        <div className='h-full'>
            <div className="flex flex-col h-full gap-4 p-6 overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" >
                <h1 className="text-2xl font-bold">Change Password</h1>
                <div className='flex w-full justify-center'>
                    <form onSubmit={handleSubmit(handleChangePassword)} className='md:w-4/5 w-full space-y-3 flex flex-col mt-4 justify-center'>
                        <input type="text" name="username" autoComplete="username" className="hidden" />
                        <legend className="fieldset-legend text-base-content/80">Old Password</legend>
                        <label className="input validator w-full">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path
                                        d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                                    ></path>
                                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                </g>
                            </svg>
                            <input
                                {...register('oldPassword')}
                                type="password"
                                required
                                placeholder="Password"
                                autoComplete="current-password"
                                minLength="8"
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                title="Old Password"
                            />
                        </label>
                        <legend className="fieldset-legend text-base-content/80">New Password</legend>
                        <label className="input validator w-full">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path
                                        d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                                    ></path>
                                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                </g>
                            </svg>
                            <input
                                type="password"
                                {...register('newPassword')}
                                required
                                placeholder="Password"
                                autoComplete="current-password"
                                minLength="8"
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                title="New Password"
                            />
                        </label>
                        <legend className="fieldset-legend text-base-content/80">Confirm Password</legend>
                        <label className="input validator w-full mb-1">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path
                                        d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                                    ></path>
                                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                </g>
                            </svg>
                            <input
                                type="password"
                                {...register('confirmPassword')}
                                required
                                placeholder="Password"
                                autoComplete="current-password"
                                minLength="8"
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                title="Confirm Password"
                            />
                        </label>
                        <p className="validator-hint mt-0 hidden"> Password Not Same </p>
                        <button type="submit" className='btn mt-4 w-fit btn-primary'>Change</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword