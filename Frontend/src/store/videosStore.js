import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from '../axiosConnection/axios.js';
import { toast } from 'react-toastify';
import { extractErrorMessage } from "../constant.js";
import { deleteAllLikeVideoThunk, getLikeVideoThunk } from "./likeStore.js";
import { removeDeletedVideo } from "./authStore.js";
import { deleteAllVideoCommentThunk } from "./commentStore.js";


export const getAllVideoThunk = createAsyncThunk(
    'videos/getAllVideo',
    async (page, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/videos/getAllVideo?page=${page}`);
            return res.data.data;

        } catch (error) {
            toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
            return rejectWithValue(extractErrorMessage(error.response?.data) || "Unauthorized User");
        }
    }
);


export const getAllSearchVideo = createAsyncThunk('video/getSearchVideo', async ({ page = 1, query, userId } = {}, { dispatch, rejectWithValue }) => {
    try {
        const params = new URLSearchParams();
        params.append('page', page);

        if (query) params.append('query', query);
        if (userId) params.append('userId', userId);
        const res = await axiosInstance.get(`/videos/getAllSearchVideo?${params.toString()}`);
        return res.data.data;

    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response.data) || "Unauthorized User");
    }

})
export const publishVideoThunk = createAsyncThunk('video/publishVideo', async (data, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.post('videos/publishVideo', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Video Publish Successfully');
        return res.data.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response.data) || "Unauthorized User");
    }
})
export const uploadVideoOnCloudThunk = createAsyncThunk('video/uploadVideo', async (data, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.post('videos/uploadVideo', { 'videofile': data }, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Video uploaded!')
        return res.data.data.secure_url
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response.data) || "Unauthorized User");
    }
})

export const deleteVideoFromCloudThunk = createAsyncThunk('video/deleteVideo', async (videoUrl, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.post(`/videos/deleteFromCloud`, { 'videoUrl': videoUrl });
        return res.data.data;
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response.data) || "Unauthorized User");
    }
})

export const getVideoByIdThunk = createAsyncThunk('video/getVideoById', async (videoId, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.get(`videos/url/${videoId}`);
        dispatch(getLikeVideoThunk())
        return res.data.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response.data) || "Unauthorized User")
    }
})

export const updateVideoThunk = createAsyncThunk('video/updateVideo', async (data, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.patch(`videos/updateVideo/url/${data?.id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success("Video Updated")
        return res.data.data
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response.data) || "Unauthorized User")
    }
})
export const deleteVideoThunk = createAsyncThunk('video/updatedVideo', async (videoId, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.delete(`videos/deleteVideo/url/${videoId}`);
        toast.success("Video Deleted")
        dispatch(deleteAllLikeVideoThunk(videoId))
        dispatch(deleteAllVideoCommentThunk(videoId))
        dispatch(removeDeletedVideo())
        return res.data.data

    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response.data) || "Unauthorized User");
    }
})

// Video Views Mange

export const addViewsThunk = createAsyncThunk("video/addView", async (videoId, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.post("views/addView", videoId);
        dispatch(getVideoByIdThunk(videoId.videoId)).then(() => {
            return res.data.data
        })
    } catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response.data) || "Unauthorized User");
    }
})

export const getAllChannelVideoViewsThunk = createAsyncThunk('channel/videos/getViewsCount', async (channelId, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.get(`views/getAllChannelView/${channelId}`);
        return res.data.data
    }
    catch (error) {
        toast.error(extractErrorMessage(error.response.data) || "Internal Server Error");
        return rejectWithValue(extractErrorMessage(error.response.data) || "Unauthorized User");
    }
})

