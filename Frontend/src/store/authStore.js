import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from '../axiosConnection/axios.js';
import { toast } from 'react-toastify';
import { extractErrorMessage } from "../constant.js";



export const checkAuthThunk = createAsyncThunk('auth/checkAuth', async (_, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.get('/users/getuser');
        dispatch(setHistorySetting(res.data.data.isHistorySaved))
        return res.data.data
    } catch (error) {
        return rejectWithValue(extractErrorMessage(error.response.data) || "Unauthorized User")
    }
})

export const registerUserThunk = createAsyncThunk('auth/register', async (data, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.post('/users/register', data)
        toast.success(`Welcome ${res.data.data.fullName}`);
        return res.data.data

    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error")
        return rejectWithValue(extractErrorMessage(error.response.data) || "Internal Server Error");
    }
})

export const loginUserThunk = createAsyncThunk('auth/login', async (data, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.post('/users/login', data)
        toast.success(`Welcome Back ${res.data.data.user.fullName} `)
        return res.data.data.user
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error")
        return rejectWithValue(extractErrorMessage(error.response.data) || "Internal Server Error");
    }
})

export const googleLoginThunk = createAsyncThunk('auth/googleLogin', async (data, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.post("/users/googleauth", { token: data });
        toast.success(`Welcome ${res.data.data.user.fullName}`)
        return res.data.data.user
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error")
        return rejectWithValue(extractErrorMessage(error.response.data) || "Internal Server Error");
    }
})

export const logoutThunk = createAsyncThunk('auth/logout', async (_, { dispatch, rejectWithValue }) => {
    try {
        await axiosInstance.post('/users/logout');
        toast.success('Logout Successfully!');
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response.data) || 'Internal Server Error');
    }
})

export const changePasswordThunk = createAsyncThunk('auth/changePassword', async (data, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.patch('/users/changePassword', data);
        toast.success("Password Changed Successfully")
        return res.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response.data) || 'Internal Server Error');
    }
})

export const updateAccountThunk = createAsyncThunk('auth/updateAccount', async (data, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.patch('/users/updateDetails', data)
        toast.success("Account Update Successfully")
        return res.data.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response.data) || 'Internal Server Error');
    }
})

export const changeAvatarThunk = createAsyncThunk('auth/changeAvatar', async (data, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.patch('/users/changeAvatar', { 'avatar': data }, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Avatar Update Successfully 🎉')
        return res.data.data.user
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response.data) || 'Internal Server Error');
    }
})

export const getChannelProfile = createAsyncThunk('auth/getChannel', async (userName, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.get(`/users/c/${userName}`);
        return res.data.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response.data) || 'Internal Server Error');
    }
})

export const addDraftVideoThunk = createAsyncThunk('video/addDrfVideo', async (data, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.post('users/addDraftVideo', data);
        return res.data.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response.data) || "Unauthorized User");
    }
})
export const removeDraftVideoThunk = createAsyncThunk('video/removeDrfVideo', async (data, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.post('users/removeDraftVideo', data);
        return res.data.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response.data) || "Unauthorized User");
    }
})

export const addRecentSearchThunk = createAsyncThunk('user/addRecentSearch', async (data, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.post('users/addRecentSearch', { 'search': data });
        return res.data.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response.data) || "Unauthorized User");
    }
})
export const removeRecentSearchThunk = createAsyncThunk('user/removeRecentSearch', async (data, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.post('users/removeRecentSearch', { 'search': data });
        return res.data.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response.data) || "Unauthorized User");
    }
})
export const toggelHistorySettingThunk = createAsyncThunk('user/toggelHistorySetting', async (data, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.get('users/toggelHistorySetting');
        return res.data.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response.data) || "Unauthorized User");
    }
})

export const updateUserThemeThunk = createAsyncThunk('user/updateUserTheme', async (data, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.patch('users/updateUserTheme', { theme: data });
        return res.data.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response.data) || "Unauthorized User");
    }
})

const InitialState = {
    loggedUser: null,
    channelProfile: null,
    draftVideo: null,
    recentSearches: [],
    isCheckAuth: false,
    isAuthenticating: false,
    isUpdateData: false,
    isFindingChannel: false,
    isHistorySave: true,
    theme: localStorage.getItem("theme") || 'dark'
}

