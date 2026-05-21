import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from '../axiosConnection/axios.js';
import { toast } from 'react-toastify';
import { extractErrorMessage } from "../constant.js";
import { deleteAllLikeTweetThunk } from "./likeStore.js";
import { deleteAllTweetCommentThunk } from "./commentStore.js";


export const createTweetThunk = createAsyncThunk('tweet/createTweet', async (data, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.post('/tweets/createTweet', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Tweet Publish!')
        return res.data.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})

export const getUserTweetsThunk = createAsyncThunk('tweet/getTweet', async (data, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.get('/tweets/getUserTweets');
        return res.data.data;
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})
export const getUserTweetsByIdThunk = createAsyncThunk('tweet/getUserTweet', async (userId, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.get(`/tweets/getAllUserTweets/${userId}`);
        return res.data.data;
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})

export const updateTweetThunk = createAsyncThunk('tweet/updateTweet', async (data, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.patch(`/tweets/updateTweet/${data.tweetId}`, data);
        dispatch(getAllTweetThunk())
        toast.success('Tweet Updated')
        return res.data.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})
export const deleteTweetThunk = createAsyncThunk('tweet/deleteTweet', async (tweetId, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.delete(`/tweets/deleteTweet/${tweetId}`);
        dispatch(getAllTweetThunk())
        dispatch(deleteAllLikeTweetThunk(tweetId))
        dispatch(deleteAllTweetCommentThunk(tweetId))
        toast.success('Tweet Deleted')
        return res.data.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }

})

export const getAllTweetThunk = createAsyncThunk('tweet/getAllTweet', async (_, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.get('/tweets/getAllTweet')
        return res.data.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})


const InitialStage = {
    allTweet: [],
    isFetchingTweet: false,
    isUpdating: false
}

const tweetSlice = createSlice({
    name: 'tweet',
    initialState: InitialStage,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllTweetThunk.pending, (state) => {
                state.isFetchingTweet = true
            })
            .addCase(getAllTweetThunk.fulfilled, (state, action) => {
                state.allTweet = action.payload
                state.isFetchingTweet = false
            })
            .addCase(getAllTweetThunk.rejected, (state) => {
                state.isFetchingTweet = false
            })
            .addCase(getUserTweetsByIdThunk.pending, (state) => {
                state.isFetchingTweet = true
            })
            .addCase(getUserTweetsByIdThunk.fulfilled, (state, action) => {
                state.allTweet = action.payload
                state.isFetchingTweet = false
            })
            .addCase(getUserTweetsByIdThunk.rejected, (state) => {
                state.isFetchingTweet = false
            })
            .addCase(getUserTweetsThunk.pending, (state) => {
                state.isFetchingTweet = true
            })
            .addCase(getUserTweetsThunk.fulfilled, (state, action) => {
                state.allTweet = action.payload
                state.isFetchingTweet = false
            })
            .addCase(getUserTweetsThunk.rejected, (state) => {
                state.isFetchingTweet = false
            })

            .addCase(createTweetThunk.pending, (state) => {
                state.isUpdating = true
            })
            .addCase(createTweetThunk.fulfilled, (state) => {
                state.isUpdating = false
            })
            .addCase(createTweetThunk.rejected, (state) => {
                state.isUpdating = false
            })
            .addCase(updateTweetThunk.pending, (state) => {
                state.isUpdating = true
            })
            .addCase(updateTweetThunk.fulfilled, (state) => {
                state.isUpdating = false
            })
            .addCase(updateTweetThunk.rejected, (state) => {
                state.isUpdating = false
            })
            
    }
})

const { } = tweetSlice.actions
export default tweetSlice.reducer;