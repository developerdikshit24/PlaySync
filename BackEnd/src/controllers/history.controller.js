import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { History } from "../models/history.model.js"

const getAllHistory = asyncHandler(async (req, res) => {
    try {
        const history = await History.findOne({ owner: req.user._id })
            .populate({
                path: "videos",
                populate: {
                    path: "owner",
                    model: "User",
                    select: "_id fullName userName avatar"
                }
            })
            .populate({
                path: "tweets",
                populate: {
                    path: "owner",
                    model: "User",
                    select: "_id fullName userName avatar"
                }
            })

        if (!history) {
            throw new ApiError(404, "No History Found");
        }

        const sortedVideos = [...history.videos].sort((a, b) =>
            new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        const sortedTweets = [...history.tweets].sort((a, b) =>
            new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        return res.status(200).json(
            new ApiResponse(200, {
                videos: sortedVideos,
                tweets: sortedTweets,
            }, "History fetched successfully")
        );

    } catch (error) {
        throw error;
    }
})

const addHistory = asyncHandler(async (req, res) => {

    const { videoId, tweetId } = req.body;

    if (!videoId && !tweetId) {
        throw new ApiError(400, "Video or Tweet ID is required");
    }

    let history = await History.findOne({ owner: req.user._id });

    if (!history) {
        history = await History.create({
            owner: req.user._id,
            videos: videoId ? [videoId] : [],
            tweets: tweetId ? [tweetId] : [],
        });

        return res.status(201).json(
            new ApiResponse(201, history, "History created")
        );
    }

    let updated = false;

    if (videoId && !history.videos.includes(videoId)) {
        history.videos.push(videoId);
        updated = true;
    }

    if (tweetId && !history.tweets.includes(tweetId)) {
        history.tweets.push(tweetId);
        updated = true;
    }

    if (updated) {
        await history.save();
    }

    return res.status(200).json(
        new ApiResponse(200, history, updated ? "History updated" : "No changes")
    );

})
const deleteHistoryItem = asyncHandler(async (req, res) => {
    
    const { videoId, tweetId } = req.body;
    if (!videoId && !tweetId) {
        throw new ApiError(400, "Video or Tweet ID is required");
    }

    const history = await History.findOne({ owner: req.user._id });

    if (!history) {
        throw new ApiError(404, "History not found");
    }

    let updated = false;

    if (videoId) {
        const before = history.videos.length;
        history.videos = history.videos.filter(
            (v) => v.toString() !== videoId
        );
        if (history.videos.length !== before) updated = true;
    }

    if (tweetId) {
        const before = history.tweets.length;
        history.tweets = history.tweets.filter(
            (t) => t.toString() !== tweetId
        );
        if (history.tweets.length !== before) updated = true;
    }

    if (updated) {
        await history.save();
        return res.status(200).json(
            new ApiResponse(200, history, "History item deleted successfully")
        );
    } else {
        return res.status(200).json(
            new ApiResponse(200, history, "Item not found in history")
        );
    }
});
const deleteAllHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const result = await History.findOneAndDelete({ owner: userId });

    if (!result) {
        throw new ApiError(404, "No history found to delete");
    }

    return res.status(200).json(
        new ApiResponse(200, null, "All history deleted successfully")
    );
});


export {
    getAllHistory,
    addHistory,
    deleteHistoryItem,
    deleteAllHistory
}