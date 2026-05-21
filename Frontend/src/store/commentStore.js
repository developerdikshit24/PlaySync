import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from '../axiosConnection/axios.js';
import { toast } from 'react-toastify';
import { extractErrorMessage } from "../constant.js";


export const getVideoCommentsThunk = createAsyncThunk('comment/getVideoComment', async (videoId, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.get(`/comments/getVideoComments/${videoId}`);
        return res.data.data;
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})
export const getTweetCommentsThunk = createAsyncThunk('comment/getVideoComment', async (tweetId, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.get(`/comments/getTweetComments/${tweetId}`);
        return res.data.data;
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})


export const addCommentThunk = createAsyncThunk('comment/addComment', async (data, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.post(`/comments/addComment/${data.videoId}`, data);
        return res.data.data;
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})
export const addTweetCommentThunk = createAsyncThunk('comment/addTweetComment', async (data, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.post(`/comments/addTweetComment/${data.tweetId}`, data);
        return res.data.data;
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})

export const updateCommentThunk = createAsyncThunk('comment/updateComment', async (data, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.patch(`/comments/updateComment/${data.commentId}`, data);
        return res.data.data;
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})

export const deleteCommentThunk = createAsyncThunk('comment/deleteComment', async (commentId, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.delete(`/comments/deleteComment/${commentId}`);
        return res.data.data;
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})

export const deleteAllTweetCommentThunk = createAsyncThunk('comment/deleteAllTweetComment', async (tweetId, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.delete(`/comments/deleteAllTweetComment/${tweetId}`);
        return res.data.data;
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})

export const deleteAllVideoCommentThunk = createAsyncThunk('comment/deleteAllVideoComment', async (videoId, { dispatch, rejectWithValue }) => {
    try {  
        const res = await axiosInstance.delete(`/comments/deleteAllVideoComment/${videoId}`);
        return res.data.data;
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})

const InitialState = {
    videoComments: [],
    isFetchingComment: false,
    isDeleting: false,
    isUpdating: false,
}

const commentSlice = createSlice({
    name: 'comment',
    initialState: InitialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getVideoCommentsThunk.pending, (state) => {
                state.isFetchingComment = true;
            })
            .addCase(getVideoCommentsThunk.fulfilled, (state, action) => {
                state.videoComments = action.payload;
                state.isFetchingComment = false;
            })
            .addCase(getVideoCommentsThunk.rejected, (state) => {
                state.isFetchingComment = false;
            })
            .addCase(addCommentThunk.pending, (state) => {
                state.isUpdating = true
            })
            .addCase(addCommentThunk.fulfilled, (state) => {
                state.isUpdating = false
            })
            .addCase(addCommentThunk.rejected, (state) => {
                state.isUpdating = false
            })
            .addCase(updateCommentThunk.pending, (state) => {
                state.isUpdating = true
            })
            .addCase(updateCommentThunk.fulfilled, (state, action) => {
                // delete the old comment and add the new one
                state.isUpdating = false
            })
            .addCase(updateCommentThunk.rejected, (state) => {
                state.isUpdating = false
            })
            .addCase(deleteCommentThunk.pending, (state) => {
                state.isDeleting = true
            })
            .addCase(deleteCommentThunk.fulfilled, (state, action) => {
                // delete the comment from the array
                state.isDeleting = false
            })
            .addCase(deleteCommentThunk.rejected, (state) => {
                state.isDeleting = false
            })
            .addCase(addTweetCommentThunk.pending, (state) => {
                state.isUpdating = true
            })
            .addCase(addTweetCommentThunk.fulfilled, (state, action) => {
                state.isUpdating = false
            })
            .addCase(addTweetCommentThunk.rejected, (state) => {
                state.isUpdating = false
            })


    }
})

export const { } = commentSlice.actions;
export default commentSlice.reducer;