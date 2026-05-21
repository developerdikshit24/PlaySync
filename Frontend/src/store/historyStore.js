import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from '../axiosConnection/axios.js';
import { toast } from 'react-toastify';
import { extractErrorMessage } from "../constant.js";

export const getAllHistoryThunk = createAsyncThunk('history/getAllHistory', async (_, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.get('/history/getAllHistory')
        return res.data.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})

export const addHistoryThunk = createAsyncThunk('history/addHistory', async (data, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.post('/history/addHistory', data);
        return res.data.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})

export const deleteHistoryItemThunk = createAsyncThunk('history/removeItem', async (data, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.post('/history/deleteHistoryItem', data)
        dispatch(getAllHistoryThunk())
        return res.data.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})
export const deleteAllHistoryThunk = createAsyncThunk('history/deleteAllHistoryThunk', async (_, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.delete('/history/deleteAllHistory')
        dispatch(getAllHistoryThunk())
        return res.data.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
    }
})


const InitialState = {
    isFetchingHistory: false,
    isUpdating: false,
    allHistory: {},
}


const historySlice = createSlice({
    name: 'history',
    initialState: InitialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllHistoryThunk.pending, (state) => {
                state.isFetchingHistory = true
            })
            .addCase(getAllHistoryThunk.fulfilled, (state, action) => {
                state.allHistory = action.payload
                state.isFetchingHistory = false
            })
            .addCase(getAllHistoryThunk.rejected, (state) => {
                state.allHistory = {}
                state.isFetchingHistory = false
            })
            .addCase(addHistoryThunk.pending, (state) => {
                state.isUpdating = true
            })
            .addCase(addHistoryThunk.fulfilled, (state, action) => {
                state.isUpdating = false
            })
            .addCase(addHistoryThunk.rejected, (state) => {
                state.isUpdating = false
            })
            .addCase(deleteHistoryItemThunk.pending, (state) => {
                state.isUpdating = true
            })
            .addCase(deleteHistoryItemThunk.fulfilled, (state) => {
                state.isUpdating = false
            })
            .addCase(deleteHistoryItemThunk.rejected, (state) => {
                state.isUpdating = false
            })
            .addCase(deleteAllHistoryThunk.pending, (state) => {
                state.isUpdating = true
            })
            .addCase(deleteAllHistoryThunk.fulfilled, (state) => {
                state.allHistory = {}
                state.isUpdating = false
            })
            .addCase(deleteAllHistoryThunk.rejected, (state) => {
                state.isUpdating = false
            })

    }
})

export const { } = historySlice.actions;
export default historySlice.reducer;