// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { API_BASE } from "../lib/utils";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
    const { token } = useAuth();

    const [rounds, setRounds] = useState([]);
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        if (token) fetchRounds();
    }, [token]);

    return (
        <section className="pt-28 pb-20 min-h-screen bg-black text-white">
            <div className="max-w-7xl mx-auto px-6">

                {/* NAVBAR */}
                <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">

                    <div className="flex gap-4">
                        <Link to="/">
                            <Button variant="outline">← Back to Home</Button>
                        </Link>

                        <Button onClick={fetchRounds} disabled={loading}>
                            {loading ? "Refreshing..." : "Refresh"}
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
                        View pool rounds history and winner details.
                    </p>

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
                                        <td colSpan="7" className="text-center py-10 text-gray-500">
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
                                                    {r.txHash.slice(0, 10)}...{r.txHash.slice(-6)}
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
