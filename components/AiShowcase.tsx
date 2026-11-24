"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import screens from "@/lib/screens.json";
import { useOnScreen } from "./Tonia";
import { Doodle } from "./Doodles";
import { cueGuide } from "@/lib/guide";
import styles from "./AiShowcase.module.css";

type Frame = { src: keyof typeof screens; alt: string };

function Screen({ frame }: { frame: Frame }) {
  const [w, h] = screens[frame.src];
  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.img
        key={frame.src}
        src={`/screens/${frame.src}.webp`}
        alt={frame.alt}
        width={w}
        height={h}
        className={styles.shot}
        initial={{ opacity: 0, scale: 1.015 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      />
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------ AI Plot */
const PLOT: { label: string; caption: string; frame: Frame }[] = [
  {
    label: "Before",
    caption: "Circle the handwritten problem and ask.",
    frame: {
      src: "ai-before",
      alt: "A handwritten quadratic f(x) = x² − 4x + 3 circled on lined paper, with the AI assistant open beside it.",
    },
  },
  {
    label: "After",
    caption: "Etonia writes the steps and plots the curve on your page.",
    frame: {
      src: "ai-after",
      alt: "Etonia has written the factoring and vertex steps in handwriting and plotted the parabola with roots (1, 0), (3, 0) and minimum (2, −1).",
    },
  },
];

export function AiPlot() {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  const [ref, visible] = useOnScreen<HTMLDivElement>("-120px");

  useEffect(() => {
    if (!visible || hold) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % PLOT.length), 4200);
    return () => window.clearInterval(t);
  }, [visible, hold]);

  useEffect(() => {
    if (!visible) return;
    cueGuide(
      i === 0
        ? { section: "ai-plot", say: "Step 1: circle the problem. Hmm… x² − 4x + 3? Let me think.", loop: "think" }
        : { section: "ai-plot", say: "Ta-da! The steps and the curve, right on your page.", loop: "write", hop: true },
    );
  }, [i, visible]);

  return (
    <div ref={ref} className={styles.plot}>
      <div className={styles.tabs} role="tablist" aria-label="AI Plot, before and after">
        {PLOT.map((p, n) => (
          <button
            key={p.label}
            role="tab"
            aria-selected={i === n}
            className={styles.tab}
            onClick={() => {
              setI(n);
              setHold(true);
            }}
          >
            {i === n && (
              <motion.span layoutId="plot-pill" className={styles.pill} transition={{ type: "spring", stiffness: 500, damping: 38 }} />
            )}
            <span className={styles.tabNum}>{n + 1}</span>
            <span>
              <strong>{p.label}</strong>
              <small>{p.caption}</small>
            </span>
          </button>
        ))}
      </div>

      <div className={styles.device}>
        <Screen frame={PLOT[i].frame} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------- Linked reading */
const STEPS = [
  {
    title: "Factoring & roots",
    cue: "Paragraph one: see the roots glow on the graph?",
    body: "Reading paragraph one lights up (x − 1)(x − 3) = 0 and the roots (1, 0) and (3, 0) on your graph.",
    frame: { src: "ai-step-1", alt: "Paragraph one is highlighted and the factored equation and roots glow yellow on the note." } as Frame,
  },
  {
    title: "Vertex & minimum",
    cue: "Now the vertex lights up. Keep scrolling!",
    body: "Move on, and the completed square (x − 2)² − 1 and the minimum (2, −1) take their turn.",
    frame: { src: "ai-step-2", alt: "Paragraph two is highlighted and the completed-square step and the vertex (2, −1) glow on the note." } as Frame,
  },
  {
    title: "The whole curve",
    cue: "And the whole parabola. Every sentence points at real ink!",
    body: "Finally the parabola y = x² − 4x + 3 and its axes, so every sentence points at real ink.",
    frame: { src: "ai-step-3", alt: "Paragraph three is highlighted and the plotted parabola and axes glow on the note." } as Frame,
  },
];

export function LinkedReading() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    // the paragraph nearest the middle of the screen is the one being read
    let raf = 0;
    const pick = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mid = window.innerHeight / 2;
        let best = 0;
        let dist = Infinity;
        refs.current.forEach((el, n) => {
          if (!el) return;
          const r = el.getBoundingClientRect();
          const d = Math.abs(r.top + r.height / 2 - mid);
          if (d < dist) {
            dist = d;
            best = n;
          }
        });
        setActive((prev) => {
          if (prev !== best && window.scrollY > 0) {
            cueGuide({ section: "linked-reading", say: STEPS[best].cue, loop: best === 2 ? "hop" : "look_around" });
          }
          return best;
        });
      });
    };
    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, []);

  return (
    <div className={styles.linked}>
      <ol className={styles.steps}>
        {STEPS.map((s, n) => (
          <li
            key={s.title}
            data-i={n}
            ref={(el) => {
              refs.current[n] = el;
            }}
            className={styles.step}
            data-active={active === n}
            onClick={() => setActive(n)}
          >
            <span className={styles.stepNum}>{n + 1}</span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>
      <div className={styles.stickyCol}>
        <div className={styles.sticky}>
          <div className={styles.device}>
            <Screen frame={STEPS[active].frame} />
          </div>
          <Doodle kind="arrow" className={styles.arrow} />
        </div>
      </div>
    </div>
  );
}
