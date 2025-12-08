import { useState, useEffect } from "react";
import { WelcomeModal } from "@/components/WelcomeModal";
import { HeroSection } from "@/components/HeroSection";
import { FreeGiftsSection } from "@/components/FreeGiftsSection";
import { ServicesSection } from "@/components/ServicesSection";
import { PricingSection } from "@/components/PricingSection";
import { PortfolioSection } from "@/components/PortfolioSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";


const Index = () => {
  const [userName, setUserName] = useState<string>("");
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Check if user has already entered their name
    const storedName = localStorage.getItem("patel_studio_user_name");
    if (storedName) {
      setUserName(storedName);
      setShowWelcome(false);
    }
  }, []);

  const handleWelcomeComplete = (name: string) => {
    setUserName(name);
    localStorage.setItem("patel_studio_user_name", name);
    setShowWelcome(false);
  };

  return (
    <div className="min-h-screen">
      {showWelcome && <WelcomeModal onComplete={handleWelcomeComplete} />}
      
      <HeroSection userName={userName} />
      <FreeGiftsSection />
      <ServicesSection />
      <PricingSection />
      <PortfolioSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default Index;
