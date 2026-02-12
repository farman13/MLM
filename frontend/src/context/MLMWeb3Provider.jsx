import { createContext, useContext } from "react";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { toast } from "react-toastify";

import { mlmABI, mlmContractAddress } from "../lib/mlmContractConfig";

const MLMWeb3Context = createContext(null);

export const useMLMWeb3 = () => useContext(MLMWeb3Context);

export function MLMWeb3Provider({ children }) {
    const { address, isConnected } = useAccount();
    const publicClient = usePublicClient();
    const { writeContractAsync } = useWriteContract();

    // ------------------------
    // Register User (Payable)
    // ------------------------
    const registerUserOnChain = async (referrerAddress, amountWei) => {
        try {
            if (!isConnected) {
                toast.error("⚠ Please connect wallet");
                return { success: false };
            }

            toast.info("⏳ Confirm transaction in wallet...");
            console.log("Registering with referrer:", referrerAddress, "Amount (wei):", amountWei);
            const hash = await writeContractAsync({
                address: mlmContractAddress,
                abi: mlmABI,
                functionName: "register",
                args: [referrerAddress],
                value: amountWei, // payable
            });

            toast.info("⏳ Waiting for transaction confirmation...");

            const receipt = await publicClient.waitForTransactionReceipt({ hash });

            if (!receipt || receipt.status !== "success") {
                toast.error("❌ Transaction failed");
                return { success: false };
            }

            toast.success("✅ Registration transaction confirmed!");
            return { success: true, hash };
        } catch (err) {
            const msg = err.shortMessage || err.message || "Transaction failed";
            toast.error(`❌ ${msg}`);
            return { success: false };
        }
    };

    return (
        <MLMWeb3Context.Provider
            value={{
                address,
                isConnected,
                registerUserOnChain,
            }}
        >
            {children}
        </MLMWeb3Context.Provider>
    );
}
