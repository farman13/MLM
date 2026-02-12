import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        walletAddress: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
        },

        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            minlength: 1,
            maxlength: 20,
        },

        referredByAddress: {
            type: String,
            default: null,
            lowercase: true,
            index: true,
        },

        directReferrals: [
            {
                type: String,
                lowercase: true,
            },
        ],

        directReferralCount: {
            type: Number,
            default: 0,
        },

        totalTeamSize: {
            type: Number,
            default: 0,
        },

        isRegistered: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
