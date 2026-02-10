import express from "express";
import {
    registerUser,
    getUserByUsername,
    getUserByWallet,
    updateUsername,
    getAllUsers,
    getReferralTreeByUsername,
    getMe,
    getMyReferralTree,
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

// Register user
userRouter.post("/register", registerUser);

// Get logged-in user
userRouter.get("/me", verifyJWT, getMe);

// Get logged-in user referral tree
userRouter.get("/me/tree", verifyJWT, getMyReferralTree);

// Get all users
userRouter.get("/all", getAllUsers);

// Get user by username
userRouter.get("/username/:username", getUserByUsername);

// Get user by wallet
userRouter.get("/wallet/:wallet", getUserByWallet);

// Update username
userRouter.put("/update-username/:wallet", updateUsername);

// Referral tree by username
userRouter.get("/tree/:username", getReferralTreeByUsername);

export default userRouter;
