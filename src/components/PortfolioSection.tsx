// src/components/PortfolioSection.tsx
import { motion } from "framer-motion";
import { useState } from "react";
import { X, Heart } from "lucide-react";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";
import portfolio5 from "@/assets/portfolio-5.jpg";
import portfolio6 from "@/assets/portfolio-6.jpg";

const portfolioImages = [
  { src: portfolio1, title: "WEDDING PHOTOGRAPHY" },
  { src: portfolio2, title: "Lovable Couple" },
  { src: portfolio3, title: "Baby Photography" },
  { src: portfolio4, title: "Birthday Joy" },
  { src: portfolio5, title: "Professional Portrait" },
  { src: portfolio6, title: "Cinematic Products" },
];

export const PortfolioSection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const toggleLike = (index: number) => {
    const newLiked = new Set(liked);
    if (newLiked.has(index)) newLiked.delete(index);
    else newLiked.add(index);
    setLiked(newLiked);
  };

  return (
    <section
      id="portfolio-section"
      className="py-24 px-6 bg-gradient-to-br from-background via-romantic-pink/10 to-romantic-lavender/20"
    >
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-4">
            Our Portfolio
          </h2>
          <p className="font-cursive text-3xl text-romantic-purple">
            Clickable & Incredible
          </p>
        </motion.div>

        {/* Uniform grid: no manual row spanning (prevents holes) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06 * index, duration: 0.45 }}
              whileHover={{ scale: 1.03, y: -6 }}
              className="group relative cursor-pointer rounded-2xl overflow-hidden"
              onClick={() => setSelectedImage(index)}
            >
              {/* Fixed aspect ratio so all cards have same height */}
              <div className="aspect-[3/4] relative overflow-hidden rounded-2xl">
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* overlay & hover effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-romantic-purple/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="absolute inset-0 border-4 border-transparent group-hover:border-romantic-pink/50 transition-all duration-300 rounded-2xl shadow-[0_0_20px_rgba(255,211,224,0)] group-hover:shadow-[0_0_20px_rgba(255,211,224,0.45)]" />

                {/* caption + like */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-2xl font-semibold text-white">
                      {image.title}
                    </h3>

                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(index);
                      }}
                      className="relative z-20"
                      type="button"
                      aria-label={liked.has(index) ? "Unlike" : "Like"}
                    >
                      <Heart
                        className={`w-8 h-8 transition-colors ${
                          liked.has(index) ? "fill-romantic-pink text-romantic-pink" : "text-white"
                        }`}
                      />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Fullscreen modal */}
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 z-50 glass-dark p-3 rounded-full hover:bg-white/20 transition-colors"
              type="button"
              title="Close image"
            >
              <X className="w-8 h-8 text-white" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring" }}
              className="max-w-5xl max-h-[90vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={portfolioImages[selectedImage].src}
                alt={portfolioImages[selectedImage].title}
                className="w-full h-full object-contain rounded-2xl shadow-[0_0_50px_rgba(106,50,255,0.5)]"
              />

              <div className="absolute bottom-6 left-6 right-6 glass-dark p-6 rounded-xl">
                <h3 className="font-heading text-3xl font-bold text-white">
                  {portfolioImages[selectedImage].title}
                </h3>
              </div>

              {/* navigation arrows */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-6 pointer-events-none">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage((selectedImage - 1 + portfolioImages.length) % portfolioImages.length);
                  }}
                  className="pointer-events-auto glass-dark p-4 rounded-full hover:bg-white/20 transition-colors"
                  type="button"
                >
                  <span className="text-white text-2xl">←</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage((selectedImage + 1) % portfolioImages.length);
                  }}
                  className="pointer-events-auto glass-dark p-4 rounded-full hover:bg-white/20 transition-colors"
                  type="button"
                >
                  <span className="text-white text-2xl">→</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PortfolioSection;
