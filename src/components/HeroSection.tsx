// src/components/HeroSection.tsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-couple.jpg";

interface HeroSectionProps {
  userName?: string;
}

export const HeroSection = ({ userName }: HeroSectionProps) => {
  const navigate = useNavigate();

  const scrollToPortfolio = () => {
    // robust: try explicit id, then data attribute, then querySelector by section name
    const el =
      document.getElementById("portfolio-section") ||
      document.querySelector("[data-portfolio]") ||
      document.querySelector("#portfolio") ||
      null;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    // debug hint for dev if not found
    console.warn("Portfolio element not found. Ensure section has id='portfolio-section' or data-portfolio attribute.");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero background (cinematic zoom) */}
      <motion.div
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeOut" }}
        className="absolute inset-0"
      >
        {/* background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />

        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-romantic-purple/70 via-transparent to-romantic-pink/50" />

        {/* Bokeh decorative particles */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 100 + 40,
                height: Math.random() * 100 + 40,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `radial-gradient(circle, ${
                  i % 2 === 0 ? "hsl(340 100% 91% / 0.35)" : "hsl(263 100% 60% / 0.28)"
                }, transparent)`,
              }}
              animate={{ y: [0, -20, 0], opacity: [0.25, 0.6, 0.25], scale: [1, 1.15, 1] }}
              transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Hero content (on top) */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.8 }}
          className="glass-dark p-12 rounded-3xl max-w-4xl mx-auto"
        >
          {userName && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="text-romantic-pink font-body text-lg mb-4"
            >
              Hello, {userName} 💗
            </motion.p>
          )}

          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6 }}>
            <Camera className="w-16 h-16 mx-auto text-romantic-gold animate-float mb-6" />
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
          >
            Patel Studio
          </motion.h1>

          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }} className="font-heading text-3xl md:text-4xl text-romantic-pink mb-4">
            We Capture Lovable Moments Forever
          </motion.p>

          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }} className="font-body text-xl md:text-2xl text-white/90 mb-10">
            Emotions. Romance. Elegance.
          </motion.p>

          {/* Buttons */}
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Book Now (navigates to booking page) */}
            <Button
              size="lg"
              variant="hero"
              className="text-lg group z-20"
              onClick={() => navigate("/booking")}
            >
              <Sparkles className="mr-2 w-5 h-5 group-hover:animate-spin" />
              Book Now
            </Button>

            {/* Explore Portfolio (smooth scroll with fallback) */}
            <Button
              size="lg"
              variant="glass"
              className="text-lg z-20"
              onClick={scrollToPortfolio}
            >
              Explore Portfolio
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 10, 0] }} transition={{ delay: 1.5, y: { duration: 2, repeat: Infinity } }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-1">
          <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 h-1.5 bg-white rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
