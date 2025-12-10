// src/components/PricingSection.tsx

// ----------------------------------------------------
// 1. IMPORTS
// ----------------------------------------------------
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronRight, X, ArrowLeft } from "lucide-react";

// ----------------------------------------------------
// 2. CONFIG & HELPERS
// ----------------------------------------------------
const WHATSAPP_NUMBER = "919009476587";

// --- NEW IMAGE ARRAYS BASED ON USER'S NEW NAMING CONVENTION ---

// Helper to create sequential image names
const createSequentialImages = (baseName: string, count: number, extension = '.jpg'): string[] => {
  return Array.from({ length: count }, (_, i) => `${baseName}${i + 1}${extension}`);
};

// 1. BRIDE SHOOT: bride1.jpg to bride8.jpg
const BrideShootImages = createSequentialImages("bride", 8);

// 2. HALDI & MEHNDI: haldi1.jpg to haldi8.jpg AND mehndi1.jpg to mehndi4.jpg
const HaldiMehndiImages = [
  ...createSequentialImages("haldi", 8),
  ...createSequentialImages("mehndi", 4),
]; // Total 12 images

// 3. CANDID (using 'pre' images): pre1.jpg to pre9.jpg
const CandidImages = createSequentialImages("pre", 9);

// 4. PRE-WEDDING: prewedding1.jpg to prewedding6.jpg
const PreWeddingImages = createSequentialImages("prewedding", 6);

// 5. WEDDING: wedd1.jpg to wedd10.jpg
const WeddingImages = createSequentialImages("wedd", 10);

// 6. GROOM SHOOT: groom1.jpg to groom4.jpg
const GroomShootImages = createSequentialImages("groom", 4);

