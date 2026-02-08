import { motion } from "framer-motion";
import { Button } from "./ui/button";
import logo from "../assets/logo.png";

export default function Hero() {
    return (
        <section className="pt-36 pb-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1b1b1b,#070a0f)] opacity-90"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative max-w-7xl mx-auto px-6 text-center"
            >
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-2 rounded-full text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Live BNB Price: $646.32
                </div>

                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="mt-12 flex justify-center"
                >
                    <img
                        src={logo}
                        alt="logo"
                        className="w-44 rounded-2xl shadow-2xl border border-white/10"
                    />
                </motion.div>

                <motion.h1
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="mt-12 text-5xl md:text-7xl font-extrabold leading-tight"
                >
                    Smart Earning on <br />
                    <span className="text-yellow-400 glow-text">BNB Smart Chain</span>
                </motion.h1>

                <motion.p
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="mt-6 text-gray-400 text-lg max-w-2xl mx-auto"
                >
                    Earn through smart matrix and pool rewards on BNB Smart Chain.
                    Transparent, secure, and decentralized.
                </motion.p>

                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="mt-10 flex justify-center gap-6 flex-wrap"
                >
                    <Button size="lg">Connect Wallet →</Button>
                    <a href="#how">
                        <Button variant="outline" size="lg" >
                            Learn More
                        </Button>
                    </a>
                </motion.div>
            </motion.div>
        </section>
    );
}
