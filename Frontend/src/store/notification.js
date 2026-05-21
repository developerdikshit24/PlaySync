import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from '../axiosConnection/axios.js';
import { toast } from 'react-toastify';
import { extractErrorMessage } from "../constant.js";


export const getNotificationsThunk = createAsyncThunk('notification/getNotifications', async (_, { dispatch, rejectWithValue }) => {
    try {
        const response = await axiosInstance.get('/notifications/getNotifications');
        return response.data.data;
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
});


export const markAllSeenThunk = createAsyncThunk('notification/markAllSeen', async (_, { dispatch, rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('/notifications/markAllSeen');
        return response.data;
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
});

export const getUnseenCountThunk = createAsyncThunk('notification/getAllUnseenNotifications', async (_, { dispatch, rejectWithValue }) => {
    try {
        const response = await axiosInstance.get('/notifications/getAllUnseenNotifications');
        return response.data.data;
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
});

const InitialState = {
    notifications: [],
    isFetchingNotifications: false,
    error: null,
    notificationsCount: 0
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState: InitialState,
    reducers: {
        setNotifications: (state, action) => {
            state.notifications = [state.notifications, ...action.payload];
        },
        incrementUnseen: (state) => { state.notificationsCount += 1; },
        resetUnseen: (state) => { state.notificationsCount = 0; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNotificationsThunk.pending, (state) => {
                state.isFetchingNotifications = true;
            })
            .addCase(getNotificationsThunk.fulfilled, (state, action) => {
                state.isFetchingNotifications = false;
                state.notifications = action.payload;
            })
            .addCase(getNotificationsThunk.rejected, (state, action) => {
                state.isFetchingNotifications = false;
                state.error = action.payload;
            })
            .addCase(markAllSeenThunk.pending, (state) => {
                state.isFetchingNotifications = true;
            })
            .addCase(markAllSeenThunk.fulfilled, (state) => {
                state.isFetchingNotifications = false;
            })
            .addCase(markAllSeenThunk.rejected, (state, action) => {
                state.isFetchingNotifications = false;
                state.error = action.payload;
            })
            .addCase(getUnseenCountThunk.pending, (state) => {
                state.isFetchingNotifications = true;
            })
            .addCase(getUnseenCountThunk.fulfilled, (state, action) => {
                state.isFetchingNotifications = false;
                state.notificationsCount = action.payload;
            })
            .addCase(getUnseenCountThunk.rejected, (state, action) => {
                state.isFetchingNotifications = false;
                state.error = action.payload;
            });
    }
});

export const { setNotifications, incrementUnseen, resetUnseen } = notificationSlice.actions;

export default notificationSlice.reducer;
