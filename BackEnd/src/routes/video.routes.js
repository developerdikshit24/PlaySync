import { Router } from "express";
import {
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    getAllSearchVideo,
    getAllVideo,
    uploadVideoOnCloud,
    deleteVideoFromCloud
} from "../controllers/video.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/publishVideo").post(verifyJwt, upload.single("thumbnail"), publishAVideo)

router.route('/uploadVideo').post(verifyJwt, upload.single("videofile"), uploadVideoOnCloud)
router.route("/url/:id").get(verifyJwt, getVideoById)
router.route("/updateVideo/url/:id").patch(verifyJwt, upload.single("thumbnail"), updateVideo);
router.route("/deleteFromCloud").post(verifyJwt, deleteVideoFromCloud)
router.route("/deleteVideo/url/:id").delete(verifyJwt, deleteVideo)
router.route("/getAllSearchVideo").get(getAllSearchVideo)
router.route("/getAllVideo").get(getAllVideo)
export default router 