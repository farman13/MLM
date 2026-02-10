import { PoolRound } from "../models/pool.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/AsyncHandler.js";

// -----------------------------
// Get Current Active Round
// -----------------------------
export const getCurrentRound = AsyncHandler(async (req, res) => {
    const round = await PoolRound.findOne({ status: "active" }).sort({
        roundId: -1,
    });

    if (!round) {
        throw new ApiError(404, "No active round found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, round, "Current round fetched successfully"));
});

// -----------------------------
// Get Round By ID
// -----------------------------
export const getRoundById = AsyncHandler(async (req, res) => {
    const { roundId } = req.params;

    if (!roundId) {
        throw new ApiError(400, "roundId is required");
    }

    const round = await PoolRound.findOne({ roundId: Number(roundId) });

    if (!round) {
        throw new ApiError(404, "Round not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, round, "Round fetched successfully"));
});

// -----------------------------
// Get All Rounds History
// -----------------------------
export const getAllRounds = AsyncHandler(async (req, res) => {
    const rounds = await PoolRound.find().sort({ roundId: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, rounds, "All rounds fetched successfully"));
});
