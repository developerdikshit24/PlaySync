import { Router } from "express";
import {
    addComment,
    getVideoComments,
    updateComment,
    deleteComment,
    addTweetComment,
    getTweetComments,
    deleteAllVideoComment,
    deleteAllTweetComment
} from "../controllers/comment.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/addComment/:videoId").post(verifyJwt, addComment)
router.route("/addTweetComment/:tweetId").post(verifyJwt, addTweetComment)
router.route("/getVideoComments/:videoId").get(getVideoComments)
router.route("/getTweetComments/:tweetId").get(getTweetComments)
router.route("/updateComment/:commentId").patch(verifyJwt, updateComment)
router.route("/deleteComment/:commentId").delete(verifyJwt, deleteComment)
router.route("/deleteAllVideoComment/:videoId").delete(deleteAllVideoComment)
router.route("/deleteAllTweetComment/:tweetId").delete(deleteAllTweetComment)

export default router