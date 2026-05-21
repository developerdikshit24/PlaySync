import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Component/Navbar.jsx'
import SideBar from '../Component/SideBar.jsx'
import { useSidebar } from '../context/SiderbarToggle.jsx';
const MainLayout = () => {
    const { isOpen } = useSidebar();
    return (
        <div className='bg-base-100 w-full  fixed h-[100svh] dark:bg-base-300'>
            <div className="flex h-[100svh]  flex-col  bg-base-100 dark:bg-base-300 ">
                <Navbar />
                <div className="flex h-full overflow-y-auto justify-center transition-all ease-in-out duration-200">
                    <div className={`absolute xl:flex h-full flex-col z-40 bg-base-100 dark:bg-base-300 flex-1 ${isOpen ? "left-0 md:static " : "-left-full"} transition-all ease-in-out duration-500`}>
                        <SideBar />
                    </div>
                    <Outlet />
                </div >
            </div >
        </div >
    )
}

export default MainLayout