import ApiError from "../utils/ApiError.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ethers } from "ethers";
import { getUserInfoFromChain } from "../listeners/mlm.listner.js";

export const getUserInfo = AsyncHandler(async (req, res) => {
    const { wallet } = req.params;

    if (!wallet || !ethers.isAddress(wallet)) {
        throw new ApiError(400, "Invalid wallet address");
    }

    const userInfo = await getUserInfoFromChain(wallet);

    return res
        .status(200)
        .json(new ApiResponse(200, userInfo, "User info fetched successfully"));
});
