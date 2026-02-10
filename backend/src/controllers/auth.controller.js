import jwt from "jsonwebtoken";
import { ethers } from "ethers";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/AsyncHandler.js";

import { User } from "../models/user.model.js";

export const createToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES || "7d",
    });
};

// -----------------------------
// Get Nonce Message
// -----------------------------
export const getNonce = AsyncHandler(async (req, res) => {
    const { wallet } = req.params;

    if (!wallet) {
        throw new ApiError(400, "Wallet is required");
    }

    const nonce = Math.floor(100000 + Math.random() * 900000);

    const message = `Login to EarningMetaWay\nWallet: ${wallet}\nNonce: ${nonce}`;

    return res
        .status(200)
        .json(new ApiResponse(200, { message }, "Nonce generated successfully"));
});

// -----------------------------
// Verify Signature & Generate JWT
// -----------------------------
export const verifySignature = AsyncHandler(async (req, res) => {
    const { walletAddress, signature, message } = req.body;

    if (!walletAddress || !signature || !message) {
        throw new ApiError(400, "walletAddress, signature, message are required");
    }

    const recovered = ethers.verifyMessage(message, signature);

    if (recovered.toLowerCase() !== walletAddress.toLowerCase()) {
        throw new ApiError(401, "Invalid signature");
    }

    // ✅ Check if user exists in DB
    const user = await User.findOne({
        walletAddress: walletAddress.toLowerCase(),
    });

    if (!user) {
        throw new ApiError(404, "User not registered. Please register first.");
    }

    const isAdmin =
        walletAddress.toLowerCase() === process.env.ADMIN_WALLET.toLowerCase();

    const token = createToken({
        walletAddress: user.walletAddress,
        username: user.username,
        role: isAdmin ? "admin" : "user",
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                token,
                role: isAdmin ? "admin" : "user",
                walletAddress: user.walletAddress,
                user,
            },
            "Login successful"
        )
    );
});
