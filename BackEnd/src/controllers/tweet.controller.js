import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweets.module.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloud } from "../utils/cloudnary.js"

const createTweet = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    const mediafile = req.file?.path
    let mediaFileUrl;
    if (mediafile) {
        mediaFileUrl = await uploadOnCloud(mediafile, 'image')
        if (!mediaFileUrl) throw new ApiError(500, "Failed To Upload");

    }
    if (!title || !description) throw new ApiError(401, "Data is required")

    const tweet = await Tweet.create({
        owner: new mongoose.Types.ObjectId(req.user?._id),
        title,
        description,
        media: mediaFileUrl?.secure_url
    })

    if (!tweet) throw new ApiError(500, error);

    return res.status(200)
        .json(new ApiResponse(200, tweet, "Create tweet successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    try {
        const loggedUser = req?.user?._id;
        if (!loggedUser) throw new ApiError(400, "Unauthorized User");
        const tweets = await Tweet.find({ owner: new mongoose.Types.ObjectId(loggedUser) });
        if (!tweets) return res.status(200).json(new ApiResponse(200, {}, "No Tweet Yet"))
        return res.status(200)
            .json(new ApiResponse(200, tweets, "Tweet Fetch Successfully"))
    } catch (error) {
        throw new ApiError(500, error);
    }
})

const getAllTweets = asyncHandler(async (req, res) => {
    try {
        const pipeline = [
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "tweet",
                    as: "tweetLike"
                }
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "tweet",
                    as: "tweetComment"
                }
            },

            {
                $addFields: {
                    likeCount: { $size: "$tweetLike" },
                    commentCount: { $size: "$tweetComment" },
                    isLikedTweet: {
                        $in: [req.user._id, {
                            $map: {
                                input: "$tweetLike",
                                as: "like",
                                in: "$$like.likeBy"
                            }
                        }]
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    media: 1,
                    user: {
                        userName: 1,
                        fullName: 1,
                        _id: 1,
                        avatar: 1,
                    },
                    likeCount: 1,
                    commentCount: 1,
                    isLikedTweet: 1
                }
            }
        ];



        const tweets = await Tweet.aggregate(pipeline);
        if (!tweets) throw new ApiError(404, "Tweet not found")
        return res.status(200)
            .json(new ApiResponse(200, tweets, "Tweet fetch sucessfully"))

    } catch (error) {
        throw new ApiError(500, error);
    }
})
const getAllUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params
    try {
        const pipeline = [
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "tweet",
                    as: "tweetLike"
                }
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "tweet",
                    as: "tweetComment"
                }
            },

            {
                $addFields: {
                    likeCount: { $size: "$tweetLike" },
                    commentCount: { $size: "$tweetComment" },
                    isLikedTweet: {
                        $in: [req.user._id, {
                            $map: {
                                input: "$tweetLike",
                                as: "like",
                                in: "$$like.likeBy"
                            }
                        }]
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    media: 1,
                    user: {
                        userName: 1,
                        fullName: 1,
                        _id: 1,
                        avatar: 1,
                    },
                    likeCount: 1,
                    commentCount: 1,
                    isLikedTweet: 1
                }
            }
        ];



        const tweets = await Tweet.aggregate(pipeline);
        if (!tweets) throw new ApiError(404, "Tweet not found")
        return res.status(200)
            .json(new ApiResponse(200, tweets, "Tweet fetch sucessfully"))

    } catch (error) {
        throw new ApiError(500, error);
    }
})

const updateTweet = asyncHandler(async (req, res) => {
    try {
        const { tweetId } = req.params;
        const loggedUser = req.user?._id;
        const { title, description } = req.body;

        if (!tweetId) throw new ApiError(400, "Tweet Id Not Found");
        if (!title || !description) throw new ApiError(400, "Content not found");
        if (!loggedUser) throw new ApiError(400, "Unauthorized User");

        const updatedTweet = await Tweet.findOneAndUpdate(
            { $and: [{ _id: new mongoose.Types.ObjectId(tweetId) }, { owner: new mongoose.Types.ObjectId(loggedUser) }] },
            {
                title,
                description,
                updatedAt: Date.now()
            },
            { new: true }
        )
        if (!updatedTweet) throw new ApiError(400, "Error while updating tweet");
        return res.status(200).json(new ApiResponse(200, updatedTweet, "Tweet Updated Successfully"));
    } catch (error) {
        throw new ApiError(500, error)
    }
})

const deleteTweet = asyncHandler(async (req, res) => {
    try {
        const { tweetId } = req.params;
        const loggedUser = req.user?._id;
        if (!loggedUser) throw new ApiError(400, "Unauthorized User");
        if (!tweetId) throw new ApiError(400, "Tweet Id is required");
        const tweetDeleteStatus = await Tweet.findOneAndDelete(
            { $and: [{ _id: tweetId }, { owner: loggedUser }] }
        )
        if (!tweetDeleteStatus) throw new ApiError(404, "Tweet not Found");
        return res.status(200).json(new ApiResponse(200, {}, "Tweet Delete Sucessfully"));

    } catch (error) {
        throw new ApiError(400, error);
    }
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
    getAllTweets,
    getAllUserTweets
}