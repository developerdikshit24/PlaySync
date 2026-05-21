import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from '../utils/ApiError.js'
import { Video } from '../models/video.models.js'
import {
    uploadOnCloud,
    deleteFromCloud
} from "../utils/cloudnary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose"
import { Subscription } from "../models/subscription.module.js"
import { getIO } from "../utils/socket.js"
import Notification from "../models/notification.model.js"
import { error } from "console"
const getAllVideo = asyncHandler(async (req, res) => {
    const { page = 1, limit = 16 } = req.query;
    let pipeline = [
        {
            $match: { isPublished: true }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "Owner",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            fullName: 1,
                            avatar: 1,
                            userName: 1,
                        }
                    }
                ]

            }
        },
        {
            $addFields: {
                Owner: {
                    $first: "$Owner",
                },
            },
        },
    ];
    try {

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            customLabels: {
                totalDocs: "totalVideos",
                docs: "videos",
            },
        };

        const result = await Video.aggregatePaginate(Video.aggregate(pipeline), options);

        if (result?.videos?.length === 0) {
            return res.status(404).json(new ApiResponse(404, {}, "No Videos Found"));
        }
        return res.status(200).json(new ApiResponse(200, result, "Videos fetched successfully"));

    } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500, {}, "Internal server error in video aggregation"));
    }
});


const getAllSearchVideo = asyncHandler(async (req, res) => {
    const { page = 1, limit = 1, query = "", sortBy = "createdAt", sortType = 1, userId = "" } = req.query;
    let pipeline = [
        {
            $match: {
                $or: [
                    { title: { $regex: query, $options: "i" } },
                    { description: { $regex: query, $options: "i" } }
                ]
            }
        },

        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "Owner",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            fullName: 1,
                            avatar: 1,
                            userName: 1,
                        }
                    }
                ]
            }
        },
        {

            $addFields: {
                Owner: {
                    $first: "$Owner",
                },
            },
        },
        {
            $sort: { [sortBy]: sortType }
        }
    ];

    try {

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            customLabels: {
                totalDocs: "totalVideos",
                docs: "videos",
            },
        };

        const result = await Video.aggregatePaginate(Video.aggregate(pipeline), options);

        if (result?.videos?.length === 0) {
            throw "No Videos Found"
        }


        return res.status(200).json(new ApiResponse(200, result, "Videos fetched successfully"));

    } catch (error) {
        throw new ApiError(500, error)
    }
});

const uploadVideoOnCloud = asyncHandler(async (req, res) => {
    const videoLocalPath = req.file.path
    if (!videoLocalPath) {
        throw new ApiError(400, "Video is not found")
    }
    const video = await uploadOnCloud(videoLocalPath, "video")
    if (!video) throw new ApiError(400, video)
    return res.status(200)
        .json(new ApiResponse(200, video, "Video uploaded successfully"))
})
const deleteVideoFromCloud = asyncHandler(async (req, res) => {
    const { videoUrl } = req.body;
    if (!videoUrl) {
        throw new ApiError(400, "Video URL is required");
    }
    const video = await deleteFromCloud(videoUrl, "video")
    if (!video) throw new ApiError(400, "Failed to delete video from cloud")
    return res.status(200)
        .json(new ApiResponse(200, video, "Video deleted successfully"))

})
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, video, isPublished } = req.body;
    const userId = req.user?._id

    if ([title, description, video].some((field) => field?.trim() == "")) {
        throw new ApiError(400, "Title and Description is required")
    }

    const thumbnailLocalPath = req.file?.path
    let thumbnail;
    if (thumbnailLocalPath) {
        thumbnail = await uploadOnCloud(thumbnailLocalPath, "image")
        if (!thumbnail) {
            throw new ApiError(500, "Something went wrong while uploading thumbnail")
        }
    }

    const videos = await Video.create({
        title,
        description,
        videofile: video,
        thumbnail: thumbnail?.secure_url || '',
        views: 0,
        owner: new mongoose.Types.ObjectId(userId),
        isPublished: isPublished
    })

    const uplodedVideo = Video.findById(videos._id)

    if (!uplodedVideo) {
        throw new ApiError(401, "Something went wrong While uploading the video")
    }

    if (isPublished) {
        const subscriptions = await Subscription.find({ channel: userId })
        const io = getIO();


        subscriptions.forEach(async (sub) => {
            const subscriberId = sub.subscriber._id.toString();

            await Notification.create({
                uploader: req.user._id,
                user: subscriberId,
                media: {
                    videoId: videos._id,
                    title: videos.title,
                    thumbnail: videos.thumbnail
                }
            });

            io.to(subscriberId).emit('new-video-notification', {
                uploader: req.user.fullName,
                videoId: videos._id,
                title: videos.title,
                thumbnail: videos.thumbnail
            });
        });
   }

    return res.status(200).json(new ApiResponse(200, videos, "Video Uploaded SuccessFully"));
}
)