const authSlice = createSlice({
    name: 'authentication',
    initialState: InitialState,
    reducers: {
        addDraftVideo: (state, action) => {
            state.draftVideo = action.payload
        },
        setHistorySetting: (state, action) => {
            state.isHistorySave = action.payload
        },
        removeDeletedVideo: (state, action) => {
            const deletedVideoId = action.payload.deletedVideoId;
            state.channelProfile.publishVideo = state.channelProfile.publishVideo.filter(video => video._id !== deletedVideoId);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuthThunk.pending, (state) => {
                state.isCheckAuth = true
            })
            .addCase(checkAuthThunk.fulfilled, (state, action) => {
                state.theme = action.payload.theme
                state.loggedUser = action.payload
                state.isCheckAuth = false
            })
            .addCase(checkAuthThunk.rejected, (state) => {
                state.isCheckAuth = false
                toast.info("Login Required");
            })
            .addCase(registerUserThunk.pending, (state) => {
                state.isAuthenticating = true
            })
            .addCase(registerUserThunk.fulfilled, (state, action) => {
                state.loggedUser = action.payload;
                state.isAuthenticating = false;

            })
            .addCase(registerUserThunk.rejected, (state) => {
                state.isAuthenticating = false
            })
            .addCase(googleLoginThunk.pending, (state) => {
                state.isAuthenticating = true
            })
            .addCase(googleLoginThunk.fulfilled, (state, action) => {
                state.loggedUser = action.payload
                state.isAuthenticating = false
            })
            .addCase(googleLoginThunk.rejected, (state) => {
                state.isAuthenticating = false
            })
            .addCase(loginUserThunk.pending, (state) => {
                state.isAuthenticating = true
            })
            .addCase(loginUserThunk.fulfilled, (state, action) => {
                state.loggedUser = action.payload,
                    state.isAuthenticating = false
            })
            .addCase(loginUserThunk.rejected, (state) => {
                state.isAuthenticating = false
            })
            .addCase(logoutThunk.pending, (state) => {
                state.isAuthenticating = true
            })
            .addCase(logoutThunk.fulfilled, (state) => {
                state.loggedUser = null
                state.isAuthenticating = false
            })
            .addCase(logoutThunk.rejected, (state) => {
                state.isAuthenticating = false
            })
            .addCase(changePasswordThunk.pending, (state) => {
                state.isChangePassword = true
            })
            .addCase(changePasswordThunk.fulfilled, (state, action) => {
                state.isChangePassword = false
            })
            .addCase(changePasswordThunk.rejected, (state) => {
                state.isChangePassword = false
            })
            .addCase(updateAccountThunk.pending, (state) => {
                state.isUpdateData = true
            })
            .addCase(updateAccountThunk.fulfilled, (state, action) => {
                state.loggedUser = action.payload;
                state.isUpdateData = false
            })
            .addCase(updateAccountThunk.rejected, (state) => {
                state.isUpdateData = false
            })
            .addCase(changeAvatarThunk.pending, (state) => {
                state.isUpdateData = true
            })
            .addCase(changeAvatarThunk.fulfilled, (state, action) => {
                state.loggedUser = action.payload;
                state.isUpdateData = false
            })
            .addCase(changeAvatarThunk.rejected, (state) => {
                state.isUpdateData = false
            })
            .addCase(getChannelProfile.pending, (state) => {
                state.isFindingChannel = true
            })
            .addCase(getChannelProfile.fulfilled, (state, action) => {
                state.channelProfile = action.payload;
                state.isFindingChannel = false;
            })
            .addCase(getChannelProfile.rejected, (state) => {
                state.isFindingChannel = false
            })
            .addCase(addDraftVideoThunk.pending, (state) => {
                state.isUpdateData = true
            })
            .addCase(addDraftVideoThunk.fulfilled, (state, action) => {
                state.loggedUser = action.payload
                state.draftVideo = action.payload.draftVideo
                state.isUpdateData = false
            })
            .addCase(addDraftVideoThunk.rejected, (state) => {
                state.isUpdateData = false
            })
            .addCase(removeDraftVideoThunk.pending, (state) => {
                state.isUpdateData = true
            })
            .addCase(removeDraftVideoThunk.fulfilled, (state, action) => {
                state.loggedUser = action.payload
                state.draftVideo = null
                state.isUpdateData = false
            })
            .addCase(removeDraftVideoThunk.rejected, (state) => {
                state.isUpdateData = false
            })
            .addCase(addRecentSearchThunk.pending, (state) => {
                state.isUpdateData = true
            })
            .addCase(addRecentSearchThunk.fulfilled, (state, action) => {
                state.loggedUser = action.payload
                state.isUpdateData = false
            })
            .addCase(addRecentSearchThunk.rejected, (state) => {
                state.isUpdateData = false
            })
            .addCase(removeRecentSearchThunk.pending, (state) => {
                state.isUpdateData = true
            })
            .addCase(removeRecentSearchThunk.fulfilled, (state, action) => {
                state.loggedUser = action.payload
                state.isUpdateData = false
            })
            .addCase(removeRecentSearchThunk.rejected, (state) => {
                state.isUpdateData = false
            })
            .addCase(toggelHistorySettingThunk.pending, (state) => {
                state.isUpdateData = true
            })
            .addCase(toggelHistorySettingThunk.fulfilled, (state, action) => {
                state.isHistorySave = action.payload
                state.isUpdateData = false
            })
            .addCase(toggelHistorySettingThunk.rejected, (state) => {
                state.isUpdateData = false
            })
            .addCase(updateUserThemeThunk.pending, (state) => {
                state.isUpdateData = true
            })
            .addCase(updateUserThemeThunk.fulfilled, (state, action) => {
                state.theme = action.payload
                state.isUpdateData = false
            })
            .addCase(updateUserThemeThunk.rejected, (state) => {
                state.isUpdateData = false
            })


    }
})

export const { addDraftVideo, setHistorySetting, removeDeletedVideo } = authSlice.actions
export default authSlice.reducer