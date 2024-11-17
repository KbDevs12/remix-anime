import { useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProgressBar() {
  const navigation = useNavigation();
  const [width, setWidth] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (navigation.state === "loading" || navigation.state === "submitting") {
      setIsVisible(true);
      setWidth(0);
      const timer = setInterval(() => {
        setWidth((oldWidth) => {
          if (oldWidth === 90) {
            clearInterval(timer);
            return 90;
          }
          return Math.min(oldWidth + 10, 90);
        });
      }, 100);

      return () => {
        clearInterval(timer);
      };
    } else {
      setWidth(100);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setWidth(0);
      }, 400); // Increased duration for smoother exit

      return () => {
        clearTimeout(timer);
      };
    }
  }, [navigation.state]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-violet-200/30 z-50 overflow-hidden backdrop-blur-sm"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 via-white to-violet-500"
            style={{
              backgroundSize: "200% 100%",
            }}
            initial={{ width: 0 }}
            animate={{
              width: `${width}%`,
              backgroundPosition: ["0% 50%", "100% 50%"],
            }}
            transition={{
              width: {
                duration: 0.2,
                ease: "easeOut",
              },
              backgroundPosition: {
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear",
              },
            }}
          >
            {/* Particle effect */}
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  "radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 50%)",
                  "radial-gradient(circle, transparent 0%, transparent 50%)",
                ],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
