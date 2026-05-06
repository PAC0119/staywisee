import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hotel, Utensils, MapPin, TrainFront, Briefcase, Sparkles } from "lucide-react";

const messages = [
  "Reading your travel purpose…",
  "Comparing stay types…",
  "Checking food and comfort needs…",
  "Mapping nearby food streets…",
  "Building your smart stay plan…",
];

const icons = [Hotel, Utensils, MapPin, TrainFront, Briefcase, Sparkles];

export function LiquidLoader({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStep((s) => s + 1), 900);
    const finish = setTimeout(onDone, 4500);
    return () => {
      clearInterval(t);
      clearTimeout(finish);
    };
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/90 backdrop-blur-xl"
      style={{ backgroundColor: "oklch(0.18 0.04 260 / 0.92)" }}
    >
      <div className="relative w-[340px] max-w-[90vw] flex flex-col items-center">
        {/* Liquid orb */}
        <div className="relative w-56 h-56 mb-8">
          <div className="absolute inset-0 liquid-bg animate-blob shadow-glow-coral" />
          <div className="absolute inset-3 liquid-bg animate-blob opacity-80"
               style={{ animationDelay: "-3s", animationDuration: "10s" }} />
          {/* floating icons inside */}
          {icons.map((Icon, i) => (
            <motion.div
              key={i}
              className="absolute text-white/90"
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{
                x: [0, Math.cos((i / 6) * Math.PI * 2) * 60, 0],
                y: [0, Math.sin((i / 6) * Math.PI * 2) * 60, 0],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 3.2, repeat: Infinity, delay: i * 0.35 }}
              style={{ top: "50%", left: "50%", marginLeft: -12, marginTop: -12 }}
            >
              <Icon className="w-6 h-6" />
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="text-white text-lg font-medium text-center font-display"
          >
            {messages[Math.min(step, messages.length - 1)]}
          </motion.p>
        </AnimatePresence>

        <div className="mt-6 h-1 w-full rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full liquid-bg"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 4.5, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
