import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Global lightweight loader: shows a brief liquid spinner on any
 * button / link / icon tap, then auto-dismisses.
 */
export function TapLoader() {
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const hit = target.closest(
        'button, a, [role="button"], [role="link"], input[type="submit"], input[type="button"], label'
      );
      if (!hit) return;
      // Skip range/checkbox/text inputs and toggles inside forms that shouldn't trigger
      if ((hit as HTMLElement).hasAttribute("data-no-tap-loader")) return;

      if (timer.current) clearTimeout(timer.current);
      setVisible(true);
      timer.current = setTimeout(() => setVisible(false), 650);
    };
    document.addEventListener("click", handler, true);
    return () => {
      document.removeEventListener("click", handler, true);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="tap-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-background/30" />
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full liquid-bg animate-blob shadow-glow-coral opacity-90" />
            <div
              className="absolute inset-2 rounded-full liquid-bg animate-blob opacity-70"
              style={{ animationDelay: "-2s", animationDuration: "6s" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-white/70 border-t-transparent animate-spin" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}