import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Wallet, User, Copy } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthProvider";
import { useMLMWeb3 } from "../context/MLMWeb3Provider";
import { ethers } from "ethers";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "./ui/dialog";

import { API_BASE } from "../lib/utils";
import useUserInfo from "../hooks/useUserInfo";

export default function Register({ bnbPrice, loadingPrice }) {
    const { address, isConnected } = useAccount();

    const { token, authLoading, setAuthToken } = useAuth();
    const { registerUserOnChain } = useMLMWeb3();
    const { refetchUserInfo } = useUserInfo(address);

    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [referrer, setReferrer] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ referral validation states
    const [refCheckLoading, setRefCheckLoading] = useState(false);
    const [isRefValid, setIsRefValid] = useState(true);
    const [refError, setRefError] = useState("");

    const REGISTRATION_FEE_USD = 15;

    // -----------------------------
    // COPY REFERRAL CODE
    // -----------------------------
    const copyReferralCode = async () => {
        try {
            if (!address) return;
            await navigator.clipboard.writeText(address);
            toast.success("✅ Referral code copied");
        } catch (err) {
            toast.error("❌ Failed to copy");
        }
    };

    // -----------------------------
    // LIVE REFERRER VALIDATION
    // -----------------------------
    useEffect(() => {
        if (!referrer.trim()) {
            setIsRefValid(true);
            setRefError("");
            return;
        }

        if (!ethers.isAddress(referrer.trim())) {
            setIsRefValid(false);
            setRefError("Invalid wallet format");
            return;
        }

        if (address && referrer.trim().toLowerCase() === address.toLowerCase()) {
            setIsRefValid(false);
            setRefError("You cannot refer yourself");
            return;
        }

        const timer = setTimeout(async () => {
            try {
                setRefCheckLoading(true);
                setRefError("");

                const res = await axios.get(
                    `${API_BASE}/users/validate-referrer/${referrer.trim()}`
                );

                if (res.data?.data?.valid) {
                    setIsRefValid(true);
                    setRefError("");
                } else {
                    setIsRefValid(false);
                    setRefError("Referral code not found");
                }
            } catch (err) {
                setIsRefValid(false);
                setRefError(err.response?.data?.message || "Referral check failed");
            } finally {
                setRefCheckLoading(false);
            }
        }, 700);

        return () => clearTimeout(timer);
    }, [referrer, address]);

    // -----------------------------
    // Register (Contract + Backend)
    // -----------------------------
    const handleRegisterSubmit = async () => {
        try {
            if (!isConnected || !address) {
                toast.error("⚠ Please connect wallet first");
                return;
            }

            if (!username.trim()) {
                toast.error("⚠ Username is required");
                return;
            }

            if (!bnbPrice) {
                toast.error("⚠ BNB price not loaded yet");
                return;
            }

            if (!isRefValid) {
                toast.error("❌ Invalid referral code");
                return;
            }

            setLoading(true);

            const bnbAmount = REGISTRATION_FEE_USD / Number(bnbPrice);
            const amountWei = ethers.parseEther(bnbAmount.toFixed(18));

            const referrerWallet = referrer.trim()
                ? referrer.trim()
                : "0x0000000000000000000000000000000000000000";

            // 1️⃣ Contract tx
            const txRes = await registerUserOnChain(referrerWallet, amountWei);

            if (!txRes.success) {
                setLoading(false);
                return;
            }

            // 2️⃣ Save into DB after tx success
            const payload = {
                walletAddress: address,
                username: username.trim(),
                referredByAddress: referrer.trim() ? referrer.trim() : null,
                txHash: txRes.hash,
            };

            const res = await axios.post(`${API_BASE}/users/register`, payload);

            // 3️⃣ Save token
            const jwtToken = res.data?.data?.token;

            if (jwtToken) {
                setAuthToken(jwtToken);
                toast.success("✅ Registered Successfully!");
            } else {
                toast.success(res.data.message || "✅ Registered successfully!");
            }

            await refetchUserInfo();
            setOpen(false);
            setUsername("");
            setReferrer("");
        } catch (err) {
            const msg =
                err.response?.data?.message || err.message || "Registration failed";
            toast.error(`❌ ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-28">
            {/* =====================================================
          ✅ IF TOKEN EXISTS → SHOW REFERRAL UI
      ====================================================== */}
            {token ? (
                <div className="max-w-5xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 80 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <Card className="border-yellow-400/10 shadow-2xl">
                            <CardContent className="p-10 md:p-14 text-center">
                                <h2 className="text-yellow-400 font-bold text-4xl md:text-5xl">
                                    Your Referral Code
                                </h2>

                                <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
                                    Share your referral code and earn{" "}
                                    <span className="text-yellow-400 font-bold">$5</span> on every
                                    successful referral.
                                </p>

                                <div className="mt-10 bg-black/40 border border-white/10 rounded-2xl px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
                                    <p className="text-gray-200 break-all text-sm md:text-base">
                                        {address}
                                    </p>

                                    <Button className="flex gap-2" onClick={copyReferralCode}>
                                        <Copy size={18} />
                                        Copy
                                    </Button>
                                </div>

                                <p className="text-gray-500 text-sm mt-6">
                                    Invite more users to grow your network and increase rewards.
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            ) : (
                /* =====================================================
                      ❌ IF NO TOKEN → SHOW REGISTER FORM
                ====================================================== */
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 80 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <Card className="border-yellow-400/10 shadow-2xl">
                            <CardContent className="p-10 md:p-14">
                                <h2 className="text-center text-yellow-400 font-bold text-4xl md:text-5xl">
                                    Register Now
                                </h2>

                                <p className="text-center text-gray-400 mt-3">
                                    Enter referrer address (optional) and connect wallet to register.
                                </p>

                                {/* Referrer Input */}
                                <div className="mt-12">
                                    <label className="text-gray-400 text-sm font-medium">
                                        Referrer Address (optional)
                                    </label>

                                    <input
                                        value={referrer}
                                        onChange={(e) => setReferrer(e.target.value)}
                                        className="w-full mt-3 bg-black/30 border border-white/10 rounded-xl px-5 py-4 text-gray-200 outline-none focus:border-yellow-400/40 transition"
                                        placeholder="0x... (leave empty for default referrer)"
                                    />

                                    {/* validation message */}
                                    {referrer.trim() ? (
                                        <p className="mt-2 text-xs">
                                            {refCheckLoading ? (
                                                <span className="text-gray-400">Checking referral...</span>
                                            ) : isRefValid ? (
                                                <span className="text-green-400">✅ Valid referral</span>
                                            ) : (
                                                <span className="text-red-400">❌ {refError}</span>
                                            )}
                                        </p>
                                    ) : (
                                        <p className="mt-2 text-xs text-gray-500">
                                            If no referral is provided, system will assign default referrer.
                                        </p>
                                    )}
                                </div>

                                {/* Fee Section */}
                                <div className="mt-12 flex justify-between items-center border-t border-white/10 pt-8">
                                    <div>
                                        <p className="text-gray-400 font-medium">Registration Fee</p>

                                        <p className="text-gray-500 text-sm mt-1">
                                            ≈{" "}
                                            {loadingPrice || !bnbPrice
                                                ? "Loading..."
                                                : (REGISTRATION_FEE_USD / Number(bnbPrice)).toFixed(6)}{" "}
                                            BNB
                                        </p>
                                    </div>

                                    <p className="text-yellow-400 font-extrabold text-4xl glow-text">
                                        $15
                                    </p>
                                </div>

                                {/* Connect / Register */}
                                <div className="mt-10">
                                    <ConnectButton.Custom>
                                        {({
                                            account,
                                            chain,
                                            openAccountModal,
                                            openConnectModal,
                                            mounted,
                                        }) => {
                                            const ready = mounted;
                                            const connected = ready && account && chain;

                                            return (
                                                <div
                                                    {...(!ready && {
                                                        "aria-hidden": true,
                                                        style: {
                                                            opacity: 0,
                                                            pointerEvents: "none",
                                                            userSelect: "none",
                                                        },
                                                    })}
                                                >
                                                    {!connected ? (
                                                        <Button
                                                            size="lg"
                                                            className="w-full flex gap-2"
                                                            onClick={openConnectModal}
                                                        >
                                                            <Wallet size={22} />
                                                            Connect Wallet to Register
                                                        </Button>
                                                    ) : (
                                                        <div className="flex flex-col gap-4">
                                                            <Button
                                                                size="lg"
                                                                className="w-full flex gap-2"
                                                                onClick={() => setOpen(true)}
                                                                disabled={authLoading || refCheckLoading || !isRefValid}
                                                            >
                                                                {authLoading
                                                                    ? "Signing..."
                                                                    : refCheckLoading
                                                                        ? "Checking referral..."
                                                                        : "Register Now"}
                                                            </Button>

                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="w-full text-gray-400"
                                                                onClick={openAccountModal}
                                                            >
                                                                Connected: {account.address.slice(0, 6)}...
                                                                {account.address.slice(-4)}
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }}
                                    </ConnectButton.Custom>

                                    <p className="text-center text-gray-500 text-sm mt-3">
                                        Smart contract handles everything automatically.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            )}

            {/* ---------------- MODAL ---------------- */}
            {/* ✅ YOUR ORIGINAL MODAL UI (UNCHANGED) */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-black/95 border border-white/10 text-white rounded-2xl shadow-2xl max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-extrabold text-yellow-400">
                            Complete Registration
                        </DialogTitle>

                        <DialogDescription className="text-gray-400">
                            Choose your username and confirm registration payment.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Username Input */}
                    <div className="mt-6">
                        <label className="text-gray-300 text-sm font-medium">Username</label>

                        <div className="flex items-center gap-3 mt-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                            <User className="text-yellow-400" size={18} />
                            <input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                className="bg-transparent w-full outline-none text-gray-200"
                            />
                        </div>

                        <p className="text-xs text-gray-500 mt-2">
                            Username must be unique and will be used to display your referral tree.
                        </p>
                    </div>

                    {/* Referrer Preview */}
                    <div className="mt-6 bg-yellow-400/10 border border-yellow-400/20 rounded-xl px-5 py-4">
                        <p className="text-yellow-400 font-semibold text-sm">
                            Referral Wallet
                        </p>
                        <p className="text-gray-300 text-sm break-all mt-1">
                            {referrer ? referrer : "Default Referrer"}
                        </p>
                    </div>

                    {/* Fee */}
                    <div className="mt-6 flex justify-between items-center border-t border-white/10 pt-5">
                        <p className="text-gray-400 font-medium">Registration Fee</p>
                        <p className="text-yellow-400 font-extrabold text-xl">$15</p>
                    </div>

                    {/* Buttons */}
                    <div className="mt-8 flex gap-4">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>

                        <Button
                            className="w-full"
                            onClick={handleRegisterSubmit}
                            disabled={loading || loadingPrice || !bnbPrice || !isRefValid}
                        >
                            {loading ? "Processing..." : "Confirm & Register"}
                        </Button>
                    </div>

                    <p className="text-center text-xs text-gray-500 mt-4">
                        Transaction must confirm before registration is saved.
                    </p>
                </DialogContent>
            </Dialog>
        </section>
    );
}
