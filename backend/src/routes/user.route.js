import express from "express";
import {
    registerUser,
    getUserByUsername,
    getUserByWallet,
    updateUsername,
    getAllUsers,
    getReferralTreeByUsername,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

// Register user
userRouter.post("/register", registerUser);

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
