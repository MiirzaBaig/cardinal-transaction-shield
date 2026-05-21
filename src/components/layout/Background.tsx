import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

export function PageBackground() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  // Subtle parallax: background drifts at 0.3× scroll speed
  const yParallax = useTransform(scrollY, [0, 1200], [0, -180]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={reduce ? undefined : { y: yParallax }}
    >
      {/* Drifting dot grid */}
      <motion.div
        className="absolute inset-0 grid-bg opacity-70"
        animate={reduce ? undefined : { backgroundPosition: ["0px 0px", "14px 14px"] }}
        transition={
          reduce ? undefined : { duration: 60, ease: "linear", repeat: Infinity }
        }
      />

      {/* Violet bloom — top center */}
      <motion.div
        className="absolute -top-40 left-1/2 h-[620px] w-[1100px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(139,92,246,0.26), rgba(99,102,241,0.06) 55%, transparent 75%)",
          willChange: "transform, opacity",
        }}
        animate={
          reduce
            ? undefined
            : { x: [-40, 40, -40], opacity: [0.55, 0.85, 0.55] }
        }
        transition={
          reduce ? undefined : { duration: 18, ease: "easeInOut", repeat: Infinity }
        }
      />

      {/* Indigo drift — left */}
      <motion.div
        className="absolute top-[18%] left-[-220px] h-[520px] w-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(99,102,241,0.18), transparent 70%)",
          willChange: "transform, opacity",
        }}
        animate={
          reduce
            ? undefined
            : { x: [0, 60, 0], y: [0, -40, 0], opacity: [0.45, 0.7, 0.45] }
        }
        transition={
          reduce ? undefined : { duration: 26, ease: "easeInOut", repeat: Infinity }
        }
      />

      {/* Cyan whisper — bottom right */}
      <motion.div
        className="absolute bottom-[-220px] right-[-220px] h-[640px] w-[640px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(6,182,212,0.14), transparent 70%)",
          willChange: "transform, opacity",
        }}
        animate={
          reduce
            ? undefined
            : { x: [0, -80, 0], y: [0, -30, 0], opacity: [0.35, 0.6, 0.35] }
        }
        transition={
          reduce ? undefined : { duration: 34, ease: "easeInOut", repeat: Infinity }
        }
      />

      {/* Static film-grain noise — 2% opacity, GPU-cheap */}
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "160px 160px",
        }}
      />
    </motion.div>
  );
}