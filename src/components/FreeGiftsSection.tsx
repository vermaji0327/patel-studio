import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import tshirtImg from "@/assets/gift-tshirt.jpg";
import mugImg from "@/assets/gift-mug.jpg";
import frameImg from "@/assets/gift-frame.jpg";
import keychainImg from "@/assets/gift-keychain.jpg";

const gifts = [
  {
    title: "Premium T-Shirt",
    description: "Your love printed on premium quality fabric",
    image: tshirtImg,
  },
  {
    title: "Couple Mug",
    description: "Every sip reminds you of beautiful moments",
    image: mugImg,
  },
  {
    title: "Mini Frame",
    description: "Rose gold elegance for your desk or shelf",
    image: frameImg,
  },
  {
    title: "Photo Keychain",
    description: "Carry your love wherever you go",
    image: keychainImg,
  },
];

export const FreeGiftsSection = () => {
  return (
    <section className="py-24 px-6 bg-gradient-to-br from-romantic-lavender via-background to-romantic-pink/20">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Gift className="w-16 h-16 text-romantic-gold" />
          </motion.div>
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-4">
            Free Luxury Gifts
          </h2>
          <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
            Every booking comes with beautiful complimentary gifts to make your memories even more special
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {gifts.map((gift, index) => (
            <motion.div
              key={gift.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="group"
            >
              <div className="glass rounded-2xl p-6 hover-glow transition-all duration-500 relative overflow-hidden">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-romantic-purple/0 via-romantic-pink/0 to-romantic-gold/0 group-hover:from-romantic-purple/10 group-hover:via-romantic-pink/10 group-hover:to-romantic-gold/10 transition-all duration-500 rounded-2xl" />
                
                <div className="relative z-10">
                  <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-romantic-pink/20 to-romantic-lavender/20">
                    <img
                      src={gift.image}
                      alt={gift.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  
                  <h3 className="font-heading text-2xl font-semibold text-foreground mb-2">
                    {gift.title}
                  </h3>
                  <p className="font-body text-muted-foreground">
                    {gift.description}
                  </p>

                  {/* Free badge */}
                  <div className="absolute top-8 right-8 bg-romantic-gold text-white px-4 py-2 rounded-full font-body font-semibold text-sm shadow-lg">
                    FREE
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="font-cursive text-3xl text-romantic-purple">
            All gifts included with every package ✨
          </p>
        </motion.div>
      </div>
    </section>
  );
};
