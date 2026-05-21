import mongoose, { isValidObjectId } from "mongoose"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Views } from '../models/views.module.js'
import { Video } from "../models/video.models.js"



const addViewCount = asyncHandler(async (req, res) => {
    const { videoId } = req.body;

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    let viewDoc = await Views.findOne({ videos: videoId });
    let video = await Video.findById(videoId);

    if (!video) throw new ApiError(404, "Video not found")

    if (!viewDoc) {
        viewDoc = await Views.create({
            videos: videoId,
            viewers: [req.user._id]
        });

        return res.status(201).json(
            new ApiResponse(201, viewDoc, "View record created and counted")
        );
    }

    if (!viewDoc.viewers.includes(req.user._id)) {
        viewDoc.viewers.push(req.user._id);
        await viewDoc.save();

        return res.status(200).json(
            new ApiResponse(200, viewDoc, "View counted")
        );
    }

    video.views = viewDoc.viewers.length;
    await video.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, viewDoc, "User already viewed this video")
    );
});


const getAllChannelVideoViews = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!channelId) {
        throw new ApiError(400, "Channel ID is required");
    }

    const result = await Views.aggregate([
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videoData"
            }
        },
        {
            $unwind: "$videoData"
        },
        {
            $match: {
                "videoData.owner": new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $project: {
                viewerCount: { $size: "$viewers" }
            }
        },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$viewerCount" }
            }
        }
    ]);

    const totalViews = result.length > 0 ? result[0].totalViews : 0;

    return res.status(200).json(
        new ApiResponse(200, { channelId, totalViews }, "Total view count fetched")
    );
});


export {
    getAllChannelVideoViews,
    addViewCount,
}