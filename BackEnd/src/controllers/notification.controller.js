import Notification from "../models/notification.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

const createNotification = asyncHandler(async (req, res) => {
    const { uploader, media, user } = req.body;

    if (!uploader || !media || !user) {
        throw new ApiError(400, "Uploader, media, and user are required");
    }

    const notification = await Notification.create({
        uploader: new mongoose.Types.ObjectId(uploader),
        media,
        user: new mongoose.Types.ObjectId(user)
    });

    return res.status(201).json(new ApiResponse(201, notification, "Notification created successfully"));
});

const getNotifications = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }
    const pipeline = [
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $lookup: {
                from: "users",
                localField: "uploader",
                foreignField: "_id",
                as: "uploaderInfo"
            }
        },
        {
            $unwind: "$uploaderInfo"
        },
        {
            $project: {
                _id: 1,
                media: 1,
                createdAt:1,
                "uploaderInfo.fullName": 1,
                "uploaderInfo.avatar": 1
            }
        }
    ];
    const notifications = await Notification.aggregate(pipeline);

    return res.status(200).json(new ApiResponse(200, notifications, "Notifications fetched successfully"));
});


const getAllUnseenNotifications = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }
    const notificationsCount = await Notification.countDocuments({ user: userId, read: false });

    return res.status(200).json(new ApiResponse(200, notificationsCount, "Unseen notifications fetched successfully"));
});

const markAllSeen = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }
    await Notification.updateMany({ user: userId, read: false }, { read: true });

    return res.status(200).json(new ApiResponse(200, null, "All notifications marked as read"));
});

export {
    createNotification,
    getNotifications,
    getAllUnseenNotifications,
    markAllSeen
};