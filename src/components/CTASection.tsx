import React from "react";
import { motion } from "framer-motion";
import { Phone, MessageCircle, Sparkles } from "lucide-react";

/**
 * CTASection — named export AND default export
 * Uses your number: +91 90094 76587
 * Email: tarun1682verma@gmail.com
 * Instagram: patel_photography_0327
 */
export const CTASection: React.FC = () => {
  const PHONE = "+919009476587";
  const WA_NUMBER = "919009476587";
  const WA_TEXT = encodeURIComponent("Hi! I want to book a slot.");
  const contactPath =
    typeof window !== "undefined" ? `${window.location.origin}/contact.html` : "/contact.html";

  const openLink = (url: string, newTab = false) => {
    try {
      if (newTab) {
        const w = window.open(url, "_blank", "noopener,noreferrer");
        if (w) return;
      } else {
        window.location.href = url;
        return;
      }
    } catch {}
    try {
      window.location.assign(url);
      return;
    } catch {}
    try {
      const ifr = document.createElement("iframe");
      ifr.style.display = "none";
      ifr.src = url;
      document.body.appendChild(ifr);
      setTimeout(() => {
        try {
          document.body.removeChild(ifr);
        } catch {}
      }, 1000);
    } catch {}
  };

  const handleCall = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openLink(`tel:${PHONE}`, false);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openLink(`https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`, true);
  };

  const handleContactPage = (e: React.MouseEvent, newTab = false) => {
    e.preventDefault();
    e.stopPropagation();
    openLink(contactPath, newTab);
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-romantic-purple via-romantic-pink to-romantic-gold relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10 pointer-events-none"
            style={{
              width: Math.random() * 90 + 30,
              height: Math.random() * 90 + 30,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `translate(-50%, -50%)`,
            }}
            animate={{
              y: [0, -30 - Math.random() * 20, 0],
              opacity: [0.15, 0.55, 0.15],
              scale: [1, 1.15 + Math.random() * 0.1, 1],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-8"
          >
            <Sparkles className="w-20 h-20 text-white" />
          </motion.div>

          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight"
          >
            Don't Wait.
            <br />
            Turn Your Love Into Memories.
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="font-body text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto"
          >
            Limited slots available. Book now and get all premium gifts absolutely free!
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center relative z-20"
          >
            <button
              onClick={handleCall}
              aria-label="Call now"
              className="inline-flex items-center gap-3 px-10 h-16 text-lg font-semibold rounded-2xl
                         bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 text-white
                         shadow-[0_10px_30px_rgba(255,92,133,0.18)] hover:scale-105 active:scale-95
                         transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-rose-200"
            >
              <Phone className="w-6 h-6" />
              Call Now
            </button>

            <button
              onClick={handleWhatsApp}
              aria-label="WhatsApp book"
              className="inline-flex items-center gap-3 px-10 h-16 text-lg font-semibold rounded-2xl
                         bg-gradient-to-r from-green-400 via-emerald-500 to-lime-400 text-white
                         shadow-[0_10px_30px_rgba(56,189,130,0.18)] hover:scale-105 active:scale-95
                         transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-green-200"
            >
              <MessageCircle className="w-6 h-6" />
              WhatsApp Book
            </button>

            
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-12 glass-dark p-8 rounded-2xl inline-block"
          >
            <p className="font-cursive text-3xl text-white mb-2">Today Only Special Offer</p>
            <p className="font-body text-lg text-white/80">Free Frame on Any Booking! 🎁</p>
          </motion.div>

          {/* ---- FOOTER SECTION ---- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.75 }}
            className="mt-12 w-full flex flex-col items-center"
          >
            <div className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20">
              <h3 className="text-white text-2xl font-semibold mb-6 text-center">
                Contact & Social Links
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white/90 text-center">
                <div>
                  <p className="text-lg font-medium">Email</p>
                  <a
                    href="mailto:tarun1682verma@gmail.com"
                    className="text-white hover:underline"
                  >
                    Tarun1682verma@gmail.com
                  </a>
                </div>

                <div>
                  <p className="text-lg font-medium">Phone</p>
                  <a
                    href="tel:+919009476587"
                    className="text-white hover:underline"
                  >
                    +91 90094 76587
                  </a>
                </div>

                <div>
                  <p className="text-lg font-medium">Instagram</p>
                 <a
  href="https://instagram.com/patel_photography_0"
  target="_blank"
  rel="noopener noreferrer"
  className="text-white hover:underline"
>
  @patel_photography_0
</a>

                </div>
              </div>

              <p className="text-center text-white/70 mt-6 text-sm">
                © {new Date().getFullYear()} Patel Photography — All Rights Reserved.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
