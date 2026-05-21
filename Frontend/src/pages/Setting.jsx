import React, { useEffect, useState } from 'react';
import { useSidebar } from '../context/SiderbarToggle.jsx';
import AccountSetting from '../Component/AccountSetting.jsx';
import ChangePassword from '../Component/ChangePassword.jsx';
import Theme from '../Component/Theme.jsx';
import ScreenLoader from '../Component/ScreenLoader.jsx';
import { useDispatch, useSelector } from 'react-redux';
import LoginRequired from '../Component/LoginRequired.jsx';
import { logoutThunk } from '../store/authStore.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Setting = () => {
  const { setIsOpen } = useSidebar();
  const dispatch = useDispatch()
  const Navigate = useNavigate()
  const { isUpdateData, loggedUser } = useSelector(state => state.authentication);
  const [activeTab, setActiveTab] = useState("account");

  useEffect(() => {
    setIsOpen(false);
  }, []);

  if (!loggedUser) return <LoginRequired />;

  const handleLogout = () => {
    if (loggedUser) {
      dispatch(logoutThunk()).then(() => {
        Navigate('/')
      })
    }
  }
  return (
    <div className="w-full mt-18 px-4 md:py-6 bg-base-200 dark:bg-base-300 flex flex-col gap-6 lg:flex-row">
      {isUpdateData && <ScreenLoader />}

      {/* Sidebar */}
      <div className="w-full lg:w-1/3 bg-base-100 dark:bg-base-200 rounded-md shadow-md flex flex-col justify-between">
        <div className="md:p-4 p-3">
          <h2 className="md:text-xl text-lg font-bold mb-4">Settings</h2>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab("account")}
              className={`btn w-full justify-start ${activeTab === "account" ? "btn-primary" : "btn-ghost"}`}
            >
              Account
            </button>
            <button
              onClick={() => setActiveTab("auth")}
              className={`btn w-full justify-start ${activeTab === "auth" ? "btn-primary" : "btn-ghost"}`}
            >
              Authentication
            </button>
            <button
              onClick={() => setActiveTab("theme")}
              className={`btn w-full justify-start ${activeTab === "theme" ? "btn-primary" : "btn-ghost"}`}
            >
              Appearance
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-3 md:p-4 border-t border-base-300">
          <button
            onClick={handleLogout} // Define this function in your component
            className="btn btn-outline w-fit border-1 border-error justify-start items-center hover:bg-error hover:text-white hover:border-transparent"
          >
            Logout
          </button>
        </div>
      </div>
      {/* Content */}
      <div className="w-full lg:w-2/3 bg-base-100 dark:bg-base-200 rounded-md shadow-md px-2 md:p-4">
        {activeTab === 'account' && <AccountSetting />}
        {activeTab === 'auth' && <ChangePassword />}
        {activeTab === 'theme' && <Theme />}
      </div>
    </div>
  );
};

export default Setting;