const InitialState = {
    isUploading: false,
    isPublishing: false,
    isUpdating: false,
    isdeleting: false,
    isFetchVideo: false,
    allVideos: [],
    allSearchVideos: [],
    selectedVideo: null,
    uploadedVideo: null,
    channelVideosView: 0
}
const videoSlice = createSlice({
    name: "videos",
    initialState: InitialState,

    reducers: {
        addVideos: (state, action) => {
            state.allVideos = [...state.allVideos, action.payload]
        },
        removeSearchVideo: (state) => {
            state.allSearchVideos = []
        },
        addDraftVideoInUpload: (state, action) => {
            state.uploadedVideo = action.payload
        },
        removeDraftVideoInUpload: (state) => {
            state.uploadedVideo = null;
        },
        removeSelectedVideo: (state) => {
            state.selectedVideo = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllVideoThunk.pending, (state) => {
                state.isFetchVideo = true;
            })
            .addCase(getAllVideoThunk.fulfilled, (state, action) => {
                state.allVideos = action.payload.videos;
                state.isFetchVideo = false;
            })
            .addCase(getAllVideoThunk.rejected, (state) => {
                state.isFetchVideo = false;
            })
            .addCase(publishVideoThunk.pending, (state) => {
                state.isPublishing = true;
            })
            .addCase(publishVideoThunk.fulfilled, (state, action) => {
                state.uploadedVideo = action.payload;
                state.isPublishing = false;
            })
            .addCase(publishVideoThunk.rejected, (state) => {
                state.isPublishing = false;
            })
            .addCase(uploadVideoOnCloudThunk.pending, (state) => {
                state.isUploading = true;
            })
            .addCase(uploadVideoOnCloudThunk.fulfilled, (state, action) => {
                state.uploadedVideo = action.payload;
                state.isUploading = false;
            })
            .addCase(uploadVideoOnCloudThunk.rejected, (state) => {
                state.isUploading = false;
            })
            .addCase(deleteVideoFromCloudThunk.pending, (state) => {
                state.isdeleting = true;
            })
            .addCase(deleteVideoFromCloudThunk.fulfilled, (state) => {
                state.uploadedVideo = null;
                state.isdeleting = false;
            })
            .addCase(deleteVideoFromCloudThunk.rejected, (state) => {
                state.isdeleting = false;
            })
            .addCase(getVideoByIdThunk.pending, (state) => {
                state.isFetchVideo = true;
            })
            .addCase(getVideoByIdThunk.fulfilled, (state, action) => {
                state.selectedVideo = action.payload;
                state.isFetchVideo = false;
            })
            .addCase(getVideoByIdThunk.rejected, (state) => {
                state.isFetchVideo = false;
            })
            .addCase(updateVideoThunk.pending, (state) => {
                state.isUpdating = true;
            })
            .addCase(updateVideoThunk.fulfilled, (state, action) => {
                state.selectedVideo = action.payload;
                state.isUpdating = false;
            })
            .addCase(updateVideoThunk.rejected, (state) => {
                state.isUpdating = false;
            })
            .addCase(deleteVideoThunk.pending, (state) => {
                state.isdeleting = true;
            })
            .addCase(deleteVideoThunk.fulfilled, (state, action) => {

                state.isdeleting = false;
            })

            .addCase(deleteVideoThunk.rejected, (state) => {
                state.isdeleting = false;
            })
            .addCase(getAllSearchVideo.pending, (state) => {
                state.isFetchVideo = true;
            })
            .addCase(getAllSearchVideo.fulfilled, (state, action) => {
                const existingIds = new Set(state.allSearchVideos.map(item => item._id));
                const filtered = action.payload.videos.filter(item => !existingIds.has(item._id));

                state.allSearchVideos = [...state.allSearchVideos, ...filtered];
                state.isFetchVideo = false;
            })
            .addCase(getAllSearchVideo.rejected, (state) => {
                state.isFetchVideo = false;
            })
            .addCase(getAllChannelVideoViewsThunk.fulfilled, (state, action) => {
                state.channelVideosView = action.payload.totalViews
            })
    }
})

export const { addVideos, removeSearchVideo, addDraftVideoInUpload, removeDraftVideoInUpload, removeSelectedVideo } = videoSlice.actions
export default videoSlice.reducer