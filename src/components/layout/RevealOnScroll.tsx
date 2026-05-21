import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { ease, dur } from "@/lib/motion";

type Variant = "fade" | "rise" | "riseStagger";

const variants: Record<Variant, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: dur.lg, ease: ease.outExpo } },
  },
  rise: {
    hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: dur.lg, ease: ease.outExpo },
    },
  },
  riseStagger: {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  },
};

export const riseChild: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: dur.lg, ease: ease.outExpo },
  },
};

export function RevealOnScroll({
  children,
  variant = "rise",
  className,
  amount = 0.25,
  as: As = "div",
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  amount?: number;
  as?: keyof typeof motion;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[As] as typeof motion.div;
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={variants[variant]}
    >
      {children}
    </MotionTag>
  );
}