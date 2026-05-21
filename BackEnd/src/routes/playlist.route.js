import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";

import {
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    removeVideoFromPlaylist,
    addVideoInPlaylist,
    getAllPlaylist
} from "../controllers/playlist.controller.js"

const router = Router()
router.route("/createPlaylist").post(verifyJwt, createPlaylist);
router.route("/updatePlaylist/:playlistId").patch(verifyJwt, updatePlaylist);
router.route("/deletePlaylist/:playlistId").delete(verifyJwt, deletePlaylist);
router.route("/removeVideoFromPlaylist").patch(verifyJwt, removeVideoFromPlaylist);
router.route("/addVideoInPlaylist/:playlistId").post(verifyJwt, addVideoInPlaylist);
router.route("/getAllPlaylist/:userId").get(verifyJwt, getAllPlaylist);

export default router