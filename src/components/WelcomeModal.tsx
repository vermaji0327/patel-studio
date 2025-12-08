import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface WelcomeModalProps {
  onComplete: (name: string) => void;
}

export const WelcomeModal = ({ onComplete }: WelcomeModalProps) => {
  const [name, setName] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [showBloom, setShowBloom] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setShowBloom(true);
      setTimeout(() => {
        onComplete(name);
        setIsVisible(false);
      }, 2000);
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-romantic-purple/90 via-romantic-pink/80 to-romantic-gold/70 backdrop-blur-xl"
      >
        {/* Floating rose petals */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-8 h-8 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                background: `radial-gradient(circle, ${
                  i % 3 === 0 ? "hsl(340 100% 91%)" : i % 3 === 1 ? "hsl(263 100% 70%)" : "hsl(15 45% 72%)"
                }, transparent)`,
              }}
              animate={{
                y: ["0vh", "110vh"],
                x: [0, Math.random() * 100 - 50],
                rotate: [0, 360],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Welcome content */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="relative z-10 text-center px-6 max-w-xl"
        >
          {!showBloom ? (
            <>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-8"
              >
                <Heart className="w-20 h-20 mx-auto text-romantic-pink fill-romantic-pink animate-heart-beat" />
              </motion.div>

              <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-4">
                Welcome
              </h1>
              <p className="font-cursive text-3xl text-romantic-pink mb-8">
                to Patel Studio
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="glass-dark p-8 rounded-2xl backdrop-blur-2xl">
                  <label className="block text-white text-lg mb-4 font-body">
                    Enter Your Name
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white/10 border-romantic-pink/30 text-white placeholder:text-white/50 text-center text-xl h-14 rounded-xl"
                    placeholder="Your beautiful name..."
                    autoFocus
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  variant="hero"
                  className="w-full h-14 text-lg"
                  disabled={!name.trim()}
                >
                  Enter ✨
                </Button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: [0, 360], scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5 }}
                className="mb-6"
              >
                <Heart className="w-32 h-32 mx-auto text-romantic-pink fill-romantic-pink" />
              </motion.div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
                Welcome, {name} ❤️
              </h2>
              <p className="font-cursive text-3xl text-romantic-pink">
                Your Memories Matter Here...
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
