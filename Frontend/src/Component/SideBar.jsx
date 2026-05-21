import React, { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AiOutlineHome, AiFillHome } from 'react-icons/ai';
import { BsPlayBtnFill, BsPlayBtn, BsCollectionPlay, BsCollectionPlayFill, BsFillSendFill } from "react-icons/bs";
import { MdOutlineHistory, MdOutlineThumbUpOffAlt, MdThumbUp } from "react-icons/md";
import { PiListPlusBold, PiListPlus } from "react-icons/pi";
import { IoSettingsOutline, IoSettings } from "react-icons/io5";
import { LuSend } from "react-icons/lu";
import { useSelector } from 'react-redux';

const SideBar = () => {
    const location =  useLocation()
    const { loggedUser } = useSelector(state => state.authentication);
    const SidebarSection = [
        { name: "Home", icon: <AiOutlineHome className='md:text-3xl text-xl text-base-content' />, path: '/' },
        { name: "Tweet", icon: <LuSend className='md:text-3xl text-xl text-base-content' />, path: '/tweet' },
        { name: "Subscription", icon: <BsCollectionPlay className='md:text-3xl text-xl text-base-content' />, path: '/subscriptions' },
        { name: "Your Channel", icon: <BsPlayBtn className='md:text-3xl text-xl text-base-content' />, path: `/channel/${loggedUser?.userName}` },
        { name: "Playlist", icon: <PiListPlus className='md:text-3xl text-xl text-base-content' />, path: '/playlist/my-playlist' },
        { name: "History", icon: <MdOutlineHistory className='md:text-3xl text-xl text-base-content' />, path: '/history' },
        { name: "Liked Videos", icon: <MdOutlineThumbUpOffAlt className='md:text-3xl text-xl text-base-content' />, path: '/likedvideos' },
        { name: "Setting", icon: <IoSettingsOutline className='md:text-3xl text-xl text-base-content' />, path: '/setting' },
    ]

    return (
        <div className={`relative  h-full xl:flex flex-col bg-base-300 dark:bg-base-300/5 backdrop-blur-sm overflow-y-scroll 
        flex-1 [&::-webkit-scrollbar]:hidden  [-ms-overflow-style:none] transition ease-in-out [scrollbar-width:none]`}>
            <div className='flex mt-18 flex-col xl:left-0  top-0 min-w-max w-fit z-40'>
                <div className='w-full flex  flex-col grow'>
                    {SidebarSection.map(item => <Link to={item.path} key={item.path} className={`btn btn-ghost ${location.pathname === item.path && 'text-primary bg-base-200'} transition-all duration-300 ease-in-out  justify-start md:py-8 py-6 flex items-center md:gap-6 gap-4 hover:bg-base-200 text-md md:text-lg my-0.5`}>{item.icon} {item.name}</Link>)}
                </div>
            </div>
        </div>
    )
}

export default SideBar