import { ethers } from "ethers";
import { mlmAbi } from "../utils/mlmContractConfig.js";

// const CONTRACT_ADDRESS = process.env.MLM_CONTRACT_ADDRESS;
const MLM_CONTRACT_ADDRESS = "0x49093315B4012454ED3Ae465eB02060aFcE2f1AA";


export const getUserInfoFromChain = async (wallet) => {

    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

    const contract = new ethers.Contract(
        MLM_CONTRACT_ADDRESS,
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
