import { motion } from "framer-motion";
import { Button } from "./ui/button";
import logo from "../assets/logo.png";

export default function Navbar() {
    return (
        <motion.nav
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl"
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center border border-white/10">
                        <img
                            src={logo}
                            alt="logo"
                            className="w-10"
                        />
                    </div>
                    <p className="font-bold text-lg tracking-wide">
                        Earning<span className="text-yellow-400">MetaWay</span>
                    </p>
                </div>

                <div className="hidden md:flex gap-10 text-gray-400 font-medium">
                    <a href="#features" className="hover:text-white transition">
                        Features
                    </a>
                    <a href="#how" className="hover:text-white transition">
                        How It Works
                    </a>
                    <a href="#levels" className="hover:text-white transition">
                        Levels
                    </a>
                    <a href="#pool" className="hover:text-white transition">
                        Pool
                    </a>
                </div>

                <Button size="lg">Connect Wallet</Button>
            </div>
        </motion.nav>
    );
}
