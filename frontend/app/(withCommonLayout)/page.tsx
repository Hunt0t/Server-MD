


import Navbar from "@/components/shared/Navbar/Navbar"
import HeroSection from "@/components/section/HeroSection";
import FeaturesSection from "@/components/section/FeaturesSection";
import HowItWorksSection from "@/components/section/HowItWorksSection";
import Footer from "@/components/shared/Footer/Footer";




const MainPage = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <Footer />
    </div>
  );
}

export default MainPage