import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronRight, X, ArrowLeft, Star } from "lucide-react";

// ----------------------------------------------------
// CONFIG
// ----------------------------------------------------
const WHATSAPP_NUMBER = "919009476587";

const createSequentialImages = (baseName: string, count: number, extension = '.jpg'): string[] =>
  Array.from({ length: count }, (_, i) => `${baseName}${i + 1}${extension}`);

const BrideShootImages = createSequentialImages("bride", 8);
const HaldiMehndiImages = [...createSequentialImages("haldi", 8), ...createSequentialImages("mehndi", 4)];
const CandidImages = createSequentialImages("pre", 9);
const PreWeddingImages = createSequentialImages("prewedding", 6);
const WeddingImages = createSequentialImages("wedd", 10);
const GroomShootImages = createSequentialImages("groom", 4);

const generateWhatsAppLink = (itemName: string, itemPrice: string) => {
  const message = encodeURIComponent(
    `Hello, I'm interested in booking the *${itemName}* package for ${itemPrice}. Could you share more details and availability?`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
};

type Item = {
  name: string;
  price: string;
  description: string;
  image: string;
  galleryImages: string[];
};

const catalogueItems: Item[] = [
  { name: "BRIDE SHOOT", price: "₹21,000", description: "Traditional photography + videography", image: BrideShootImages[0] || 'placeholder.jpg', galleryImages: BrideShootImages },
  { name: "PRE-WEDDING SHOOT", price: "₹45,000", description: "10-sheet premium album", image: PreWeddingImages[0] || 'placeholder.jpg', galleryImages: PreWeddingImages },
  { name: "WEDDING PHOTOGRAPHY", price: "₹50,000", description: "Full wedding day coverage", image: WeddingImages[0] || 'placeholder.jpg', galleryImages: WeddingImages },
  { name: "CANDID", price: "₹60,000", description: "All wedding days candid shots", image: CandidImages[0] || 'placeholder.jpg', galleryImages: CandidImages },
  { name: "GROOM SHOOT", price: "₹22,000", description: "Stylish groom portraits", image: GroomShootImages[0] || 'placeholder.jpg', galleryImages: GroomShootImages },
  { name: "MEHNDI & HALDI SHOOT", price: "₹5,500", description: "One-day candid package", image: HaldiMehndiImages[0] || 'placeholder.jpg', galleryImages: HaldiMehndiImages },
];

// ----------------------------------------------------
// COMPONENT
// ----------------------------------------------------
export const PricingSection: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Vite image resolver
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
    if (!fileName) return imagesMap['placeholder.jpg'] || Object.values(imagesMap)[0] || '';
    return imagesMap[fileName] || imagesMap['placeholder.jpg'] || Object.values(imagesMap)[0] || '';
  };

  const onImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    if (!img.dataset.fallback) {
      img.dataset.fallback = 'true';
      img.src = resolveImageUrl('placeholder.jpg');
    }
  };

  const openWhatsApp = (item: Item) => {
    window.open(generateWhatsAppLink(item.name, item.price), '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-romantic-pink/20 via-romantic-pink/10 to-romantic-pink/5">
      <div className="container mx-auto max-w-7xl">

        {/* header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-romantic-gold/10 rounded-full px-4 py-2 mb-4 shadow-sm">
            <Sparkles className="w-5 h-5 text-romantic-gold" />
            <span className="text-sm font-medium text-romantic-gold">Limited Slots — Book Fast</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">Our Most Loved Packages</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">Hand-picked packages to turn your wedding memories into timeless art. Click any card to view the gallery and quick book.</p>
        </div>

        {/* grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogueItems.map((item, idx) => (
            <motion.article
              key={item.name + idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="relative bg-gradient-to-br from-white to-white/80 rounded-2xl p-4 shadow-lg hover:shadow-2xl border border-white/60 transform transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              onClick={() => { setSelectedItem(item); setActiveImageIndex(0); }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') { setSelectedItem(item); setActiveImageIndex(0); } }}
              aria-label={`Open ${item.name} gallery`}
            >
              <div className="flex items-start gap-4">
                <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-white/5 shadow-inner">
                  <img src={resolveImageUrl(item.image)} alt={item.name} onError={onImgError} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-foreground">{item.name}</h3>
                    <span className="text-sm font-semibold bg-romantic-gold/10 text-romantic-gold px-3 py-1 rounded-lg">{item.price}</span>
                  </div>

                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.description}</p>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <Star className="w-4 h-4 text-yellow-400" />
                      <Star className="w-4 h-4 text-yellow-400" />
                      <Star className="w-4 h-4 text-yellow-400" />
                      <Star className="w-4 h-4 text-yellow-400" />
                    </div>

                    <span className="text-xs text-muted-foreground">Trusted by couples • 4.9/5</span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); openWhatsApp(item); }}
                      className="inline-flex items-center gap-2 py-2 px-3 rounded-full bg-romantic-purple text-white text-sm shadow-md hover:scale-105 transition-transform"
                      aria-label={`Book ${item.name} on WhatsApp`}
                    >
                      Book on WhatsApp
                    </button>

                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedItem(item); setActiveImageIndex(0); }}
                      className="py-2 px-3 rounded-full border border-border text-sm hover:bg-white/50 transition"
                      aria-label={`View ${item.name} gallery`}
                    >
                      View Gallery
                    </button>
                  </div>
                </div>
              </div>

              {/* decorative ribbon */}
              <div className="absolute -top-3 left-3 bg-romantic-pink text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">Popular</div>
            </motion.article>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <motion.div initial={{ scale: 0.98 }} animate={{ scale: 1 }} exit={{ scale: 0.98 }} className="bg-white rounded-2xl max-w-6xl w-full max-h-[92vh] overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{selectedItem.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedItem.price} • {selectedItem.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a href={generateWhatsAppLink(selectedItem.name, selectedItem.price)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 py-2 px-3 bg-romantic-purple text-white rounded-lg text-sm">Contact on WhatsApp</a>
                    <button onClick={() => setSelectedItem(null)} className="p-2 rounded-md hover:bg-gray-100" aria-label="Close gallery"><X className="w-5 h-5" /></button>
                  </div>
                </div>

                <div className="p-4 flex flex-col lg:flex-row gap-4">
                  <div className="lg:flex-1">
                    <div className="rounded-lg overflow-hidden bg-gray-100 h-[420px] flex items-center justify-center">
                      <img src={resolveImageUrl(selectedItem.galleryImages[activeImageIndex])} alt={`${selectedItem.name} ${activeImageIndex + 1}`} className="max-h-full max-w-full object-contain" onError={onImgError} />
                    </div>

                    <div className="mt-3 grid grid-cols-6 gap-2">
                      {selectedItem.galleryImages.map((f, i) => (
                        <button key={f + i} onClick={() => setActiveImageIndex(i)} className={`h-20 rounded-lg overflow-hidden border ${i === activeImageIndex ? 'ring-2 ring-romantic-gold' : 'border-transparent'}`}>
                          <img src={resolveImageUrl(f)} alt={`thumb-${i}`} className="w-full h-full object-cover" onError={onImgError} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <aside className="lg:w-80">
                    <div className="bg-white rounded-xl p-4 shadow-inner border">
                      <h4 className="font-semibold">What's included</h4>
                      <ul className="mt-3 text-sm text-muted-foreground space-y-2">
                        <li>• Professional photographers & assistants</li>
                        <li>• High-resolution edited photos</li>
                        <li>• Quick turnaround (2–3 weeks)</li>
                        <li>• Premium album (where applicable)</li>
                      </ul>

                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground">Want to confirm availability?</p>
                        <div className="mt-3 flex gap-2">
                          <a href={generateWhatsAppLink(selectedItem.name, selectedItem.price)} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center py-2 px-3 bg-romantic-gold text-foreground rounded-lg font-semibold">Enquire on WhatsApp</a>
                          <button onClick={() => { navigator.clipboard?.writeText(selectedItem.price); }} className="py-2 px-3 border rounded-lg">Copy Price</button>
                        </div>
                      </div>

                      <div className="mt-5 text-center">
                        <p className="text-xs text-muted-foreground">Don't miss out — limited slots</p>
                      </div>
                    </div>
                  </aside>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* floating CTA */}
      <div className="fixed right-6 bottom-6 z-40">
        <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi, I want to book a slot')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-4 py-3 rounded-full bg-romantic-green text-white shadow-2xl hover:scale-105 transition-transform">
          <Sparkles className="w-5 h-5" />
          Book Now
        </a>
      </div>

    </section>
  );
};

export default PricingSection;
