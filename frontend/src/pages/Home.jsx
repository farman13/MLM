import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Register from "../components/Register";
import Levels from "../components/Levels";
import PoolRewards from "../components/PoolRewards";
import ReferralTree from "../components/ReferralTree";
import Footer from "../components/Footer";
import useBnbPrice from "../hooks/useBnbPrice";

export default function Home() {

    const { bnbPrice, loadingPrice } = useBnbPrice();
    return (
        <div className="min-h-screen bg-[#070a0f] text-white grid-bg">
            <ToastContainer position="top-right" autoClose={2500} />
            <Navbar />
            <Hero bnbPrice={bnbPrice} loadingPrice={loadingPrice} />
            <Features />
            <HowItWorks />
            {/* <Matrix /> */}
            <Register bnbPrice={bnbPrice} loadingPrice={loadingPrice} />
            <Levels bnbPrice={bnbPrice} loadingPrice={loadingPrice} />
            <PoolRewards />
            <ReferralTree />
            <Footer />
        </div>
    );
}
