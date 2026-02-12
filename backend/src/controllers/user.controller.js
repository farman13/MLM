import { getUserInfoFromChain } from "../listeners/mlm.listner.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import { createToken } from "./auth.controller.js";
import axios from "axios";

// ==========================================
// Register User
// ==========================================
export const registerUser = AsyncHandler(async (req, res) => {
    const { walletAddress, username, referredByAddress } = req.body;

    if (!walletAddress || !username) {
        throw new ApiError(400, "walletAddress and username are required");
    }

    const wallet = walletAddress.toLowerCase();
    const uname = username.toLowerCase();

    const existingWallet = await User.findOne({ walletAddress: wallet });
    if (existingWallet) {
        throw new ApiError(400, "Wallet already registered");
    }

    const existingUsername = await User.findOne({ username: uname });
    if (existingUsername) {
        throw new ApiError(400, "Username already taken");
    }

    const referrerWallet = referredByAddress
        ? referredByAddress.toLowerCase()
        : null;

    // ✅ if referrer exists, it must be a registered user
    if (referrerWallet) {
        const refExists = await User.findOne({ walletAddress: referrerWallet });

        if (!refExists) {
            throw new ApiError(400, "Invalid referral code");
        }
    }

    const newUser = await User.create({
        walletAddress: wallet,
        username: uname,
        referredByAddress: referrerWallet,
        directReferrals: [],
        directReferralCount: 0,
        totalTeamSize: 0,
        isRegistered: true,
    });

    // update referrer
    if (referrerWallet) {
        const referrer = await User.findOne({ walletAddress: referrerWallet });

        if (referrer) {
            if (!referrer.directReferrals.includes(wallet)) {
                referrer.directReferrals.push(wallet);
                referrer.directReferralCount += 1;
                referrer.totalTeamSize += 1;
                await referrer.save();
            }
        }
    }

    // create jwt after registration
    const isAdmin = wallet === process.env.ADMIN_WALLET?.toLowerCase();

    const token = createToken({
        walletAddress: wallet,
        username: newUser.username,
        role: isAdmin ? "admin" : "user",
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                user: newUser,
                token,
                role: isAdmin ? "admin" : "user",
            },
            "User registered successfully"
        )
    );
});

// ==========================================
// Get User By Username
// ==========================================
export const getUserByUsername = AsyncHandler(async (req, res) => {
    const { username } = req.params;

    if (!username) {
        throw new ApiError(400, "Username is required");
    }

    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User fetched successfully"));
});

// ==========================================
// Get User By Wallet Address
// ==========================================
export const getUserByWallet = AsyncHandler(async (req, res) => {
    const { wallet } = req.params;

    if (!wallet) {
        throw new ApiError(400, "Wallet address is required");
    }

    const user = await User.findOne({ walletAddress: wallet.toLowerCase() });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User fetched successfully"));
});

// ==========================================
// Update Username
// ==========================================
export const updateUsername = AsyncHandler(async (req, res) => {
    const { wallet } = req.params;
    const { username } = req.body;

    if (!wallet) {
        throw new ApiError(400, "Wallet address is required");
    }

    if (!username) {
        throw new ApiError(400, "username is required");
    }

    const user = await User.findOne({ walletAddress: wallet.toLowerCase() });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const existingUsername = await User.findOne({
        username: username.toLowerCase(),
    });

    if (existingUsername) {
        throw new ApiError(400, "Username already taken");
    }

    user.username = username.toLowerCase();
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Username updated successfully"));
});

// ==========================================
// Get All Users
// ==========================================
export const getAllUsers = AsyncHandler(async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, users, "Users fetched successfully"));
});



// ==========================================
// Build Referral Tree Recursively (DB Tree + Chain Enrichment)
// ==========================================
const buildTree = async (walletAddress, depth = 0, maxDepth = 10) => {
    if (depth >= maxDepth) return null;

    const user = await User.findOne({ walletAddress });

    if (!user) return null;

    // ✅ Fetch smart contract info
    const chainInfo = await getUserInfoFromChain(user.walletAddress);
    console.log(`Building tree for ${user.username} at depth ${depth} with chain info:`, chainInfo);

    const children = [];

    for (let childWallet of user.directReferrals) {
        const childNode = await buildTree(childWallet, depth + 1, maxDepth);
        if (childNode) children.push(childNode);
    }

    return {
        username: user.username,
        walletAddress: user.walletAddress,

        // ✅ level & directReferrals from chain (REAL)
        level: chainInfo ? Number(chainInfo.level) : 0,
        directReferralCount: chainInfo
            ? Number(chainInfo.directReferrals)
            : user.directReferralCount,

        teamSize: chainInfo ? Number(chainInfo.teamSize) : user.totalTeamSize,
        registered: chainInfo ? chainInfo.registered : user.isRegistered,

        referrals: children,
    };
};

// ==========================================
// Get Referral Tree by Username
// ==========================================
export const getReferralTreeByUsername = AsyncHandler(async (req, res) => {
    const { username } = req.params;

    if (!username) {
        throw new ApiError(400, "Username is required");
    }

    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const tree = await buildTree(user.walletAddress);

    return res
        .status(200)
        .json(new ApiResponse(200, tree, "Referral tree fetched successfully"));
});

// ==========================================
// Get Logged-in User Profile (ME)
// ==========================================
export const getMe = AsyncHandler(async (req, res) => {
    const wallet = req.user.walletAddress;

    const user = await User.findOne({ walletAddress: wallet });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // ✅ attach chain info also
    const chainInfo = await fetchUserInfoFromChain(user.walletAddress);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                ...user.toObject(),
                chainInfo,
            },
            "User profile fetched successfully"
        )
    );
});

// ==========================================
// Get Logged-in User Referral Tree (ME)
// ==========================================
export const getMyReferralTree = AsyncHandler(async (req, res) => {
    const wallet = req.user.walletAddress;

    const user = await User.findOne({ walletAddress: wallet });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const tree = await buildTree(user.walletAddress);

    return res
        .status(200)
        .json(new ApiResponse(200, tree, "My referral tree fetched successfully"));
});

// ==========================================
// Validate Referrer Wallet
// ==========================================
export const validateReferrer = AsyncHandler(async (req, res) => {
    const { wallet } = req.params;

    if (!wallet) {
        throw new ApiError(400, "Wallet address is required");
    }

    const user = await User.findOne({ walletAddress: wallet.toLowerCase() });

    return res.status(200).json(
        new ApiResponse(
            200,
            { valid: !!user },
            user ? "Valid referrer" : "Invalid referrer"
        )
    );
});