const getVideoById = asyncHandler(async (req, res) => {
    const { id } = req.params
    const pipeline = [
        {
            $match: {
                _id: new mongoose.Types.ObjectId(id)
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "owner",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: '_id',
                foreignField: 'video',
                as: "Likes",
            }
        },
        {
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'video',
                as: 'commentCount'
            }
        },


        {
            $addFields: {
                owner: {
                    $first: '$owner'
                },

                subscribers: {
                    $size: '$subscribers'
                },
                likeCount: {
                    $size: '$Likes'
                },
                commentCount: {
                    $size: '$commentCount'
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                videofile: 1,
                thumbnail: 1,
                title: 1,
                description: 1,
                duration: 1,
                views: 1,
                isPublished: 1,
                owner: 1,
                subscribers: 1,
                likeCount: 1,
                isSubscribed: 1,
                commentCount: 1,
                createdAt: 1

            }
        }

    ]

    const video = await Video.aggregate(pipeline);
    if (!video) {
        throw new ApiError(404, "Video Not Found")
    }
    return res.status(200).json(
        new ApiResponse(200, video[0], "Video Fetch Sucessfully")
    )
}
)

const updateVideo = asyncHandler(async (req, res) => {
    const { title, description, isPublished } = req.body

    if ([title, description].some((field) => field?.trim() == "")) {
        throw new ApiError(400, "Title or description required")
    }
    const thumbnail = req.file?.path;

    const { id } = req.params;

    const video = await Video.findOne({
        _id: id,
        owner: req.user?._id
    })

    if (!video) {
        throw new ApiError(401, "Video Not Found")
    }

    const oldthumbnail = video.thumbnail
    if (oldthumbnail) {
        const removeOldThumbnail = await deleteFromCloud(oldthumbnail, "image")
        if (!removeOldThumbnail) {
            throw new ApiError(400, "thumbnail not removed on cloud")
        }
    }
    let newthumbnail;
    if (thumbnail) {
        newthumbnail = await uploadOnCloud(thumbnail, "image")
        if (!newthumbnail) {
            throw new ApiError(401, "thumbnail not found")
        }
    }

    const updatedVideo = await Video.findByIdAndUpdate(id,
        {
            $set: {
                title: title,
                thumbnail: newthumbnail?.secure_url || oldthumbnail,
                description: description,
                isPublished: isPublished
            }

        }, { new: true }
    )
    if (!updatedVideo) {
        throw new ApiError(500, "Something went wrong while Update Video")
    }

    return res.status(200)
        .json(
            new ApiResponse(200, updatedVideo, "Video Update Successfully...")
        )

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!(id)) {
        throw new ApiError(404, "Video not found")
    }
    const video = await Video.findOne({
        _id: id,
        owner: req.user?._id
    })

    if (!video) {
        throw new ApiError(401, "Video not found")
    }

    const thumbnailUrl = await video.thumbnail
    if (thumbnailUrl) {
        const deletingThumbnailFromCloud = await deleteFromCloud(thumbnailUrl, "image")
        if (!deletingThumbnailFromCloud) {
            throw new ApiError(500, 'Something went wrong while deleting thumbnail from cloud')
        }
    }

    const videoUrl = await video.videofile
    const deletingVideoFromCloud = await deleteFromCloud(videoUrl, "video")

    if (!deletingVideoFromCloud) {
        throw new ApiError(500, 'Something went wrong while deleting video from cloud')
    }


    const deletingOnDatabase = await Video.findByIdAndDelete(id)
    if (!deletingOnDatabase) {
        throw new ApiError(500, "Something went wronh while deleting video from database")
    }
    return res.status(200)
        .json(
            new ApiResponse(200, { 'deletedVideoId': id }, "Video Delete Sucessfully")
        )

}
)


export {
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    getAllSearchVideo,
    getAllVideo,
    uploadVideoOnCloud,
    deleteVideoFromCloud

}