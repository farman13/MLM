import express from "express";
import { getBNBPrice } from "../controllers/price.controller.js";

const priceRouter = express.Router();

priceRouter.get("/bnb", getBNBPrice);

export default priceRouter;
