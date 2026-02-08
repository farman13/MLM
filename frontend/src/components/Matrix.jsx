import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { BadgeCheck } from "lucide-react";

export default function Matrix() {
    return (
        <section className="py-28 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a1a1a,#070a0f)] opacity-80"></div>

            <div className="relative max-w-6xl mx-auto px-6 text-center">
                <motion.p
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-yellow-400 font-semibold"
                >
                    Automated Matrix System
                </motion.p>

                <motion.h2
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-extrabold mt-4"
                >
                    6×6 <span className="text-yellow-400 glow-text">Matrix</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="mt-6 text-gray-400 text-lg max-w-3xl mx-auto"
                >
                    Complete 6 referrals per level to automatically upgrade. Rewards are
                    distributed instantly!
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-12"
                >
                    <Card className="max-w-4xl mx-auto border-yellow-400/20">
                        <CardContent className="text-left">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-yellow-400/10 flex items-center justify-center">
                                    <BadgeCheck className="text-yellow-400" size={28} />
                                </div>

                                <p className="text-gray-300 leading-relaxed">
                                    <span className="text-yellow-400 font-bold">
                                        Auto-Upgrade System:
                                    </span>{" "}
                                    Levels upgrade automatically when you complete 6 referrals. No
                                    manual upgrade needed! Direct referral rewards are paid
                                    instantly to your referrer.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-14"
                >
                    <Card className="max-w-4xl mx-auto border-white/10">
                        <CardContent className="text-center py-12">
                            <h3 className="text-yellow-400 font-bold text-3xl">
                                Register Now
                            </h3>
                            <p className="text-gray-400 mt-2">
                                Start earning instantly through the automated matrix.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}
