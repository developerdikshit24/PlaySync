import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from '../utils/ApiError.js'
import { User } from "../models/user.models.js"
import { deleteFromCloud, uploadOnCloud } from "../utils/cloudnary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(`${process.env.GOOGLE_CLIENT_ID}`)


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generate Access and Refresh Token")
    }

}

const authWithGoogle = asyncHandler(async (req, res) => {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: `${process.env.GOOGLE_CLIENT_ID}`,
    });
    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;
    let user = await User.findOne({ email });
    if (!user) {
        if (!picture) throw new ApiError(400, "avatar not found");
        user = await User.create({
            userName: email.split("@")[0],
            fullName: name,
            email,
            password: googleId,
            avatar: picture
        })
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loginUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loginUser, refreshToken, accessToken },
                "Google Sign-in successful"
            )
        );

})

const registerUser = asyncHandler(async (req, res) => {
    const { userName, email, fullName, password } = req.body

    if ([userName, email, fullName, password].some((field) => field?.trim() == "")) {
        throw new ApiError(400, "All Fields Are Required..")
    }
    if (!email.includes("@")) {
        throw new ApiError(400, "Required Valid Email Id")
    }

    const existedUser = await User.findOne({
        $or: [{ userName }, { email },]
    })

    if (existedUser) {
        throw new ApiError(409, "Username or Email already exist")
    };

    const avatarLocalPath = req.files?.avatar[0]?.path;
    let avatar;
    if (avatarLocalPath) {
        avatar = await uploadOnCloud(avatarLocalPath, "image")
    }


    const user = await User.create({
        fullName,
        userName: userName.toLowerCase(),
        email,
        password,
        avatar: avatar?.url,

    })

    const createUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createUser) {
        throw new ApiError(500, "Something Went Wrong While Registering")
    }

    return res.status(201).json(
        new ApiResponse(200, createUser, "User Register Successfully")
    )
})


const loginUser = asyncHandler(async (req, res) => {
    const { userName, email, password } = await req.body

    if (!(userName || email)) {
        throw new ApiError(400, "UserName or Email Required")
    }
    const user = await User.findOne({
        $or: [{ userName }, { email }]
    })
    
    if (!user) {
        throw new ApiError(400, "User doesnot exist")
    }

    const isVaildPassword = await user.isPasswordCorrect(password)

    if (!isVaildPassword) {
        throw new ApiError(401, "Invaild Credential");

    }



    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loginUser = await User.findById(user._id).select("-password -refreshToken")
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loginUser, refreshToken, accessToken },
                "User Logged in Successfully"
            ))
}
)

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: 1 } },
        { new: true }

    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User logged Out")
        )
}
)

const toggelHistorySetting = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id); 

    if (!user) throw new ApiError(401, "Unauthorized Access");

    user.isHistorySaved = !user.isHistorySaved;

    await user.save({ validateBeforeSave: false }); 

    return res.status(200).json(
        new ApiResponse(200, user.isHistorySaved, "History toggled")
    );
});


const updateUserTheme = asyncHandler(async (req, res) => {
    const { theme } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) throw new ApiError(401, "Unauthorized Access");

    user.theme = theme;

    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, user.theme, "Theme updated")
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingToken = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingToken) {
        throw new ApiError(404, "Unauthorized Access")
    }
    try {
        const deCodedToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET)
        const user = User.findById(deCodedToken?._id)
        if (!user) {
            throw new ApiError(400, "Invaild access request")
        }

        if (incomingToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh Token is Expired or Used")
        }
        const { accessToken, newrefreshToken } = generateAccessAndRefreshTokens(user._id)

        const options = {
            httpOnly: true,
            secure: true
        }
        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newrefreshToken, options)
            .json(
                new ApiResponse(200,
                    {
                        accessToken,
                        refreshToken: newrefreshToken
                    },
                    "Access Refresh Successfully"
                )
            )
    } catch (error) {
        throw new ApiError(404, error?.message || "Invaild Access Token")
    }

}
)

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new ApiError(404, "Invaild Old Password")
    }

    user.password = newPassword;
    user.save({ validateBeforeSave: false })
    return res.status(200)
        .json(new ApiResponse(200,
            {},
            "Password change Successfully"
        ))
}
)

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200)
        .json(new ApiResponse(200, req.user, "Current user fetch sucessfully"))

}
)

const updateAccountDetail = asyncHandler(async (req, res) => {
    const { fullName, userName, bio, socialMedia } = req.body
    if (!fullName || !userName || !bio) {
        throw new ApiError(401, 'All feilds are Required')
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                userName,
                bio,
                socialMdiaLink: socialMedia
            }
        },
        { new: true }

    ).select("-password -refreshToken")

    return res.status(200).json(new ApiResponse(200, user, "Account Detail Updated"))
}
)

