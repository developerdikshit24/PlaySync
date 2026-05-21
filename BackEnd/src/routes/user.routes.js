import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js"
import {
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
} from "../controllers/user.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(upload.single(
    {
        name: "avatar",
        maxCount: 1
    }),
    registerUser
);
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJwt, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/changePassword").patch(verifyJwt, changeCurrentPassword)
router.route("/getuser").get(verifyJwt, getCurrentUser)
router.route("/updateDetails").patch(verifyJwt, updateAccountDetail)
router.route("/changeAvatar").patch(verifyJwt, upload.single("avatar"), updateUserAvatar)
router.route("/c/:username").get(verifyJwt, getUserChannelProfile)
router.route("/history").get(verifyJwt, getWatchHistory)
router.route('/googleauth').post(authWithGoogle)
router.route('/addDraftVideo').post(verifyJwt,addDraftVideo)
router.route('/removeDraftVideo').post(verifyJwt,removeDraftVideo)
router.route('/addRecentSearch').post(verifyJwt,addRecentSearch)
router.route('/removeRecentSearch').post(verifyJwt,removeRecentSearch)
router.route('/toggelHistorySetting').get(verifyJwt, toggelHistorySetting)
router.route('/updateUserTheme').patch(verifyJwt, updateUserTheme)

export default router