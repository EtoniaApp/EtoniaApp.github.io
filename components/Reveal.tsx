"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/** Fades content in once, the first time it is seen (design_language: first look is slow, revisit is still). */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  );
}

/** A hand-drawn underline that draws itself when it scrolls into view. */
export function Scribble({ children, color = "var(--pencil)" }: { children: ReactNode; color?: string }) {
  return (
    <span style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap" }}>
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
      <svg
        viewBox="0 0 200 20"
        preserveAspectRatio="none"
        aria-hidden
        style={{ position: "absolute", left: "-3%", width: "106%", bottom: "-0.05em", height: "0.42em", overflow: "visible" }}
      >
        <motion.path
          d="M3 12 C 40 5, 90 4, 130 8 S 185 14, 197 7"
          fill="none"
          stroke={color}
          strokeWidth={9}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
        />
      </svg>
    </span>
  );
}
