import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Trophy, Users, DollarSign, RefreshCcw } from "lucide-react";

export default function PoolRewards() {
    const currentUsers = 0;
    const maxUsers = 5;

    return (
        <section id="pool" className="py-28">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <motion.p
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-yellow-400 font-semibold"
                >
                    Automated Bonus System
                </motion.p>

                <motion.h2
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-extrabold mt-4"
                >
                    Pool <span className="text-yellow-400 glow-text">Rewards</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="mt-6 text-gray-400 text-lg max-w-2xl mx-auto"
                >
                    Join the pool with just $5. Winner is selected automatically when pool
                    fills!
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 80 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-16"
                >
                    <Card className="shadow-2xl">
                        <CardContent className="p-12 flex flex-col md:flex-row justify-between gap-10">
                            {/* LEFT */}
                            <div className="flex-1 text-left">
                                <h3 className="text-4xl font-bold">Current Pool</h3>

                                <div className="mt-10 space-y-7 text-gray-300">
                                    <div className="flex items-start gap-3">
                                        <DollarSign className="text-yellow-400 mt-1" size={22} />
                                        <div>
                                            <p className="text-gray-500 text-sm">Entry Fee</p>
                                            <p className="text-white font-bold text-xl">$5</p>
                                            <p className="text-gray-500 text-sm">≈ 0.0077 BNB</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Users className="text-yellow-400 mt-1" size={22} />
                                        <div>
                                            <p className="text-gray-500 text-sm">Pool Size</p>
                                            <p className="text-white font-bold text-xl">5 Users</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Trophy className="text-yellow-400 mt-1" size={22} />
                                        <div>
                                            <p className="text-gray-500 text-sm">Winner Reward</p>
                                            <p className="text-yellow-400 font-bold text-xl">
                                                $25
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                                Full reward shown · 10% fee taken on-chain
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <RefreshCcw className="text-yellow-400 mt-1" size={22} />
                                        <div>
                                            <p className="text-gray-500 text-sm">Last Winner</p>
                                            <p className="text-white font-bold text-xl">
                                                No winner yet
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Button size="lg" className="w-full mt-12">
                                    Connect Wallet to Join - $5
                                </Button>

                                <p className="text-center text-gray-500 text-sm mt-3">
                                    ≈ 0.0077 BNB
                                </p>
                            </div>

                            {/* RIGHT */}
                            <div className="flex-1 flex flex-col items-center justify-center">
                                <div className="relative w-52 h-52 rounded-full border-[14px] border-white/10 flex items-center justify-center">
                                    <p className="text-yellow-400 font-extrabold text-5xl glow-text">
                                        {currentUsers}/{maxUsers}
                                    </p>
                                    <p className="absolute bottom-12 text-gray-500 text-sm">
                                        Users
                                    </p>

                                    <div className="absolute top-4 w-4 h-4 bg-yellow-400 rounded-full shadow-lg"></div>
                                </div>

                                <p className="mt-6 text-gray-500 text-sm">
                                    Pool resets automatically when complete
                                </p>

                                <div className="mt-4 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 px-6 py-3 rounded-xl text-sm">
                                    🏆 Winner is selected & paid automatically!
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}