const updateUserAvatar = asyncHandler(async (req, res) => {

    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new ApiError(404, "Avatar Not Found")
    }

    const userId = await User.findById(req.user?._id)
    const oldAvatar = userId.avatar
    const deleteOldAvatar = await deleteFromCloud(oldAvatar, "image")
    if (!deleteOldAvatar) {
        throw new ApiError(400, "Something went wrong while delete avatar on cloud")
    }

    const avatar = await uploadOnCloud(avatarLocalPath, "image");

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploding the Avatar")
    }


    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        }, { new: true }
    ).select("-password -refreshToken")

    return res.status(200)
        .json(new ApiResponse(200, { user }, "Avatar Updated Successlly"))
}

)
const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "Username is missing")
    }
    const channel = await User.aggregate([
        {
            $match: {
                userName: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        }, {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "videos"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                publishVideo: {
                    $cond: {
                        if: { $isArray: "$videos" },
                        then: "$videos",
                        else: []
                    }
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                userName: 1,
                subscribersCount: 1,
                channelSubscribedToCount: 1,
                isSubscribed: 1,
                publishVideo: 1,
                email: 1,
                avatar: 1,
                coverImage: 1,
                bio: 1,
                socialMdiaLink: 1,
                createdAt:1
            }
        }


    ])

    if (!channel?.length) {
        throw new ApiError(404, "Channel Does's not Exist")
    }
    return res.status(200).json(
        new ApiResponse(200, channel[0], "User Fetch Successfully")
    )
}
)

const getWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)

            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [{
                    $lookup: {
                        from: "users",
                        localField: "owner",
                        foreignField: "_id",
                        as: "owner",
                        pipeline: [{
                            $project: {
                                fullName: 1,
                                email: 1,
                                userName: 1
                            }
                        }]
                    }
                },
                {
                    $addFields: {
                        owner: {
                            $first: "$owner"
                        }
                    }
                }

                ]

            }
        }
    ])
    return res.status(200)
        .json(new ApiResponse(200, user[0].watchHistory, "Watch History fetched sucessfully..."))
}
)


const addDraftVideo = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const { videoUrl } = req.body;
        if (!userId) throw new ApiError(401, "Unauthorized User");
        if (!videoUrl) throw new ApiError(404, "Video URL is required")
        const user = await User.findByIdAndUpdate(userId,
            {
                $set: {
                    draftVideo: videoUrl
                }
            },
            { new: true }
        ).select('-password -refreshToken')
        if (!user) throw new ApiError(404, 'User not found');
        return res.status(200)
            .json(new ApiResponse(200, user, "Add Draft Video Sucessfully"))
    } catch (error) {
        throw new ApiError(500, error)
    }
});

const removeDraftVideo = asyncHandler(async (req, res) => {
    const userId = req.user._id
    if (!userId) throw new ApiError(401, 'Unauthorized user');
    const user = await User.findByIdAndUpdate(userId,
        {
            $unset: { draftVideo: 1 }
        },
        { new: true }
    ).select('-password -refreshToken')
    if (!user) throw new ApiError(404, 'User not found');
    return res.status(200)
        .json(new ApiResponse(200, user, "Remove Draft Video Sucessfully"))
})

const addRecentSearch = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const { search } = req.body;

        if (!userId) throw new ApiError(401, 'Unauthorized user');
        if (!search || typeof search !== "string")
            throw new ApiError(400, 'Search term is required');

        const user = await User.findById(userId).select("-password -refreshToken")
        if (!user) throw new ApiError(404, 'User not found');

        if (user.recentSearches.includes(search)) {
            return res.status(200).json(new ApiResponse(200, user, "Search already exists"));
        }

        user.recentSearches.unshift(search);

        if (user.recentSearches.length > 5) {
            user.recentSearches = user.recentSearches.slice(0, 5);
        }

        await user.save();
        return res.status(200).json(new ApiResponse(200, user, "Search added successfully"));
    } catch (error) {
        throw new ApiError(500, error);
    }
});

const removeRecentSearch = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const { search } = req.body;

        if (!userId) throw new ApiError(401, 'Unauthorized user');
        if (!search || typeof search !== "string")
            throw new ApiError(400, 'Search term is required');

        const user = await User.findById(userId);
        if (!user) throw new ApiError(404, 'User not found');

        user.recentSearches = user.recentSearches.filter(s => s !== search);
        await user.save();

        return res.status(200).json(
            new ApiResponse(200, user, "Search removed successfully")
        );
    } catch (error) {
        throw new ApiError(500, error);
    }
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetail,
    updateUserAvatar,
    getUserChannelProfile,
    getWatchHistory,
    authWithGoogle,
    addRecentSearch,
    removeRecentSearch,
    removeDraftVideo,
    addDraftVideo,
    toggelHistorySetting,
    updateUserTheme
}
