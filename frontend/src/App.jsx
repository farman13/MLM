import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Matrix from "./components/Matrix";
import Register from "./components/Register";
import Levels from "./components/Levels";
import PoolRewards from "./components/PoolRewards";
import Footer from "./components/Footer";
import ReferralTree from "./components/ReferralTree";

export default function App() {
  return (
    <div className="min-h-screen bg-[#070a0f] text-white grid-bg">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      {/* <Matrix /> */}
      <Register />
      <Levels />
      <PoolRewards />
      <ReferralTree />
      <Footer />
    </div>
  );
}
