import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Wallet } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Register() {

    return (
        <section className="py-28">
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

                            <div className="mt-12">
                                <label className="text-gray-400 text-sm font-medium">
                                    Referrer Address
                                </label>

                                <input
                                    className="w-full mt-3 bg-black/30 border border-white/10 rounded-xl px-5 py-4 text-gray-200 outline-none focus:border-yellow-400/40 transition"
                                    placeholder="0x... (leave empty for default referrer)"
                                />

                                <p className="mt-2 text-xs text-gray-500">
                                    If no referral is provided, system will assign default
                                    referrer.
                                </p>
                            </div>

                            <div className="mt-12 flex justify-between items-center border-t border-white/10 pt-8">
                                <div>
                                    <p className="text-gray-400 font-medium">Registration Fee</p>
                                    <p className="text-gray-500 text-sm mt-1">≈ 0.0232 BNB</p>
                                </div>

                                <p className="text-yellow-400 font-extrabold text-4xl glow-text">
                                    $15
                                </p>
                            </div>

                            <div className="mt-10">
                                <ConnectButton.Custom>
                                    {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
                                        const ready = mounted;
                                        const connected = ready && account && chain;

                                        return (
                                            <div
                                                {...(!ready && {
                                                    "aria-hidden": true,
                                                    style: { opacity: 0, pointerEvents: "none", userSelect: "none" },
                                                })}
                                            >
                                                {!connected ? (
                                                    <Button size="lg" className="w-full flex gap-2" onClick={openConnectModal}>
                                                        <Wallet size={22} />
                                                        Connect Wallet to Register
                                                    </Button>
                                                ) : (
                                                    <div className="flex gap-3 flex-wrap justify-center">
                                                        <Button size="lg" className="w-full flex gap-2" >
                                                            Register Now
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
        </section>
    );
}
