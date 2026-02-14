// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { API_BASE } from "../lib/utils";
import { Link } from "react-router-dom";

import { usePoolWeb3 } from "../context/PoolWeb3Provider";
import { useMLMWeb3 } from "../context/MLMWeb3Provider";
import { formatEther } from "viem";

export default function AdminDashboard() {
    const { token } = useAuth();

    const { withdrawPoolRewards, getAdminPoolBalance } = usePoolWeb3();
    const { withdrawMLMAdminBalance, getAdminMLMBalance } = useMLMWeb3();

    const [rounds, setRounds] = useState([]);
    const [loading, setLoading] = useState(false);

    const [poolAdminBalance, setPoolAdminBalance] = useState("0");
    const [mlmAdminBalance, setMlmAdminBalance] = useState("0");

    const [withdrawingPool, setWithdrawingPool] = useState(false);
    const [withdrawingMLM, setWithdrawingMLM] = useState(false);

    // -----------------------------
    // Fetch Rounds from Backend
    // -----------------------------
    const fetchRounds = async () => {
        try {
            setLoading(true);

            const res = await axios.get(`${API_BASE}/pool/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setRounds(res.data.data || []);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to fetch rounds");
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------
    // Fetch Admin Balances from Contracts
    // -----------------------------
    const fetchAdminBalances = async () => {
        try {
            const poolBalWei = await getAdminPoolBalance();
            const mlmBalWei = await getAdminMLMBalance();

            setPoolAdminBalance(formatEther(poolBalWei));
            setMlmAdminBalance(formatEther(mlmBalWei));
        } catch (err) {
            console.log("fetchAdminBalances error:", err);
        }
    };

    // -----------------------------
    // Withdraw Pool Contract Admin Balance
    // -----------------------------
    const handleWithdrawPool = async () => {
        try {
            setWithdrawingPool(true);

            const res = await withdrawPoolRewards();

            if (res.success) {
                fetchAdminBalances();
            }
        } finally {
            setWithdrawingPool(false);
        }
    };

    // -----------------------------
    // Withdraw MLM Contract Admin Balance
    // -----------------------------
    const handleWithdrawMLM = async () => {
        try {
            setWithdrawingMLM(true);

            const res = await withdrawMLMAdminBalance();

            if (res.success) {
                fetchAdminBalances();
            }
        } finally {
            setWithdrawingMLM(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchRounds();
            fetchAdminBalances();
        }
    }, [token]);

    return (
        <section className="pt-28 pb-20 min-h-screen bg-black text-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* NAVBAR */}
                <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6 flex-wrap gap-4">
                    <div className="flex gap-4 flex-wrap">
                        <Link to="/">
                            <Button variant="outline">← Back to Home</Button>
                        </Link>

                        <Button onClick={fetchRounds} disabled={loading}>
                            {loading ? "Refreshing..." : "Refresh"}
                        </Button>

                        <Button onClick={fetchAdminBalances} variant="outline">
                            Refresh Balances
                        </Button>
                    </div>

                    <div className="flex gap-3 flex-wrap">
                        <Button
                            className="bg-yellow-400 hover:bg-yellow-500 text-black"
                            onClick={handleWithdrawPool}
                            disabled={withdrawingPool}
                        >
                            {withdrawingPool ? "Withdrawing..." : "Withdraw Pool Amount"}
                        </Button>

                        <Button
                            className="bg-yellow-400 hover:bg-yellow-500 text-black"
                            onClick={handleWithdrawMLM}
                            disabled={withdrawingMLM}
                        >
                            {withdrawingMLM ? "Withdrawing..." : "Withdraw MLM Amount"}
                        </Button>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl font-extrabold text-yellow-400">
                        Admin Dashboard
                    </h1>

                    <p className="text-gray-400 mt-3">
                        View pool rounds history and withdraw admin balances.
                    </p>

                    {/* BALANCE CARDS */}
                    <div className="grid md:grid-cols-2 gap-6 mt-10">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <p className="text-gray-400 text-sm">
                                Pool Contract Admin Balance
                            </p>

                            <p className="text-green-400 text-3xl font-bold mt-2">
                                {poolAdminBalance} BNB
                            </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <p className="text-gray-400 text-sm">
                                MLM Contract Admin Balance
                            </p>

                            <p className="text-yellow-400 text-3xl font-bold mt-2">
                                {mlmAdminBalance} BNB
                            </p>
                        </div>
                    </div>

                    {/* ROUNDS TABLE */}
                    <div className="mt-10 overflow-x-auto border border-white/10 rounded-2xl">
                        <table className="w-full text-left">
                            <thead className="bg-white/5">
                                <tr className="text-gray-300 text-sm">
                                    <th className="px-6 py-4">Round ID</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Winner</th>
                                    <th className="px-6 py-4">Winner Amount</th>
                                    <th className="px-6 py-4">Admin Fee</th>
                                    <th className="px-6 py-4">Tx Hash</th>
                                    <th className="px-6 py-4">Created</th>
                                </tr>
                            </thead>

                            <tbody>
                                {rounds.length === 0 && !loading && (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="text-center py-10 text-gray-500"
                                        >
                                            No rounds found.
                                        </td>
                                    </tr>
                                )}

                                {rounds.map((r, idx) => (
                                    <tr
                                        key={idx}
                                        className="border-t border-white/10 hover:bg-white/5 transition"
                                    >
                                        <td className="px-6 py-4 font-bold text-yellow-400">
                                            #{r.roundId}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${r.status === "completed"
                                                    ? "bg-green-500/20 text-green-400"
                                                    : "bg-yellow-500/20 text-yellow-300"
                                                    }`}
                                            >
                                                {r.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-gray-300 break-all">
                                            {r.winner || "-"}
                                        </td>

                                        <td className="px-6 py-4 text-gray-300">
                                            {r.winnerAmount}
                                        </td>

                                        <td className="px-6 py-4 text-gray-300">{r.adminFee}</td>

                                        <td className="px-6 py-4 text-gray-400 break-all text-sm">
                                            {r.txHash ? (
                                                <a
                                                    href={`https://bscscan.com/tx/${r.txHash}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-yellow-400 hover:underline"
                                                >
                                                    {r.txHash.slice(0, 10)}...
                                                    {r.txHash.slice(-6)}
                                                </a>
                                            ) : (
                                                "-"
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {new Date(r.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
