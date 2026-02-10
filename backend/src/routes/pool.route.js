import express from "express";
import {
    getCurrentRound,
    getRoundById,
    getAllRounds,
} from "../controllers/pool.controller.js";

import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";

const poolRouter = express.Router();

// Admin Protected Routes
poolRouter.get("/current", verifyJWT, verifyAdmin, getCurrentRound);
poolRouter.get("/all", verifyJWT, verifyAdmin, getAllRounds);
poolRouter.get("/round/:roundId", verifyJWT, verifyAdmin, getRoundById);

export default poolRouter;
