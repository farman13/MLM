import express from "express";
import {
    getCurrentRound,
    getRoundById,
    getAllRounds,
} from "../controllers/pool.controller.js";

const router = express.Router();

// Get current active round
router.get("/current", getCurrentRound);

// Get all rounds history
router.get("/all", getAllRounds);

// Get round by roundId
router.get("/round/:roundId", getRoundById);

export default router;
