import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from '../axiosConnection/axios.js';
import { toast } from 'react-toastify';
import { extractErrorMessage } from "../constant.js";

export const toggleVideoLikeThunk = createAsyncThunk('like/toggleVideoLike', async (videoId, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.post(`/likes/likeVideo/${videoId}`);
        return res.data.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})

export const toggleCommentLikeThunk = createAsyncThunk('like/toggleCommentLike', async (commentId, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.post(`/likes/likeComment/${commentId}`);
        return res.data.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})

export const toggleTweetLikeThunk = createAsyncThunk('like/toggleTweetLike', async (tweetId, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.post(`/likes/likeTweet/${tweetId}`);
        return res.data.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})

export const getLikeVideoThunk = createAsyncThunk('like/getLikeVideos', async (_, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.get('likes/getLikedVideos');
        return res.data.data;
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})

export const getAllLikeVideoContentThunk = createAsyncThunk('like/getAllVideoContent', async (_, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.get('likes/getAllLikeVideoContent');
        return res.data.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})

export const deleteAllLikeVideoThunk = createAsyncThunk('like/deleteAllLikeVideo', async (videoId, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.delete(`likes/deleteAllVideoLike/${videoId}`);
        return res.data.data;
    } catch (error) {
        console.log("error", error);
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})

export const deleteAllLikeTweetThunk = createAsyncThunk('like/deleteAllLikeTweet', async (tweetId, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.delete(`likes/deleteAllTweetLike/${tweetId}`);
        return res.data.data;
    } catch (error) {   
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})  

const InitialState = {
    isFetchingLikeVideo: false,
    isVideoLiked: false,
    tweetLike: false,
    commentLike: true,
    likedVideos: [],
    likedVideoContent: []
}

const likeSlice = createSlice({
    name: 'like',
    initialState: InitialState,
    reducers: {
        setVideoLike: (state, action) => {
            state.isVideoLiked = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLikeVideoThunk.pending, (state) => {
                state.isFetchingLikeVideo = true
            })
            .addCase(getLikeVideoThunk.fulfilled, (state, action) => {
                state.likedVideos = action.payload.Video
                state.isFetchingLikeVideo = false
            })
            .addCase(getLikeVideoThunk.rejected, (state) => {
                state.isFetchingLikeVideo = false
            })
            .addCase(getAllLikeVideoContentThunk.pending, (state) => {
                state.isFetchingLikeVideo = true;
            })
            .addCase(getAllLikeVideoContentThunk.fulfilled, (state, action) => {
                state.likedVideoContent = action.payload
                state.isFetchingLikeVideo = false;
            })
            .addCase(getAllLikeVideoContentThunk.rejected, (state) => {
                state.isFetchingLikeVideo = false;
            })
            .addCase(toggleTweetLikeThunk.fulfilled, (state, action) => {
                state.tweetLike = action.payload
            })
    }
})

export const { setVideoLike, setTweetLike } = likeSlice.actions;
export default likeSlice.reducer;