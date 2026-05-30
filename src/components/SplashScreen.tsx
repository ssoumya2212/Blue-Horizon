import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/Logo";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Wait for exit animation to finish
    }, 800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: "var(--gradient-hero)" }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center justify-center gap-6"
          >
            <div className="h-24 w-auto flex items-center justify-center">
              <Logo variant="light" />
            </div>
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
              className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-white/20"
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
                className="h-full w-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
