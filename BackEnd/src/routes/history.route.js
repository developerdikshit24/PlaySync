import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
    addHistory,
    deleteAllHistory,
    deleteHistoryItem,
    getAllHistory
} from '../controllers/history.controller.js';

const router = Router()

router.route('/getAllHistory').get(verifyJwt, getAllHistory)
router.route('/addHistory').post(verifyJwt, addHistory)
router.route('/deleteHistoryItem').post(verifyJwt, deleteHistoryItem)
router.route('/deleteAllHistory').delete(verifyJwt, deleteAllHistory)

export default router