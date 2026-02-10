import { Card, CardContent } from "./ui/card";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, TrendingUp } from "lucide-react";

export default function Features() {
    const features = [
        {
            title: "Secure & Audited",
            desc: "Smart contract verified on BscScan",
            icon: <ShieldCheck className="text-yellow-400" size={28} />,
        },
        {
            title: "Instant Rewards",
            desc: "Automatic payouts to your wallet",
            icon: <Zap className="text-yellow-400" size={28} />,
        },
        {
            title: "10 Level Matrix",
            desc: "Earn up to $100,000 per upgrade",
            icon: <TrendingUp className="text-yellow-400" size={28} />,
        },
    ];

    return (
        <section id="features" className="py-24">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
                {features.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                    >
                        <Card className="hover:scale-[1.03] transition-all hover:border-yellow-400/40">
                            <CardContent>
                                <div className="w-14 h-14 bg-yellow-400/10 rounded-xl flex items-center justify-center">
                                    {item.icon}
                                </div>

                                <h3 className="mt-6 text-2xl font-bold">{item.title}</h3>
                                <p className="mt-2 text-gray-400">{item.desc}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
