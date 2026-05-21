import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos,
    getAllLikeVideoContent,
    deleteAllVideoLike,
    deleteAllTweetLike
} from "../controllers/like.controller.js"

const router = Router()

router.route("/likeVideo/:videoId").post(verifyJwt, toggleVideoLike)
router.route("/likeComment/:commentId").post(verifyJwt, toggleCommentLike)
router.route("/likeTweet/:tweetId").post(verifyJwt, toggleTweetLike)
router.route("/getLikedVideos").get(verifyJwt, getLikedVideos)
router.route("/getAllLikeVideoContent").get(verifyJwt, getAllLikeVideoContent)
router.route("/deleteAllVideoLike/:videoId").delete(deleteAllVideoLike)
router.route("/deleteAllTweetLike/:tweetId").delete(deleteAllTweetLike)
 
export default router