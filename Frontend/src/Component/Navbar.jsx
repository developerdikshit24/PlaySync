import { useState, useRef, useEffect } from 'react';
import { FaRegBell, FaBell, FaPlus } from "react-icons/fa";
import { TbSearch } from "react-icons/tb";
import { useSidebar } from '../context/SiderbarToggle.jsx';
import { useSearchPage } from '../context/SearchVideoLoad.jsx';
import { IoClose, IoArrowBack } from "react-icons/io5";
import { TbX } from "react-icons/tb"
import { TbLayoutSidebarLeftExpand, TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { Link, useNavigate } from 'react-router-dom';
import Notification from './Notification.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSearchVideo, removeSearchVideo } from '../store/videosStore.js';
import { useLocation } from "react-router-dom";
import { addRecentSearchThunk, removeRecentSearchThunk } from '../store/authStore.js';
import socket, { joinSocket } from '../utils/socket.js';
import { getUnseenCountThunk, incrementUnseen } from '../store/notification.js';

const Navbar = () => {
    const dispatch = useDispatch()
    const Navigate = useNavigate()
    const location = useLocation()
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearchbarActive, setIsSearchbarActive] = useState(false)
    const inputRef = useRef();
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [query, setQuery] = useState('')
    const { toggleSidebar, isOpen } = useSidebar();
    const { page, setHasMoreSearchVideo, setPage } = useSearchPage()
    const { loggedUser } = useSelector(state => state.authentication)
    const recentSearches = useSelector(state => state.authentication.loggedUser?.recentSearches)

    useEffect(() => { handleSearch(page) }, [page]);
    const { notificationsCount } = useSelector(state => state.notification);

    useEffect(() => {
        if (loggedUser) {
            joinSocket(loggedUser?._id);
            dispatch(getUnseenCountThunk())
        }
        socket.on('new-notification', () => {
            dispatch(incrementUnseen());
        });
        return () => socket.off('new-notification');
    }, [loggedUser?._id]);

    const handleSearch = (page) => {
        if (!query.trim()) {
            handleClear();
            return;
        }
        if (location.pathname !== '/') Navigate('/');
        if (page === 1) {
            dispatch(addRecentSearchThunk(query))
        }


        const payload = {
            page: page,
            query: query.trim(),
        }
        dispatch(getAllSearchVideo(payload))
            .then((res) => {
                setHasMoreSearchVideo(res.payload?.hasNextPage)

            })
        inputRef.current?.blur();
    }
    const handleClear = () => {
        setQuery("");
        setPage(1);
        setHasMoreSearchVideo(true)
        dispatch(removeSearchVideo())
    };

    const handleSearchClick = (item) => {
        setQuery(item);
        handleSearch(page);
    }
    const handleRemoveSearch = (search) => {
        dispatch(removeRecentSearchThunk(search))
    }
    
    return (
        <div className=" h-18 fixed z-50 top-0 w-full bg-base-100/90 dark:bg-base-300/80 backdrop-blur-md ">
            <div className="flex  justify-between md:px-4 px-1.5 items-center h-18"> 
                <div className='flex justify-center gap-2 md:gap-4 items-center'>
                    {location.pathname !== '/' && (
                        <Link to='/'>
                            <IoArrowBack className='md:text-4xl text-lg' />
                        </Link>
                    )}
                    <div className='w-11 p-1 rounded-full flex  cursor-pointer'>
                        {isOpen ? <TbLayoutSidebarLeftCollapse onClick={toggleSidebar} className='md:text-4xl text-3xl' /> : <TbLayoutSidebarLeftExpand onClick={toggleSidebar} className='md:text-4xl text-3xl' />}
                    </div>
                    <p className='md:text-3xl text-2xl select-none text-lobster'>PlaySync</p>
                </div>

                <div className="w-2/5 relative md:block hidden ">
                    <label className="input  bg-base-100 dark:bg-base-200 focus-within:outline-none focus-within:border-indigo-900 w-full h-10 rounded-2xl text-md flex items-center gap-2">
                        <input
                            type="text"
                            className="cursor-pointer focus:outline-none px-4 active:outline-none"
                            placeholder="Search"
                            value={query}
                            onChange={(e) => {
                                const value = e.target.value;
                                setQuery(value);
                                if (value.trim() === "") {
                                    handleClear();
                                }
                            }}
                            ref={inputRef}
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSearch(page);
                                }
                            }}
                        />
                        {query && (
                            <TbX
                                className="text-xl text-gray-500 hover:text-red-500 cursor-pointer"
                                onClick={handleClear}
                            />
                        )}
                        <TbSearch onClick={() => { handleSearch(page) }} className='text-2xl text-base-content hover:text-indigo-700 cursor-pointer' />
                    </label>

                    {showSuggestions && (
                        <div className="absolute top-17 left-0 w-full bg-base-200/90 backdrop-blur-md rounded-xl shadow-md p-4 z-10">
                            <div>
                                <p className="text-sm font-semibold mb-1 text-gray-500">Recent Searches</p>
                                <ul className="mb-2">
                                    {recentSearches?.length ?
                                        recentSearches.map((item, idx) => (
                                            <li onClick={() => handleSearchClick(item)} key={idx} className="cursor-pointer flex items-center justify-between hover:bg-base-200 px-2 py-1 rounded">
                                                {item}
                                                <TbX
                                                    className="text-xl text-gray-500 hover:text-red-500 cursor-pointer"
                                                    onClick={() => { handleRemoveSearch(item) }}
                                                />
                                            </li>
                                        )) : <li className='text-xs p-4' >No Search</li>
                                    }
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
                {/* Mobile View Searchbar */}
                <div>
                    <div className='flex items-center gap-3 md:gap-5  md:pr-3'>
                        {/* Search Icon */}
                        <div onClick={() => { setIsSearchbarActive(!isSearchbarActive) }} className={`block md:hidden rounded-full relative  ${isSearchbarActive && "bg-base-200"} `}>
                            <label className="cursor-pointer  focus-within:outline-none focus-within:border-indigo-900   h-14 w-14 rounded-2xl text-lg flex justify-center items-center gap-2">
                                {isSearchbarActive ? <IoClose onClick={handleClear} className='cursor-pointer text-3xl' /> : <TbSearch className='text-3xl  hover:text-indigo-700' />}
                            </label>
                        </div>

                        <Link to={'/create'}>
                            <div className={`w-fit shadow-lg gap-2 text-xl  h-10 flex justify-center p-2 items-center rounded-full ${location.pathname === '/create' ? 'bg-base-100' : 'bg-base-200'} cursor-pointer`} >
                                <FaPlus  />
                                <p className={`text-sm hidden md:block ${location.pathname === '/create' && 'text-primary'} font-bold`}>Create</p>
                            </div>
                        </Link>

                        <div onClick={() => { setIsNotificationOpen(!isNotificationOpen) }} className='w-10 pt-2' >
                            <div className='indicator cursor-pointer h-full'>
                                {notificationsCount > 0 && <span className="indicator-item badge px-1 pb-0.5 font-bold rounded-full bg-[#e1002d]">{notificationsCount > 9 ? '9+' : notificationsCount}</span>}
                                {isNotificationOpen ? <FaBell className='text-3xl' /> : <FaRegBell className='text-3xl' />}
                            </div>
                        </div>
                        {isNotificationOpen && <Notification className='text-3xl' />}
                            <Link to={`channel/${loggedUser?.userName}`}>
                                <div className="avatar hidden md:block cursor-pointer">
                                    <div className="ring-primary ring-offset-base-100 w-10 rounded-full ring-2 ring-offset-2">
                                        <img src={loggedUser ? loggedUser?.avatar : 'https://res.cloudinary.com/dcehtpeqy/image/upload/v1745830813/nspjjtm5udb4vbgx5wen.jpg'} />
                                    </div>
                                </div>
                            </Link>
                    </div>
                </div>
            </div>
            {isSearchbarActive && <div className="w-3/4 relative left-12  md:hidden block transition-all ease-in-out duration-500 ">
                <label className="input cursor-pointer bg-base-100 dark:bg-base-200 focus-within:outline-none focus-within:border-indigo-900 w-full h-12 rounded-2xl text-lg flex items-center gap-2">
                    <input
                        type="text"
                        className="cursor-pointer focus:outline-none px-4 active:outline-none"
                        placeholder="Search"
                        value={query}
                        onChange={(e) => {
                            const value = e.target.value;
                            setQuery(value);
                            if (value.trim() === "") {
                                handleClear();
                            }
                        }}
                        ref={inputRef}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSearch(page);
                            }
                        }}
                    />
                    {query && (
                        <TbX
                            className="text-xl text-gray-500 hover:text-red-500 cursor-pointer"
                            onClick={handleClear}
                        />
                    )}
                    <TbSearch onClick={() => { handleSearch(page) }} className='text-2xl text-base-content hover:text-indigo-700 cursor-pointer' />
                </label>

                {showSuggestions && (
                    <div className="absolute top-17 left-0 w-full bg-base-200/90 backdrop-blur-md rounded-xl shadow-md p-4 z-10">
                        <div>
                            <p className="text-sm font-semibold mb-1 text-gray-500">Recent Searches</p>
                            <ul className="mb-2">
                                {recentSearches?.length ?
                                    recentSearches.map((item, idx) => (
                                        <li onClick={() => handleSearchClick(item)} key={idx} className="cursor-pointer flex items-center justify-between hover:bg-base-200 px-2 py-1 rounded">
                                            {item}
                                            <TbX
                                                className="text-xl text-gray-500 hover:text-red-500 cursor-pointer"
                                                onClick={() => { handleRemoveSearch(item) }}
                                            />
                                        </li>
                                    )) : <li className='text-xs p-4' >No Search</li>
                                }
                            </ul>
                        </div>
                    </div>
                )}
            </div>}
        </div>
    )
}

export default Navbar