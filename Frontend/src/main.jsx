import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Navigate } from "react-router-dom";
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import MainLayout from './pages/MainLayout.jsx';
import Home from './pages/Home.jsx';
import Tweets from './pages/Tweets.jsx';
import LikedVideos from './pages/LikedVideos.jsx';
import Playlist from './pages/Playlist.jsx';
import Subscription from './pages/Subscription.jsx';
import History from './pages/History.jsx';
import Setting from './pages/Setting.jsx';
import Channel from './pages/Channel.jsx'
import { SidebarProvider } from './context/SiderbarToggle.jsx';
import { SearchPageProvider } from './context/SearchVideoLoad.jsx'
import Watch from './pages/Watch.jsx';
import CreateContent from './pages/CreateContent.jsx';
import { Provider } from 'react-redux';
import store from '../src/store/store.js';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AuthLoader from './Component/AuthLoader.jsx';
import UpdateVideo from './pages/UpdateVideo.jsx';
import PlaylistComponent from './Component/PlaylistComponent.jsx';
import PlaylistVideos from './Component/PlaylistVideos.jsx';
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />} >
      <Route path='' element={<MainLayout />}>
        <Route path='' element={<Home />} />
        <Route path='tweet' element={<Tweets />} />
        <Route path='likedVideos' element={<LikedVideos />} />
        <Route path="playlist" element={<Playlist />}>
          <Route index element={<Navigate to="my-playlist" replace />} />
          <Route path="my-playlist" element={<PlaylistVideos />} />
          <Route path=":playlistId" element={<PlaylistComponent />} />
        </Route>
        <Route path='subscriptions' element={<Subscription />} />
        <Route path='history' element={<History />} />
        <Route path='setting' element={<Setting />} />
        <Route path='channel/:userName' element={<Channel />} />
        <Route path='watch/:videoid' element={<Watch />} />
        <Route path='create' element={<CreateContent />} />
        <Route path='updateVideo/:videoid' element={<UpdateVideo />} />
      </Route>
      <Route path='login' element={<Login />} />
      <Route path='signup' element={<Signup />} />
    </Route>

  )
)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AuthLoader>
      <GoogleOAuthProvider clientId={`${import.meta.env.VITE_GOOGLE_CLIENT_ID}`}>
        <SearchPageProvider>
          <SidebarProvider>
            <RouterProvider router={router} />
          </SidebarProvider>
        </SearchPageProvider>
      </GoogleOAuthProvider>
    </AuthLoader>
  </Provider>
)
