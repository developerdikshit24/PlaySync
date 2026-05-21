import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from '../axiosConnection/axios.js';
import { toast } from 'react-toastify';
import { extractErrorMessage } from "../constant.js";


export const SubscribeToggleThunk = createAsyncThunk('subscribe/toggleSubscribe', async (userId, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.post(`/subscriptions//subscribeToggle/${userId}`);
        return res.data.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})

export const getSubsribedChannelsThunk = createAsyncThunk('subscribe/getSubscribedChannel', async (_, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.get('/subscriptions/getsubscribedchannels');
        return res.data.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})

const InitialState = {
    subscribedChannels: [],
    isSubscribed: false,
    isFetchingSubChannels: false,
    isToggle: false
}
const subscribeSlice = createSlice({
    name: 'subscribe',
    initialState: InitialState,
    reducers: {
        setIsSubscribe: (state, action)=>{
            state.isSubscribed = action.payload
        },
        resetSubscribeState(state) {
            state.isSubscribed = false;
        }
    }
    , extraReducers: (builder) => {
        builder
            .addCase(SubscribeToggleThunk.pending, (state) => {
                state.isFetchingSubChannels = true;
            })
            .addCase(SubscribeToggleThunk.fulfilled, (state, action) => {
                state.isSubscribed = action.payload.isSubscribed;
                state.isFetchingSubChannels = false;
            })
            .addCase(SubscribeToggleThunk.rejected, (state) => {
                state.isFetchingSubChannels = false;
            })
            .addCase(getSubsribedChannelsThunk.pending, (state) => {
                state.isFetchingSubChannels = true;
            })
            .addCase(getSubsribedChannelsThunk.fulfilled, (state, action) => {
                state.subscribedChannels = action.payload
                state.isFetchingSubChannels = false;
            })
            .addCase(getSubsribedChannelsThunk.rejected, (state) => {
                state.isFetchingSubChannels = false;
            })
    }
    
})

export const { setIsSubscribe, resetSubscribeState } = subscribeSlice.actions;
export default subscribeSlice.reducer;

