import { createContext, useContext } from "react";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { toast } from "react-toastify";

import { poolABI, poolContractAddress } from "../lib/poolContractConfig";

const PoolWeb3Context = createContext(null);
export const usePoolWeb3 = () => useContext(PoolWeb3Context);

export function PoolWeb3Provider({ children }) {
    const { address, isConnected } = useAccount();
    const publicClient = usePublicClient();
    const { writeContractAsync } = useWriteContract();

    // ------------------------
    // Join Pool
    // ------------------------
    const joinPool = async (entryFeeWei) => {
        try {
            if (!isConnected) {
                toast.error("⚠ Please connect wallet");
                return { success: false };
            }

            toast.info("⏳ Joining pool...");

            const hash = await writeContractAsync({
                address: poolContractAddress,
                abi: poolABI,
                functionName: "joinPool",
                args: [],
                value: entryFeeWei,
            });

            await publicClient.waitForTransactionReceipt({ hash });

            toast.success("✅ Joined Pool Successfully!");
            return { success: true, hash };
        } catch (err) {
            const msg = err.shortMessage || err.message || "Transaction failed";
            toast.error(`❌ ${msg}`);
            return { success: false };
        }
    };

    // ------------------------
    // Withdraw Pool Balance
    // ------------------------
    const withdrawPoolRewards = async () => {
        try {
            if (!isConnected) {
                toast.error("⚠ Please connect wallet");
                return { success: false };
            }

            toast.info("⏳ Withdrawing pool reward...");

            const hash = await writeContractAsync({
                address: poolContractAddress,
                abi: poolABI,
                functionName: "withdraw",
                args: [],
            });

            await publicClient.waitForTransactionReceipt({ hash });

            toast.success("✅ Pool Withdraw successful!");
            return { success: true, hash };
        } catch (err) {
            const msg = err.shortMessage || err.message || "Withdraw failed";
            toast.error(`❌ ${msg}`);
            return { success: false };
        }
    };

    // ------------------------
    // Read Pool Length
    // ------------------------
    const getPoolLength = async () => {
        try {
            return await publicClient.readContract({
                address: poolContractAddress,
                abi: poolABI,
                functionName: "poolLength",
                args: [],
            });
        } catch (err) {
            return 0;
        }
    };

    // ------------------------
    // Read Entry Fee
    // ------------------------
    const getEntryFee = async () => {
        try {
            return await publicClient.readContract({
                address: poolContractAddress,
                abi: poolABI,
                functionName: "entryFee",
                args: [],
            });
        } catch (err) {
            return 0n;
        }
    };

    // ------------------------
    // Read User Pool Balance
    // ------------------------
    const getUserPoolBalance = async (userAddress) => {
        try {
            return await publicClient.readContract({
                address: poolContractAddress,
                abi: poolABI,
                functionName: "balances",
                args: [userAddress],
            });
        } catch (err) {
            return 0n;
        }
    };

    // ------------------------
    // Get Pool Owner
    // ------------------------
    const getPoolOwner = async () => {
        try {
            return await publicClient.readContract({
                address: poolContractAddress,
                abi: poolABI,
                functionName: "owner",
                args: [],
            });
        } catch (err) {
            return null;
        }
    };

    // ------------------------
    // Get Admin Pool Balance
    // ------------------------
    const getAdminPoolBalance = async () => {
        try {
            const owner = await getPoolOwner();
            if (!owner) return 0n;

            return await publicClient.readContract({
                address: poolContractAddress,
                abi: poolABI,
                functionName: "balances",
                args: [owner],
            });
        } catch (err) {
            return 0n;
        }
    };

    return (
        <PoolWeb3Context.Provider
            value={{
                address,
                isConnected,
                joinPool,
                withdrawPoolRewards,
                getPoolLength,
                getEntryFee,
                getUserPoolBalance,
                getAdminPoolBalance,
            }}
        >
            {children}
        </PoolWeb3Context.Provider>
    );
}
