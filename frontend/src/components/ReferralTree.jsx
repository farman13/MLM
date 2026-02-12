import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import { API_BASE } from "../lib/utils";

// ---------------- MOBILE TREE (Vertical Indent) ----------------
function MobileTreeNode({ node }) {
    return (
        <div className="ml-4 mt-4 border-l border-yellow-400/30 pl-4">
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 w-fit">
                <p className="text-yellow-400 font-bold text-base">{node.username}</p>

                <p className="text-gray-400 text-xs break-all mt-1">
                    Wallet:{" "}
                    <span className="text-gray-300 font-medium">{node.walletAddress}</span>
                </p>

                <p className="text-gray-500 text-xs mt-1">
                    Level: <span className="text-white">{node.level}</span> | Direct:{" "}
                    <span className="text-white">{node.directReferralCount}</span>
                </p>
            </div>

            {node.referrals && node.referrals.length > 0 && (
                <div className="mt-3">
                    {node.referrals.map((child, idx) => (
                        <MobileTreeNode key={idx} node={child} />
                    ))}
                </div>
            )}
        </div>
    );
}

// ---------------- DESKTOP TREE (Hierarchy Diagram) ----------------
function DesktopTreeNode({ node }) {
    return (
        <div className="flex flex-col items-center mt-8">
            <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 shadow-lg w-[260px] text-center">
                <p className="text-yellow-400 font-bold text-lg">{node.username}</p>

                <p className="text-gray-400 text-sm mt-1 break-all">
                    Wallet:{" "}
                    <span className="text-gray-300 font-medium">
                        {node.walletAddress.substring(0, 6)}...
                        {node.walletAddress.substring(node.walletAddress.length - 4)}
                    </span>
                </p>

                <p className="text-gray-500 text-sm mt-1">
                    Level: <span className="text-white">{node.level}</span> | Direct:{" "}
                    <span className="text-white">{node.directReferralCount}</span>
                </p>
            </div>

            {node.referrals && node.referrals.length > 0 && (
                <>
                    <div className="w-[2px] h-10 bg-yellow-400/40"></div>

                    <div className="relative flex gap-12 flex-wrap justify-center items-start w-full">
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-yellow-400/30"></div>

                        {node.referrals.map((child, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                                <div className="w-[2px] h-10 bg-yellow-400/40"></div>
                                <DesktopTreeNode node={child} />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default function ReferralTree() {
    const { token } = useAuth();

    const [tree, setTree] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // -----------------------------
    // Decode JWT to get username
    // -----------------------------
    const getUsernameFromToken = () => {
        try {
            if (!token) return null;
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.username || null;
        } catch (err) {
            return null;
        }
    };

    // -----------------------------
    // Fetch Tree (Backend already enriches from contract)
    // -----------------------------
    const fetchTree = async () => {
        try {
            const username = getUsernameFromToken();

            if (!username) {
                setError("Username not found in token. Please register first.");
                return;
            }

            setLoading(true);
            setError("");

            const res = await axios.get(`${API_BASE}/users/tree/${username}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setTree(res.data?.data || null);
            console.log("Referral Tree:", res.data?.data);
        } catch (err) {
            setTree(null);
            setError(err.response?.data?.message || "Failed to fetch referral tree");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchTree();
    }, [token]);

    // ✅ only show if token exists
    if (!token) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-white">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-yellow-400 mb-6 sm:mb-8">
                Your Referral Tree
            </h1>

            {/* Loading */}
            {loading && <p className="text-gray-400 text-sm">Loading tree...</p>}

            {/* Error */}
            {error && <p className="text-red-500 font-semibold text-sm">{error}</p>}

            {/* Tree Display */}
            {tree && (
                <>
                    {/* MOBILE VIEW */}
                    <div className="block md:hidden mt-8">
                        <MobileTreeNode node={tree} />
                    </div>

                    {/* DESKTOP VIEW */}
                    <div className="hidden md:block mt-6 overflow-x-auto pb-20">
                        <DesktopTreeNode node={tree} />
                    </div>
                </>
            )}
        </div>
    );
}
