import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronRight, X, ArrowLeft, Star } from "lucide-react";

// ----------------------------------------------------
// 🖼️ ASSET/CONFIG MANAGEMENT
// ----------------------------------------------------
const WHATSAPP_NUMBER = "919009476587";

/** Helper to generate a sequence of image file names */
const createSequentialImages = (baseName: string, count: number, extension = ".jpg"): string[] =>
  Array.from({ length: count }, (_, i) => `${baseName}${i + 1}${extension}`);

// --- Image Lists ---
const BrideShootImages = createSequentialImages("bride", 8);
const HaldiMehndiImages = [...createSequentialImages("haldi", 8), ...createSequentialImages("mehndi", 4)];
const CandidImages = createSequentialImages("pre", 9); // Naming check: 'pre' for Candid? Assuming source is correct.
const PreWeddingImages = createSequentialImages("prewedding", 6);
const WeddingImages = createSequentialImages("wedd", 10);
const GroomShootImages = createSequentialImages("groom", 4);

/** Generates WhatsApp link with a pre-filled booking message */
const generateWhatsAppLink = (itemName: string, itemPrice: string) => {
  const message = encodeURIComponent(
    `Hello, I'm interested in booking the *${itemName}* package for ${itemPrice}. Could you share more details and availability?`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
};

// --- Type Definition ---
type Item = {
  name: string;
  price: string;
  description: string;
  image: string; // Main display image
  galleryImages: string[]; // Images for the modal gallery
};

// --- Catalogue Data ---
const catalogueItems: Item[] = [
  { name: "BRIDE SHOOT", price: "₹21,000", description: "Traditional photography + videography", image: BrideShootImages[0] || "placeholder.jpg", galleryImages: BrideShootImages },
  { name: "PRE-WEDDING SHOOT", price: "₹25,000", description: "10-sheet premium album", image: PreWeddingImages[0] || "placeholder.jpg", galleryImages: PreWeddingImages },
  { name: "WEDDING PHOTOGRAPHY", price: "₹30,000", description: "Full wedding day coverage", image: WeddingImages[0] || "placeholder.jpg", galleryImages: WeddingImages },
  { name: "CANDID", price: "₹40,000", description: "All wedding days candid shots", image: CandidImages[0] || "placeholder.jpg", galleryImages: CandidImages },
  { name: "GROOM SHOOT", price: "₹22,000", description: "Stylish groom portraits", image: GroomShootImages[0] || "placeholder.jpg", galleryImages: GroomShootImages },
  { name: "MEHNDI & HALDI SHOOT", price: "₹8,500", description: "One-day candid package", image: HaldiMehndiImages[0] || "placeholder.jpg", galleryImages: HaldiMehndiImages },
];

// ----------------------------------------------------
// ⚙️ HOOKS AND HELPERS (FOR IMAGE RESOLUTION)
// ----------------------------------------------------
const useImageResolver = () => {
  // Vite image resolver logic (as provided in the original code)
  const imagesMap = useMemo(() => {
    // @ts-ignore
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
    // Fallback logic
    if (!fileName) return imagesMap["placeholder.jpg"] || Object.values(imagesMap)[0] || "";
    return imagesMap[fileName] || imagesMap["placeholder.jpg"] || Object.values(imagesMap)[0] || "";
  };

  const onImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    if (!img.dataset.fallback) {
      img.dataset.fallback = "true";
      img.src = resolveImageUrl("placeholder.jpg");
    }
  };

  return { resolveImageUrl, onImgError };
};

// ----------------------------------------------------
// 📦 COMPONENTS
// ----------------------------------------------------

/** Gallery Modal Component */
const GalleryModal: React.FC<{ selectedItem: Item; setActiveImageIndex: React.Dispatch<React.SetStateAction<number>>; activeImageIndex: number; setSelectedItem: React.Dispatch<React.SetStateAction<Item | null>>; resolveImageUrl: (fileName: string) => string; onImgError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void; }> = ({
  selectedItem,
  setActiveImageIndex,
  activeImageIndex,
  setSelectedItem,
  resolveImageUrl,
  onImgError
}) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 md:p-8">
    <motion.div initial={{ scale: 0.98, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.98, y: 20 }} className="bg-white rounded-3xl max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl flex flex-col">
      
      {/* Modal Header */}
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100 flex-wrap gap-3">
        <div>
          <h3 className="text-2xl font-bold text-foreground">{selectedItem.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{selectedItem.price} • {selectedItem.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <a href={generateWhatsAppLink(selectedItem.name, selectedItem.price)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 py-2 px-4 bg-romantic-purple text-white rounded-xl text-sm font-semibold hover:bg-romantic-purple/90 transition-colors">Contact on WhatsApp</a>
          <button onClick={() => setSelectedItem(null)} className="p-3 rounded-full hover:bg-gray-100 transition-colors" aria-label="Close gallery"><X className="w-6 h-6" /></button>
        </div>
      </div>

      {/* Modal Content: Main Image + Sidebar */}
      <div className="p-4 md:p-6 flex flex-col lg:flex-row gap-6 overflow-y-auto">
        
        {/* Main Gallery Area */}
        <div className="lg:flex-1 min-w-0">
          
          {/* Main Image View */}
          <div className="rounded-xl overflow-hidden bg-gray-100 h-[350px] md:h-[550px] flex items-center justify-center relative shadow-lg">
            <img 
              src={resolveImageUrl(selectedItem.galleryImages[activeImageIndex])} 
              alt={`${selectedItem.name} ${activeImageIndex + 1}`} 
              className="w-full h-full object-contain" 
              onError={onImgError} 
            />
          </div>

          {/* Thumbnails */}
          <div className="mt-4 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
            {selectedItem.galleryImages.map((f, i) => (
              <button 
                key={f + i} 
                onClick={() => setActiveImageIndex(i)} 
                className={`h-16 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${i === activeImageIndex ? "ring-2 ring-romantic-gold border-romantic-gold" : "border-transparent hover:ring-1 hover:ring-gray-300"}`}
                aria-label={`View photo ${i + 1}`}
              >
                <img 
                  src={resolveImageUrl(f)} 
                  alt={`thumb-${i}`} 
                  className="w-full h-full object-cover" 
                  onError={onImgError} 
                />
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar: What's Included & CTA */}
        <aside className="lg:w-80 flex-shrink-0">
          <div className="bg-gray-50 rounded-2xl p-6 shadow-md border border-gray-200 sticky top-0">
            <h4 className="font-bold text-xl text-foreground mb-4">What's Included</h4>
            <ul className="mt-3 text-base text-gray-700 space-y-3">
              <li>• Professional photographers & assistants</li>
              <li>• High-resolution edited photos (Digital Delivery)</li>
              <li>• Quick turnaround (2–3 weeks guaranteed)</li>
              <li>• Premium Album (optional/where applicable)</li>
              <li>• Personalized Consultation</li>
            </ul>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-muted-foreground mb-3">Ready to book your dream wedding photography?</p>
              <div className="flex flex-col gap-3">
                <a href={generateWhatsAppLink(selectedItem.name, selectedItem.price)} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center py-3 px-4 bg-romantic-gold text-foreground rounded-xl font-bold text-center shadow-lg hover:shadow-xl transition-shadow">
                  Enquire on WhatsApp
                </a>
                <button onClick={() => { navigator.clipboard?.writeText(selectedItem.price); alert(`Price ${selectedItem.price} copied to clipboard!`); }} className="py-2 px-3 border border-gray-300 rounded-xl bg-white hover:bg-gray-100 transition text-sm">
                  Copy Price: {selectedItem.price}
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

    </motion.div>
  </motion.div>
);


/** Main Pricing Section Component */
export const PricingSection: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { resolveImageUrl, onImgError } = useImageResolver();

  const openWhatsApp = (item: Item) => {
    window.open(generateWhatsAppLink(item.name, item.price), "_blank", "noopener,noreferrer");
  };

  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-romantic-pink/10 via-romantic-pink/5 to-white/50">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-3 bg-romantic-gold/10 rounded-full px-4 py-2 mb-4 shadow-sm">
            <Sparkles className="w-5 h-5 text-romantic-gold" />
            <span className="text-sm font-medium text-romantic-gold">Limited Slots — Book Fast</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight">Our Most Loved Packages</h2>
          <p className="text-muted-foreground mt-4 max-w-3xl mx-auto text-lg">Hand-picked packages to turn your wedding memories into timeless art. Tap any card to view gallery or quick book.</p>
        </div>

        {/* Pricing Grid (Responsive) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {catalogueItems.map((item, idx) => (
            <motion.article
              key={item.name + idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              className="relative w-full bg-white/70 rounded-3xl p-6 shadow-xl hover:shadow-2xl border border-white/60 backdrop-blur-sm transform transition-all duration-300 hover:-translate-y-2 cursor-pointer group flex flex-col"
              onClick={() => {
                setSelectedItem(item);
                setActiveImageIndex(0);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSelectedItem(item);
                  setActiveImageIndex(0);
                }
              }}
              aria-label={`Open ${item.name} gallery`}
            >
              
              {/* Floating Tags */}
              <div className="absolute top-4 right-4 bg-romantic-gold/90 text-white font-semibold px-4 py-1 rounded-full text-sm z-20 shadow-md">
                {item.price}
              </div>
              <div className="absolute top-4 left-4 bg-romantic-pink text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md z-20">
                Popular
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                
                {/* Image Area */}
                <div className="w-full sm:w-36 flex-shrink-0">
                  <div className="rounded-xl overflow-hidden bg-gray-100 shadow-inner">
                    <img
                      src={resolveImageUrl(item.image)}
                      alt={item.name}
                      onError={onImgError}
                      className="w-full h-40 sm:h-36 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-foreground truncate">{item.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-3">{item.description}</p>
                  
                  {/* Rating */}
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Trusted by couples • 4.9/5</span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-3 justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openWhatsApp(item);
                  }}
                  className="flex-1 min-w-[45%] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-romantic-pink to-romantic-purple text-white text-sm font-semibold shadow-lg hover:scale-[1.02] transition-transform"
                  aria-label={`Book ${item.name} on WhatsApp`}
                >
                  Book on WhatsApp
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(item);
                    setActiveImageIndex(0);
                  }}
                  className="flex-1 min-w-[45%] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-300 text-foreground text-sm font-semibold bg-white hover:bg-gray-50 transition"
                  aria-label={`View ${item.name} gallery`}
                >
                  View Gallery
                </button>
              </div>

            </motion.article>
          ))}
        </div>

        {/* Modal Insertion */}
        <AnimatePresence>
          {selectedItem && (
            <GalleryModal 
              selectedItem={selectedItem} 
              setActiveImageIndex={setActiveImageIndex} 
              activeImageIndex={activeImageIndex} 
              setSelectedItem={setSelectedItem} 
              resolveImageUrl={resolveImageUrl} 
              onImgError={onImgError} 
            />
          )}
        </AnimatePresence>
      </div>

      {/* Floating CTA (Book Now) */}
      <div className="fixed right-4 bottom-4 md:right-8 md:bottom-8 z-40">
        <a 
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I want to book a slot")}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-3 px-6 py-4 rounded-full bg-gradient-to-r from-romantic-pink to-romantic-purple text-white shadow-2xl hover:scale-105 transition-transform text-lg font-bold"
          aria-label="Book a slot now"
        >
          <Sparkles className="w-6 h-6" />
          Book Now
        </a>
      </div>
    </section>
  );
};

export default PricingSection;