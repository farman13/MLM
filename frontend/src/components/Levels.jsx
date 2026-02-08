import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Lock, Crown } from "lucide-react";
import { Button } from "./ui/button";

export default function Levels() {
    const levels = [
        { level: 1, cost: 15, earn: null },
        { level: 2, cost: 20, earn: 40 },
        { level: 3, cost: 40, earn: 80 },
        { level: 4, cost: 100, earn: 140 },
        { level: 5, cost: 200, earn: 400 },
        { level: 6, cost: 400, earn: 800 },
        { level: 7, cost: 800, earn: 1600 },
        { level: 8, cost: 1800, earn: 3000 },
        { level: 9, cost: 3000, earn: 7800 },
        { level: 10, cost: 5000, earn: 13000 },
        { level: 11, cost: 8000, earn: 22000 },
        { level: 12, cost: 13000, earn: 35000 },
        { level: 13, cost: 25000, earn: 53000 },
        { level: 14, cost: 50000, earn: 100000 },
    ];

    return (
        <section id="levels" className="py-28 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1c1c1c,#070a0f)] opacity-70"></div>

            <div className="relative max-w-7xl mx-auto px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center text-5xl md:text-6xl font-extrabold"
                >
                    Levels <span className="text-yellow-400 glow-text">Matrix</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-center text-gray-400 mt-4 max-w-3xl mx-auto"
                >
                    Upgrade through all 14 levels. Each upgrade pays rewards instantly on
                    chain.
                </motion.p>

                <div className="mt-16 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7">
                    {levels.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.05 }}
                        >
                            <Card
                                className={`hover:scale-[1.03] transition-all ${item.level === 14
                                        ? "border-yellow-400/40 shadow-yellow-400/20"
                                        : "border-white/10"
                                    }`}
                            >
                                <CardContent className="p-7">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-bold">
                                            Level{" "}
                                            <span className="text-yellow-400">{item.level}</span>
                                        </h3>

                                        {item.level === 14 ? (
                                            <Crown className="text-yellow-400" size={22} />
                                        ) : (
                                            <Lock className="text-gray-500" size={20} />
                                        )}
                                    </div>

                                    <p className="text-gray-500 mt-2 text-sm">
                                        👥 6 referrals to complete
                                    </p>

                                    <div className="mt-6">
                                        <p className="text-gray-400 text-sm">Level Cost</p>
                                        <p className="text-yellow-400 text-3xl font-extrabold glow-text">
                                            ${item.cost.toLocaleString()}
                                        </p>
                                        <p className="text-gray-500 text-sm">≈ ... BNB</p>
                                    </div>

                                    {item.earn && (
                                        <div className="mt-6 bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
                                            <p className="text-green-400 font-semibold text-sm">
                                                → Upgrade earns ${item.earn.toLocaleString()}
                                            </p>
                                            <p className="text-gray-500 text-xs mt-2">
                                                Paid instantly · 10% fee taken on-chain
                                            </p>
                                        </div>
                                    )}

                                    <Button
                                        variant="ghost"
                                        className="w-full mt-6 bg-white/5 hover:bg-white/10 text-gray-500 cursor-not-allowed"
                                    >
                                        Locked
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