// Helper for WhatsApp link
const generateWhatsAppLink = (itemName: string, itemPrice: string) => {
  const message = encodeURIComponent(
    `Hello, I'm interested in booking the *${itemName}* package for ${itemPrice}. Could you share more details and availability?`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
};

type ItemType = typeof catalogueItems[number];


// ----------------------------------------------------
// 3. CATALOGUE DATA
// ----------------------------------------------------
const catalogueItems = [
  {
    name: "BRIDE SHOOT",
    price: "₹21,000.00",
    description: "TRADITIONAL PHOTOGRAPHY VIDEOGRAPHY ",
    // Use the first image from the new array as thumbnail
    image: BrideShootImages[0] || "placeholder.jpg",
    galleryImages: BrideShootImages,
  },
  {
    name: "PRE-WEDDING SHOOT",
    price: "₹45,000.00",
    description: "10 SHEET ALBUM",
    // Use the first image from the new array as thumbnail
    image: PreWeddingImages[0] || "placeholder.jpg",
    galleryImages: PreWeddingImages,
  },
  {
    name: "WEDDING PHOTOGRAPHY",
    price: "₹50,000.00",
    description: "ONLY TRADITIONAL",
    // Use the first image from the new array as thumbnail
    image: WeddingImages[0] || "placeholder.jpg",
    galleryImages: WeddingImages,
  },
  {
    // Name is just "Candid" in the price card, using "Candid" array
    name: "Candid", 
    price: "₹60,000.00",
    description: "ALL WEDDING DAYS CANDID SHOTS",
    // Use the first image from the new array as thumbnail
    image: CandidImages[0] || "placeholder.jpg",
    galleryImages: CandidImages,
  },
  {
    name: "GROOM SHOOT",
    price: "₹22,000.00",
    description: "ONLY TRADITIONAL",
    // Use the first image from the new array as thumbnail
    image: GroomShootImages[0] || "placeholder.jpg",
    galleryImages: GroomShootImages,
  },
  {
    // Updated name to reflect Haldi photos as well
    name: "MEHNDI & HALDI SHOOT", 
    price: "₹5,500.00",
    description: "ONLY CANDID SHOOT ONE DAY",
    // Use the first image from the new combined array as thumbnail
    image: HaldiMehndiImages[0] || "placeholder.jpg",
    galleryImages: HaldiMehndiImages,
  },
];


// ----------------------------------------------------
// 4. MAIN COMPONENT
// ----------------------------------------------------
export const PricingSection: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);

  // --- IMAGE RESOLVER LOGIC (Vite specific) ---
  const imagesMap = useMemo(() => {
    // @ts-ignore
    // This glob pattern remains correct for finding all new .jpg files in ../assets
    const modules = import.meta.glob("../assets/*.{jpg,jpeg,png,webp}", { as: "url", eager: true }) as Record<string, string>;
    
    const map: Record<string, string> = {};
    Object.entries(modules).forEach(([path, url]) => {
      const parts = path.split("/");
      const filename = parts[parts.length - 1];
      map[filename] = url;
    });
    return map;
  }, []);

  const resolveImageUrl = (fileName: string) => {
    if (!fileName) return imagesMap["placeholder.jpg"] || Object.values(imagesMap)[0] || "";
    // This will now correctly look up the new file names like 'bride1.jpg'
    return imagesMap[fileName] || imagesMap["placeholder.jpg"] || Object.values(imagesMap)[0] || "";
  };

  const onImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    if (!img.dataset.fallback) {
      img.dataset.fallback = "true";
      img.src = resolveImageUrl("placeholder.jpg");
    }
  };
  // ---------------------------------------------------

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-romantic-purple/10 via-background to-romantic-gold/10 relative overflow-hidden min-h-[80vh]">
      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* SECTION HEADER (No change) */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-4">📸 Our Service Catalogue</h2>
          <p className="font-body text-xl text-muted-foreground">Apni pasand ki service dekhein aur <strong>photos</strong> check karne ke liye click karein.</p>
        </motion.div>

        {/* CATALOGUE GRID (No structural change needed after previous fix) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {catalogueItems.map((item, idx) => (
            <motion.div
              key={item.name + idx}
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06, duration: 0.5 }}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => setSelectedItem(item)}
              className="glass cursor-pointer rounded-xl p-4 border border-border flex items-center gap-4 transition-all duration-300 hover:border-romantic-gold/80 hover:shadow-[0_0_20px_rgba(218,164,154,0.3)]"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter") setSelectedItem(item); }}
              aria-label={`Open gallery for ${item.name}`}
            >
              <motion.div
                whileHover={{ y: -4, scale: 1.12, rotate: 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden shadow-lg bg-white/10 flex items-center justify-center"
                aria-hidden
              >
                <img
                  src={resolveImageUrl(item.image)}
                  alt={`Thumbnail for ${item.name}`}
                  onError={onImgError}
                  className="w-full h-full object-contain p-1"
                />
              </motion.div>

              <div className="flex-grow">
                <h3 className="font-heading text-lg font-bold text-foreground truncate">{item.name}</h3>
                <p className="font-body text-sm text-romantic-purple font-semibold">{item.price}</p>
                <p className="font-body text-xs text-muted-foreground truncate">{item.description}</p>
              </div>

              <ChevronRight className="w-5 h-5 text-romantic-gold flex-shrink-0" />
            </motion.div>
          ))}
        </motion.div>

        {/* GALLERY MODAL (No change) */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" aria-modal role="dialog">
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-card rounded-2xl p-6 max-w-5xl w-full relative max-h-[95vh] overflow-y-auto">
                <button onClick={() => setSelectedItem(null)} aria-label="Close gallery" className="absolute top-3 right-3 text-foreground z-10">
                  <X className="w-6 h-6" />
                </button>

                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-2xl font-bold text-romantic-gold">{selectedItem.name}</h3>
                  <span className="text-sm text-muted-foreground">{selectedItem.price}</span>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{selectedItem.description}</p>

                {/* V E R T I C A L G R I D G A L L E R Y */}
                {selectedItem.galleryImages && selectedItem.galleryImages.length > 0 ? (
                  <div className="mb-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 py-2 px-1">
                      {selectedItem.galleryImages.map((fileName: string, i: number) => (
                        <motion.div 
                          key={fileName + i} 
                          className="rounded-lg overflow-hidden shadow-md aspect-square bg-white/10 flex items-center justify-center"
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          transition={{ delay: i * 0.02 }}
                        >
                          <img 
                            src={resolveImageUrl(fileName)} 
                            alt={`${selectedItem.name} ${i + 1}`} 
                            onError={onImgError} 
                            className="w-full h-full object-contain p-1"
                          />
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-center text-sm text-muted-foreground mt-3">Scroll down to view all photos.</p>
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">No sample photos available for this service yet.</div>
                )}

                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-3 mt-2">
                  <Button onClick={() => setSelectedItem(null)} variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>

                  <a href={generateWhatsAppLink(selectedItem.name, selectedItem.price)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 py-2 px-4 bg-romantic-purple text-white rounded-lg ml-2" aria-label={`Contact about ${selectedItem.name}`}>
                    Book/Enquire on WhatsApp
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* decorative sparkles */}
      <Sparkles className="absolute top-1/4 left-10 w-32 h-32 text-romantic-gold/20 animate-spin-slow" />
      <Sparkles className="absolute bottom-1/4 right-10 w-40 h-40 text-romantic-purple/20 animate-spin-slow" />
    </section>
  );
};

export default PricingSection;