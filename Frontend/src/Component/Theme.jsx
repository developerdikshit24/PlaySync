import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { updateUserThemeThunk } from '../store/authStore';

const Theme = () => {
    const { theme } = useSelector(state => state.authentication);
    const [Usertheme, setUserTheme] = useState(theme);
    const dispatch = useDispatch();

    useEffect(() => {
        if (theme && theme !== Usertheme) {
            setUserTheme(theme);
        }
    }, [theme]);

    const handleThemeChange = (value) => {
        setUserTheme(value);
        localStorage.setItem("theme", value);
        dispatch(updateUserThemeThunk(value))
    };

    return (
        <div className='h-full'>
            <div className="flex flex-col h-full gap-4 p-6 overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" >
                <h1 className="text-2xl font-bold">Theme</h1>
                <div className='flex w-full p-4'>
                    <div className='w-1/2 flex flex-col gap-4'>
                        <p className='flex justify-between'>
                            Light
                            <input
                                type="radio"
                                name="theme"
                                value="light"
                                checked={Usertheme === "light"}
                                onChange={(e) => handleThemeChange(e.target.value)}
                                className="radio radio-accent"
                            />
                        </p>
                        <p className='flex justify-between'>
                            Dark
                            <input
                                type="radio"
                                name="theme"
                                value="dark"
                                checked={Usertheme === "dark"}
                                onChange={(e) => handleThemeChange(e.target.value)}
                                className="radio radio-accent"
                            />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Theme;
