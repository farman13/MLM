import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <motion.nav
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-black flex items-center justify-center border border-white/10">
                        <img
                            src="/logo.png"
                            alt="logo"
                            className="w-8 sm:w-10"
                        />
                    </div>

                    <p className="font-bold text-base sm:text-lg tracking-wide">
                        Earning<span className="text-yellow-400">MetaWay</span>
                    </p>
                </div>

                {/* Desktop Links */}
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

                {/* Right Side */}
                <div className="flex items-center gap-3">

                    {/* Connect Button Responsive */}
                    <Button
                        size="sm"
                        className="px-4 sm:px-6 py-2 text-sm sm:text-base rounded-xl sm:rounded-2xl"
                    >
                        Connect
                    </Button>

                    {/* Mobile Menu Icon */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden border-t border-white/10 bg-black/70 backdrop-blur-xl"
                    >
                        <div className="flex flex-col gap-6 px-6 py-6 text-gray-300 font-medium">
                            <a
                                href="#features"
                                onClick={() => setOpen(false)}
                                className="hover:text-yellow-400 transition"
                            >
                                Features
                            </a>

                            <a
                                href="#how"
                                onClick={() => setOpen(false)}
                                className="hover:text-yellow-400 transition"
                            >
                                How It Works
                            </a>

                            <a
                                href="#levels"
                                onClick={() => setOpen(false)}
                                className="hover:text-yellow-400 transition"
                            >
                                Levels
                            </a>

                            <a
                                href="#pool"
                                onClick={() => setOpen(false)}
                                className="hover:text-yellow-400 transition"
                            >
                                Pool
                            </a>

                            <Button className="w-full">Connect Wallet</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
