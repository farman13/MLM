import axios from "axios";
import ApiResponse from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/AsyncHandler.js";

let cachedPrice = null;
let lastFetchTime = 0;

export const getBNBPrice = AsyncHandler(async (req, res) => {
    const now = Date.now();

    // cache for 10 seconds
    if (cachedPrice && now - lastFetchTime < 60000) {
        return res
            .status(200)
            .json(new ApiResponse(200, cachedPrice, "BNB price fetched (cached)"));
    }

    const url =
        "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd";

    const response = await axios.get(url);

    const price = response.data.binancecoin.usd;

    cachedPrice = { price };
    lastFetchTime = now;

    console.log(`Fetched BNB price: $${price}`);

    return res
        .status(200)
        .json(new ApiResponse(200, { price }, "BNB price fetched successfully"));
});
