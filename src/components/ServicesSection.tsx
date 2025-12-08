import { motion } from "framer-motion";
import { Heart, Baby, Cake, User, Package, Camera } from "lucide-react";

const services = [
  {
    icon: Heart,
    title: "Lovable Couple Shoots",
    description: "Capture your romance in the most beautiful frames. Soft, emotional, and timeless.",
  },
  {
    icon: Camera,
    title: "Pre-Wedding Romance",
    description: "Tell your love story before the big day. Cinematic, dreamy, and unforgettable.",
  },
  {
    icon: Baby,
    title: "Baby & Kids Photography",
    description: "Precious moments of innocence. Playful, gentle, and full of love.",
  },
  {
    icon: Cake,
    title: "Birthday & Events",
    description: "Celebrate life's special moments. Joyful, vibrant, and memorable.",
  },
  {
    icon: User,
    title: "Portrait Studio",
    description: "Professional portraits that reflect your personality. Elegant and sophisticated.",
  },
  {
    icon: Package,
    title: "Product Luxury Shots",
    description: "Showcase your products with premium quality. Commercial excellence.",
  },
];

export const ServicesSection = () => {
  return (
    <section className="py-24 px-6 bg-gradient-to-br from-background via-romantic-lavender/30 to-romantic-pink/10 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-romantic-purple/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-romantic-pink/10 rounded-full blur-3xl" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-4">
            Our Services
          </h2>
          <p className="font-cursive text-3xl text-romantic-purple">
            Emotional & Premium
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <div className="glass rounded-2xl p-8 border-2 border-romantic-gold/20 hover-glow transition-all duration-500 h-full">
                  {/* Rose burst animation on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: "radial-gradient(circle at center, hsl(340 100% 91% / 0.2), transparent 70%)",
                    }}
                  />

                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="mb-6 inline-block"
                    >
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-romantic-purple to-romantic-pink flex items-center justify-center">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>

                    <h3 className="font-heading text-2xl font-semibold text-foreground mb-3">
                      {service.title}
                    </h3>
                    <p className="font-body text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Gold outline glow */}
                  <div className="absolute inset-0 rounded-2xl border border-romantic-gold/0 group-hover:border-romantic-gold/50 transition-all duration-500 shadow-[0_0_20px_rgba(218,164,154,0)] group-hover:shadow-[0_0_20px_rgba(218,164,154,0.3)]" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
