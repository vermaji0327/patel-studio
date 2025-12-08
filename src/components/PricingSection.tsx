// src/components/PricingSection.tsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Crown, Star } from "lucide-react";
import { useNavigate } from "react-router-dom"; // <-- add this

const packages = [
  {
    name: "Starter Love",
    price: "₹4,999",
    icon: Star,
    features: [
      "50+ Edited Photos",
      "1 Hour Photoshoot",
      "Free T-Shirt + Mug",
      "Digital Album",
      "Basic Editing",
    ],
    popular: false,
  },
  {
    name: "Premium Romance",
    price: "₹9,999",
    icon: Sparkles,
    features: [
      "100+ Edited Photos",
      "2 Hours Photoshoot",
      "All 4 Free Gifts",
      "Cinematic Reel (30s)",
      "Premium Editing",
      "Instant QR Album",
      "Same-Day Delivery",
    ],
    popular: true,
  },
  {
    name: "Royal Cinematic",
    price: "₹19,999",
    icon: Crown,
    features: [
      "200+ Edited Photos",
      "4 Hours Photoshoot",
      "All Premium Gifts",
      "Cinematic Video (3-5 min)",
      "Luxury Editing",
      "2 Locations",
      "Instant QR Album",
      "Priority Delivery",
      "Free Makeup Session",
    ],
    popular: false,
  },
];

export const PricingSection = () => {
  const navigate = useNavigate(); // <-- hook

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-romantic-purple/10 via-background to-romantic-gold/10 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-4">
            Choose Your Package
          </h2>
          <p className="font-body text-xl text-muted-foreground">
            Premium quality at prices that make your heart smile
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => {
            const Icon = pkg.icon;
            return (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ y: -12, scale: 1.02 }}
                className={`relative group ${pkg.popular ? "md:-mt-8" : ""}`}
              >
                {pkg.popular && (
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"
                  >
                    <div className="bg-gradient-to-r from-romantic-purple to-romantic-gold text-white px-6 py-2 rounded-full font-body font-semibold text-sm shadow-lg">
                      ⭐ Most Popular
                    </div>
                  </motion.div>
                )}

                <div
                  className={`glass rounded-3xl p-8 h-full transition-all duration-500 ${
                    pkg.popular
                      ? "border-2 border-romantic-gold shadow-[0_0_40px_rgba(218,164,154,0.4)]"
                      : "border border-border"
                  } hover:shadow-[0_0_50px_rgba(106,50,255,0.3)] relative overflow-hidden`}
                >
                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                      className="mb-6"
                    >
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-romantic-purple to-romantic-gold flex items-center justify-center">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>

                    <h3 className="font-heading text-3xl font-bold text-foreground mb-2">
                      {pkg.name}
                    </h3>

                    <div className="mb-6">
                      <span className="font-heading text-5xl font-bold text-romantic-purple">
                        {pkg.price}
                      </span>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {pkg.features.map((feature, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 * i }}
                          className="flex items-start gap-3"
                        >
                          <Check className="w-5 h-5 text-romantic-gold flex-shrink-0 mt-1" />
                          <span className="font-body text-foreground">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* Button navigation */}
                    <Button
                      size="lg"
                      variant={pkg.popular ? "hero" : "outline"}
                      className="w-full"
                      onClick={() => navigate("/booking")} // <-- navigate to Booking
                    >
                      Book This Package
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
