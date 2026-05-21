import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
    addViewCount,
    getAllChannelVideoViews
} from '../controllers/views.controller.js'

const router = Router();

router.route('/addView').post(verifyJwt, addViewCount);
router.route(`/getAllChannelView/:channelId`).get(getAllChannelVideoViews)


export default router