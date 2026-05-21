import { useDispatch, useSelector } from 'react-redux';
import { checkAuthThunk } from '../store/authStore.js';
import { useEffect } from 'react';

const AuthLoader = ({ children }) => {
    const { isCheckAuth, isAuthentication } = useSelector(state => state.authentication);
    const theme = localStorage.getItem("theme") || 'dark'; 
    const dispatch = useDispatch();
    useEffect(() => {
        const verifyAuth = async () => {
            await dispatch(checkAuthThunk()).unwrap();
        };

        verifyAuth();
    }, [isAuthentication]);

    if (isCheckAuth) {
        return <div className='w-full h-[100svh] bg-base-100 dark:bg-base-300 flex items-center justify-center'>
            <p className={` ${theme === 'dark' ? 'welcomeTextDark' : 'welcomeTextLight'} select-none text-6xl`}>Welcome To PlaySync</p>
        </div>;
    }

    return children;
};

export default AuthLoader;
