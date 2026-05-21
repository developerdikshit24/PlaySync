import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/likes.module.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) throw new ApiError(401, "Video is not found")
    const videoLike = await Like.findOne({
        $and: [{ video: videoId }, { likeBy: req.user?._id }]
    })
    if (videoLike) {
        await Like.findByIdAndDelete(videoLike._id)
        return res.status(200)
            .json(new ApiResponse(200, false, "Like Remove on Video successfully"))
    }

    const addLike = await Like.create({
        video: new mongoose.Types.ObjectId(videoId),
        likeBy: new mongoose.Types.ObjectId(req.user?._id)
    })
    if (!addLike) throw new ApiError(500, "Something went wrong while adding like on video")

    return res.status(200)
        .json(new ApiResponse(200, true, "Like Add on Video successfully"))

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    if (!isValidObjectId(commentId)) throw new ApiError(401, "Invaild comment Id")

    const commentLike = await Like.findOne({
        $and: [{ comment: commentId }, { likeBy: req.user?._id }]
    })

    if (commentLike) {
        const removeLike = await Like.findByIdAndDelete(commentLike._id)
        return res.status(200)
            .json(new ApiResponse(200, removeLike, "Like remove on comment is sucessfully"))
    }

    const addLike = await Like.create({
        comment: new mongoose.Types.ObjectId(commentId),
        likeBy: new mongoose.Types.ObjectId(req.user?._id)
    })
    if (!addLike) throw new ApiError(500, "Something went wrong while adding like")

    return res.status(200)
        .json(new ApiResponse(200, addLike, "Like Add on comment successfully"))
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    if (!isValidObjectId(tweetId)) throw new ApiError(401, "Invaild tweet id")
    const likeTweet = await Like.findOne({
        $and: [{ tweet: tweetId }, { likeBy: req.user?._id }]
    })

    if (likeTweet) {
        const removeLike = await Like.findByIdAndDelete(likeTweet._id)
        if (!removeLike) throw new ApiError(500, "Something went wrong while removing like")
        return res.status(200)
            .json(new ApiResponse(200, false, "Like remove on tweet successfully"))
    }

    const addLike = await Like.create({
        tweet: new mongoose.Types.ObjectId(tweetId),
        likeBy: new mongoose.Types.ObjectId(req.user?._id)
    })

    if (!addLike) throw new ApiError(500, "Something went wrong while adding like")

    return res.status(200)
        .json(new ApiResponse(200, true, "LIke add on tweet successfully"))
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    try {
        const likeVideo = await Like.find({
            $and: [{ likeBy: req.user?._id }, { video: { $exists: true } }]
        })

        if (!likeVideo) throw new ApiError(500, "SomeThing went wrong while Fetching Like video or Video Not Found")

        return res.status(200)
            .json(new ApiResponse(200, { "Total Video : ": likeVideo.length, "Video": likeVideo }, "Like Video Fetch successfully"))
    } catch (error) {
        throw new ApiError(500, error)
    }
})

const getAllLikeVideoContent = asyncHandler(async (req, res) => {
    try {
        const pipeline = [
            {
                $match: {
                    $and: [{ likeBy: req.user?._id }, { video: { $exists: true } }]
                }
            },
            {
                $lookup: {
                    from: 'videos',
                    localField: 'video',
                    foreignField: '_id',
                    as: 'videoContent'
                }
            },
            {
                $unwind: '$videoContent'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'videoContent.owner',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $addFields: {
                    userData: { $first: '$userData' }
                }
            },
            {
                $project: {
                    videoContent: 1,
                    userData: {
                        _id: 1,
                        userName: 1,
                        fullName: 1,
                        avatar: 1,
                        createdAt: 1
                    }
                }
            }
        ]

        const videoContent = await Like.aggregate(pipeline);
        if (videoContent.length == 0) throw new ApiError(404, 'Video not found')
        return res.status(200)
            .json(new ApiResponse(200, videoContent, "Video fetch sucessfully"))
    } catch (error) {
        throw new ApiError(500, error)
    }
})


const deleteAllVideoLike = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params;

        if (!videoId) throw new ApiError(404, 'videoId not found');

        await Like.deleteMany({ video: videoId });
        return res.status(200)
            .json(new ApiResponse(200, 'Liked Deleted'))
    } catch (error) {
        throw new ApiError(500, error)
    }

})
const deleteAllTweetLike = asyncHandler(async (req, res) => {
    try {
        const { tweetId } = req.params;

        if (!tweetId) throw new ApiError(400, 'Tweet ID not provided');

        await Like.deleteMany({
            tweet: tweetId,
        });

        return res.status(200).json(new ApiResponse(200, 'Likes deleted'));
    } catch (error) {
        throw new ApiError(500, error)
    }

})
export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    getAllLikeVideoContent,
    deleteAllVideoLike,
    deleteAllTweetLike
}