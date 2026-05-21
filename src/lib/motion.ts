import type { Transition, Variants } from "framer-motion";

// Cardinal motion vocabulary — one source of truth.
export const ease = {
  outExpo: [0.16, 1, 0.3, 1] as [number, number, number, number],
  inOutQuint: [0.83, 0, 0.17, 1] as [number, number, number, number],
};

export const dur = {
  xs: 0.12,
  sm: 0.2,
  md: 0.32,
  lg: 0.52,
  xl: 0.8,
};

export const spring: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 26,
  mass: 0.9,
};

export const fade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: dur.md, ease: ease.outExpo } },
  exit: { opacity: 0, transition: { duration: dur.sm } },
};

export const riseSm: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: dur.md, ease: ease.outExpo } },
  exit: { opacity: 0, y: -4, transition: { duration: dur.sm } },
};

export const riseMd: Variants = {
  initial: { opacity: 0, y: 12, filter: "blur(8px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: dur.lg, ease: ease.outExpo },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(6px)",
    transition: { duration: 0.36, ease: ease.inOutQuint },
  },
};

export const stagger = (delay = 0.04, child = 0): Variants => ({
  animate: {
    transition: { staggerChildren: delay, delayChildren: child },
  },
});