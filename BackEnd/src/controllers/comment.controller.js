import mongoose from "mongoose"
import { Comment } from "../models/comments.module.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.models.js"
import { Tweet } from "../models/tweets.module.js"


const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        customLabels: {
            totalDocs: "total_comments",
            docs: "Comments"
        }
    }

    const getAllVideo = await Comment.aggregatePaginate([
        {
            $match: { video: new mongoose.Types.ObjectId(videoId) }

        },
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $lookup: {
                from: 'likes',
                localField: '_id',
                foreignField: 'comment',
                as: "commentLike"
            }
        },
        {
            $sort: { createdAt: -1 }
        }, {
            $addFields: {
                user: {
                    $first: '$user'
                },
                likes: {
                    $size: '$commentLike'
                }
            }
        }, {
            $project: {
                _id: 1,
                video: 1,
                owner: 1,
                content: 1,
                createdAt: 1,
                user: {
                    _id: 1,
                    userName: 1,
                    fullName: 1,
                    avatar: 1
                },
                likes: 1
            }
        }
    ], options)


    if (!getAllVideo) {
        throw new ApiError(500, "Something went wrong while fetching comment")
    }

    return res.status(200)
        .json(new ApiResponse(200, getAllVideo, "Comments fetch successfully"))

})

const getTweetComments = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const { page = 1, limit = 10 } = req.query

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        customLabels: {
            totalDocs: "total_comments",
            docs: "Comments"
        }
    }

    const getAllTweetComment = await Comment.aggregatePaginate([
        {
            $match: { tweet: new mongoose.Types.ObjectId(tweetId) }

        },
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $lookup: {
                from: 'likes',
                localField: '_id',
                foreignField: 'comment',
                as: "commentLike"
            }
        },
        {
            $sort: { createdAt: -1 }
        }, {
            $addFields: {
                user: {
                    $first: '$user'
                },
                likes: {
                    $size: '$commentLike'
                }
            }
        }, {
            $project: {
                _id: 1,
                video: 1,
                owner: 1,
                content: 1,
                createdAt: 1,
                user: {
                    _id: 1,
                    userName: 1,
                    fullName: 1,
                    avatar: 1
                },
                likes: 1
            }
        }
    ], options)


    if (!getAllTweetComment) {
        throw new ApiError(500, "Something went wrong while fetching comment")
    }

    return res.status(200)
        .json(new ApiResponse(200, getAllTweetComment, "Comments fetch successfully"))

})


const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId) {
        throw new ApiError(401, "Video Id Is Required")
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video Not Found")
    }

    const { content } = req.body
    if (!content) {
        throw new ApiError(401, "Comment is Required")
    }
    const addComments = await Comment.create({
        content,
        video: new mongoose.Types.ObjectId(video?._id),
        owner: new mongoose.Types.ObjectId(req.user._id)
    })

    if (!addComments) {
        throw new ApiError(500, "Something went wrong while adding comment")
    }

    return res.status(200)
        .json(new ApiResponse(200, addComments, "Comment Add Successfully"))

}
)

const addTweetComment = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    if (!tweetId) {
        throw new ApiError(401, "Tweet Id Is Required")
    }

    const tweet = await Tweet.findById(tweetId)
    if (!tweet) {
        throw new ApiError(404, "Tweet Not Found")
    }

    const { content } = req.body
    if (!content) {
        throw new ApiError(401, "Comment is Required")
    }
    const addComments = await Comment.create({
        content,
        tweet: new mongoose.Types.ObjectId(tweet?._id),
        owner: new mongoose.Types.ObjectId(req.user._id)
    })

    if (!addComments) {
        throw new ApiError(500, "Something went wrong while adding comment")
    }

    return res.status(200)
        .json(new ApiResponse(200, addComments, "Comment Add Successfully"))

}
)


const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const { content } = req.body
    if (!content) throw new ApiError(401, "Comment is Required")

    const comment = await Comment.findOne({
        _id: new mongoose.Types.ObjectId(commentId),
        owner: new mongoose.Types.ObjectId(req.user?._id)
    })
    if (!comment) throw new ApiError(401, "Comment Not Found")
    comment.content = content
    await comment.save()

    return res.status(200)
        .json(new ApiResponse(200, { comment }, "Comment Update SuccessFully"))

})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const delComment = await Comment.deleteOne({
        $and: [{ _id: commentId }, { owner: req.user._id }]
    })

    if (delComment.deletedCount === 0) throw new ApiError(404, "Comment not found!")

    return res.status(200)
        .json(new ApiResponse(200, {}, "Comment Delete Successfully"))
})
const deleteAllTweetComment = asyncHandler(async (req, res) => {
    try {
        const { tweetId } = req.params;
        if (!tweetId) throw new ApiError(401, "TweetId is Required");
        const delComment = await Comment.deleteMany({ tweet: tweetId });
        return res.status(200)
            .json(new ApiResponse(200, delComment, "All Comments Delete Successfully"))
    } catch (error) {
        throw new ApiError(500, error)
    }
})
const deleteAllVideoComment = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params;
        if (!videoId) throw new ApiError(401, "videoId is Required");
        const delComment = await Comment.deleteMany({ video: videoId });
        return res.status(200)
            .json(new ApiResponse(200, delComment, "All Comments Delete Successfully"))
    } catch (error) {
        throw new ApiError(500, error)
    }
})
export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment,
    addTweetComment,
    getTweetComments,
    deleteAllVideoComment,
    deleteAllTweetComment
}
