import { ethers } from "ethers";
import { mlmAbi } from "../utils/mlmContractConfig.js";

const CONTRACT_ADDRESS = process.env.MLM_CONTRACT_ADDRESS;
// const MLM_CONTRACT_ADDRESS = "0x40e7d0815f6ACaD9954064d34b7aCe3e491D2845";


export const getUserInfoFromChain = async (wallet) => {

    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

    const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        mlmAbi,
        provider
    );

    const data = await contract.getUserInfo(wallet);
    console.log("User info from chain:", data);

    return {
        referrer: data[0],
        level: Number(data[1]),
        directReferrals: Number(data[2]),
        teamSize: Number(data[3]),
        withdrawable: data[4].toString(),
        totalProfit: data[5].toString(),
        lastUpgradeTime: Number(data[6]),
        registered: data[7],
    };
};
