import { ethers } from "ethers";
import { PoolRound } from "../models/pool.model.js";
import { poolABI } from "../utils/poolContractConfig.js";

export const startPoolListener = async () => {
    try {
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

        const contract = new ethers.Contract(
            process.env.POOL_CONTRACT_ADDRESS,
            poolABI,
            provider
        );

        console.log("🚀 Pool Listener Started...");
        console.log("📌 Contract:", process.env.POOL_CONTRACT_ADDRESS);

        // ----------------------------
        // JOINED EVENT
        // ----------------------------
        contract.on("Joined", async (user, roundId) => {
            try {
                console.log(`👤 Joined: ${user} | Round: ${roundId}`);

                await PoolRound.findOneAndUpdate(
                    { roundId: Number(roundId) },
                    {
                        $setOnInsert: {
                            roundId: Number(roundId),
                            status: "active",
                        },
                    },
                    { upsert: true, new: true }
                );
            } catch (err) {
                console.log("❌ Joined event DB error:", err.message);
            }
        });

        // ----------------------------
        // WINNER SELECTED EVENT
        // ----------------------------
        contract.on(
            "WinnerSelected",
            async (winner, winnerAmount, adminFee, roundId, event) => {
                try {
                    console.log(`🏆 Winner: ${winner} | Round: ${roundId}`);

                    await PoolRound.findOneAndUpdate(
                        { roundId: Number(roundId) },
                        {
                            $set: {
                                winner: winner.toLowerCase(),
                                winnerAmount: winnerAmount.toString(),
                                adminFee: adminFee.toString(),
                                txHash: event.log.transactionHash,
                                status: "completed",
                            },
                        },
                        { upsert: true, new: true }
                    );
                } catch (err) {
                    console.log("❌ WinnerSelected DB error:", err.message);
                }
            }
        );
    } catch (err) {
        console.log("❌ Listener startup failed:", err.message);
    }
};
