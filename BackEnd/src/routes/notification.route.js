import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
    createNotification,
    getAllUnseenNotifications,
    getNotifications,
    markAllSeen,
} from '../controllers/notification.controller.js';

const router = Router();

router.route("/createNotification").post(verifyJwt, createNotification);
router.route("/getNotifications").get(verifyJwt, getNotifications);
router.route("/getAllUnseenNotifications").get(verifyJwt, getAllUnseenNotifications);
router.route("/markAllSeen").post(verifyJwt, markAllSeen);


export default router;