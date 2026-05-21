import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
    getAllTweets,
    getAllUserTweets

} from "../controllers/tweet.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/createTweet").post(verifyJwt, upload.single('mediafile'), createTweet)
router.route("/getUserTweets").get(verifyJwt, getUserTweets)
router.route('/getAllTweet').get(verifyJwt, getAllTweets)
router.route('/getAllUserTweets/:userId').get(verifyJwt, getAllUserTweets)
router.route("/updateTweet/:tweetId").patch(verifyJwt, updateTweet)
router.route("/deleteTweet/:tweetId").delete(verifyJwt, deleteTweet)

export default router