import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from '../axiosConnection/axios.js';
import { toast } from 'react-toastify';
import { extractErrorMessage } from "../constant.js";

export const getAllPlaylistThunk = createAsyncThunk('playlist/getAllPlaylist', async (userId, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.get(`/playlists/getAllPlaylist/${userId}`);
        return res.data.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})
export const createPlaylistThunk = createAsyncThunk('playlist/createPlaylist', async (data, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.post('/playlists/createPlaylist', data);
        dispatch(getAllPlaylistThunk(data._id));
        toast.success("Playlist Created !")
        return res.data.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})

export const updatePlaylistThunk = createAsyncThunk('playlist/updatePlaylist', async (data, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.patch(`/playlists/updatePlaylist/${data.playlistId}`, data);
        return res.data.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})

export const addVideoInPlaylistThunk = createAsyncThunk('playlist/addVideo', async (data, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.post(`/playlists/addVideoInPlaylist/${data.playlistId}`, data);
        return res.data.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})

export const removeVideoFromPlaylistThunk = createAsyncThunk('playlist/removeVideo', async (data, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.patch('/playlists/removeVideoFromPlaylist', data);
        return res.data.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})

export const deletePlaylistThunk = createAsyncThunk('playlist/deletePlaylist', async (playlistId, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.delete(`/playlists/deletePlaylist/${playlistId}`);
        return res.data.data;
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})

const InitialState = {
    isFetchingPlaylist: false,
    isUpdatingPlaylist: false,
    isAddingVideo: false,
    allPlaylist: []
}

const playlistSlice = createSlice({
    name: 'playlist',
    initialState: InitialState,
    reducers: {},
    extraReducers: (builders) => {
        builders
            .addCase(getAllPlaylistThunk.pending, (state) => {
                state.isFetchingPlaylist = true
            })
            .addCase(getAllPlaylistThunk.fulfilled, (state, action) => {
                state.allPlaylist = action.payload
                state.isFetchingPlaylist = false
            })
            .addCase(getAllPlaylistThunk.rejected, (state) => {
                state.allPlaylist = []
                state.isFetchingPlaylist = false
            })
            .addCase(addVideoInPlaylistThunk.pending, (state) => {
                state.isAddingVideo = true

            })
            .addCase(addVideoInPlaylistThunk.fulfilled, (state) => {
                state.isAddingVideo = false

            })
            .addCase(addVideoInPlaylistThunk.rejected, (state) => {
                state.isAddingVideo = false

            })
            .addCase(updatePlaylistThunk.pending, (state) => {
                state.isUpdatingPlaylist = true

            })
            .addCase(updatePlaylistThunk.fulfilled, (state) => {
                state.isUpdatingPlaylist = false

            })
            .addCase(updatePlaylistThunk.rejected, (state) => {
                state.isUpdatingPlaylist = false

            })
            .addCase(deletePlaylistThunk.pending, (state) => {
                state.isUpdatingPlaylist = true

            })
            .addCase(deletePlaylistThunk.fulfilled, (state) => {
                state.isUpdatingPlaylist = false

            })
            .addCase(deletePlaylistThunk.rejected, (state) => {
                state.isUpdatingPlaylist = false

            })
            .addCase(removeVideoFromPlaylistThunk.pending, (state) => {
                state.isUpdatingPlaylist = true

            })
            .addCase(removeVideoFromPlaylistThunk.fulfilled, (state) => {
                state.isUpdatingPlaylist = false

            })
            .addCase(removeVideoFromPlaylistThunk.rejected, (state) => {
                state.isUpdatingPlaylist = false

            })

    }
})
let s = 'sarvesh';
s.substring

export const { } = playlistSlice.actions;
export default playlistSlice.reducer;