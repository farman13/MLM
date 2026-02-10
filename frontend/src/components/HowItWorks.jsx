export default function HowItWorks() {
    const steps = [
        {
            num: "1",
            title: "Connect Wallet",
            desc: "Connect your MetaMask, Trust Wallet, or any WalletConnect compatible wallet.",
            icon: "👛",
        },
        {
            num: "2",
            title: "Register",
            desc: "Pay the entry fee of $15 (in BNB) to join the matrix system.",
            icon: "👤",
        },
        {
            num: "3",
            title: "Upgrade Levels",
            desc: "Progress through 10 levels, earning rewards with each upgrade.",
            icon: "⬆️",
        },
        {
            num: "4",
            title: "Earn Rewards",
            desc: "Receive instant payouts directly to your wallet. 90% rewards, 10% platform fee.",
            icon: "🎁",
        },
    ];

    return (
        <section id="how" className="py-24">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <p className="text-yellow-400 font-semibold">Simple Process</p>

                <h2 className="text-5xl md:text-6xl font-extrabold mt-4">
                    How It <span className="text-yellow-400">Works</span>
                </h2>

                <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                    Get started in minutes. Our smart contract handles everything
                    automatically.
                </p>

                <div className="mt-16 grid md:grid-cols-4 gap-8">
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            className="bg-white/5 border border-white/10 rounded-3xl p-8 text-left relative"
                        >
                            <div className="absolute -top-5 -left-5 w-10 h-10 bg-yellow-400 text-black font-bold rounded-full flex items-center justify-center">
                                {step.num}
                            </div>

                            <div className="w-14 h-14 bg-yellow-400/10 rounded-xl flex items-center justify-center text-2xl">
                                {step.icon}
                            </div>

                            <h3 className="mt-6 text-2xl font-bold">{step.title}</h3>
                            <p className="mt-3 text-gray-400">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
