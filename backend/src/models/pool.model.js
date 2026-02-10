import mongoose from "mongoose";

const poolRoundSchema = new mongoose.Schema(
    {
        roundId: {
            type: Number,
            required: true,
            unique: true,
            index: true,
        },

        winner: {
            type: String,
            default: null,
            lowercase: true,
        },

        winnerAmount: {
            type: String,
            default: "0",
        },

        adminFee: {
            type: String,
            default: "0",
        },

        txHash: {
            type: String,
            default: null,
        },

        status: {
            type: String,
            enum: ["active", "completed"],
            default: "active",
        },
    },
    { timestamps: true }
);

export const PoolRound = mongoose.model("PoolRound", poolRoundSchema);
