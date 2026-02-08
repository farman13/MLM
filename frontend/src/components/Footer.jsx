import logo from "../assets/logo.png";

export default function Footer() {
    return (
        <footer className="py-12 border-t border-white/10 bg-black/30 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-3">
                    <img
                        src={logo}
                        alt="logo"
                        className="w-10"
                    />
                    <p className="font-bold text-lg">
                        Earning<span className="text-yellow-400">MetaWay</span>
                    </p>
                </div>

                <p className="text-gray-500 text-sm text-center">
                    © {new Date().getFullYear()} EarnBNB. All Rights Reserved.
                </p>

                <div className="flex gap-6 text-gray-400 text-sm">
                    <a href="#features" className="hover:text-yellow-400 transition">
                        Features
                    </a>
                    <a href="#how" className="hover:text-yellow-400 transition">
                        How It Works
                    </a>
                    <a href="#levels" className="hover:text-yellow-400 transition">
                        Levels
                    </a>
                    <a href="#pool" className="hover:text-yellow-400 transition">
                        Pool
                    </a>
                </div>
            </div>
        </footer>
    );
}
