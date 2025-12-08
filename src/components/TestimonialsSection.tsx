import { motion } from "framer-motion";
import { Star, Quote, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";

const testimonials = [
  {
    name: "Priya & Rahul",
    service: "Pre-Wedding Shoot",
    text: "Patel Studio made our pre-wedding shoot absolutely magical! Every photo captured our love story perfectly. The team was professional, creative, and made us feel so comfortable.",
    rating: 5,
    initials: "PR",
  },
  {
    name: "Sneha Sharma",
    service: "Baby Photography",
    text: "The most beautiful baby photos ever! They captured my little one's precious moments with such care and creativity. The free gifts were an amazing bonus. Highly recommend!",
    rating: 5,
    initials: "SS",
  },
  {
    name: "Amit & Kavya",
    service: "Couple Shoot",
    text: "We were blown away by the quality and emotion in every photograph. Patel Studio didn't just take pictures, they created memories we'll treasure forever. Worth every penny!",
    rating: 5,
    initials: "AK",
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-24 px-6 bg-gradient-to-br from-romantic-lavender/30 via-background to-romantic-pink/20 relative overflow-hidden">
      {/* Floating hearts decoration */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: ["0%", "-100%"],
              x: [0, Math.random() * 50 - 25],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: 0,
            }}
          >
            <Heart className="w-6 h-6 text-romantic-pink fill-romantic-pink" />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Quote className="w-16 h-16 text-romantic-gold" />
          </motion.div>
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-4">
            Client Love Stories
          </h2>
          <p className="font-body text-xl text-muted-foreground">
            What our happy clients say about us
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Card className="glass p-8 h-full hover-glow transition-all duration-500 relative overflow-hidden border-2 border-romantic-pink/20">
                {/* Gradient overlay */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-romantic-purple/10 to-romantic-pink/10 rounded-full blur-2xl" />
                
                <div className="relative z-10">
                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-romantic-purple to-romantic-pink flex items-center justify-center">
                      <span className="font-heading text-white text-xl font-bold">
                        {testimonial.initials}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-semibold text-foreground">
                        {testimonial.name}
                      </h3>
                      <p className="font-body text-sm text-muted-foreground">
                        {testimonial.service}
                      </p>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                      >
                        <Star className="w-5 h-5 fill-romantic-gold text-romantic-gold" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Quote */}
                  <Quote className="w-8 h-8 text-romantic-pink/30 mb-2" />
                  <p className="font-body text-foreground leading-relaxed italic">
                    "{testimonial.text}"
                  </p>

                  {/* Decorative hearts */}
                  <div className="absolute bottom-4 right-4 opacity-10">
                    <Heart className="w-12 h-12 text-romantic-pink fill-romantic-pink" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
