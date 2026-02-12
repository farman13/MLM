import express from "express";
import { getUserInfo } from "../controllers/mlm.controller.js";

const mlmRouter = express.Router();

// get user info from smart contract
mlmRouter.get("/user-info/:wallet", getUserInfo);

export default mlmRouter;
