import express from "express";
import { getNonce, verifySignature } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.get("/nonce/:wallet", getNonce);
authRouter.post("/verify", verifySignature);

export default authRouter;
