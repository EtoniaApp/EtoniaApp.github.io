"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Tonia, loopDurationMs, useReducedMotion, type ToniaLoop } from "./Tonia";
import { Doodle, type DoodleKind } from "./Doodles";
import styles from "./ToniaHero.module.css";

const IDLE: ToniaLoop[] = ["look_around", "think", "write", "look_around", "pen_spin"];
const LINES = [
  "Hi, I'm Tonia! Scroll down and I'll show you around.",
  "Circle a problem. I'll plot it.",
  "Psst… notes are free. Forever.",
  "Shall we study together?",
  "Hehe, that tickles!",
  "Remember to take a break ☕",
  "Okay okay, I'm awake!",
];
const BURST: DoodleKind[] = ["heart", "star", "sprout", "sparkle", "heart", "star"];

type Burst = { id: number; items: { kind: DoodleKind; x: number; y: number; r: number }[] };

export function ToniaHero() {
  const reduced = useReducedMotion();
  const [loop, setLoop] = useState<ToniaLoop>("look_around");
  const [line, setLine] = useState<string | null>(null);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const pokes = useRef(0);
  const busy = useRef(false);
  const idleStep = useRef(0);
  const lineTimer = useRef<number | undefined>(undefined);

  // idle routine: each idle loop plays twice, then the next
  useEffect(() => {
    if (reduced) return;
    const t = window.setInterval(() => {
      if (busy.current) return;
      idleStep.current = (idleStep.current + 1) % IDLE.length;
      setLoop(IDLE[idleStep.current]);
    }, 3200);
    return () => window.clearInterval(t);
  }, [reduced]);

  // say hello once she's on screen
  useEffect(() => {
    const t = window.setTimeout(() => say(LINES[0]), 900);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const say = useCallback((text: string) => {
    setLine(text);
    window.clearTimeout(lineTimer.current);
    lineTimer.current = window.setTimeout(() => setLine(null), 4200);
  }, []);

  const poke = useCallback(() => {
    pokes.current += 1;
    busy.current = true;
    setLoop("hop");
    const n = pokes.current;
    say(n >= 6 && n % 6 === 0 ? LINES[6] : LINES[1 + ((n - 1) % 5)]);
    const id = Date.now();
    setBursts((b) => [
      ...b,
      {
        id,
        items: BURST.map((kind, i) => {
          const a = (-150 + (i * 120) / (BURST.length - 1)) * (Math.PI / 180);
          const d = 110 + Math.random() * 60;
          return { kind, x: Math.cos(a) * d, y: Math.sin(a) * d, r: Math.random() * 60 - 30 };
        }),
      },
    ]);
    window.setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 1400);
    window.setTimeout(() => {
      busy.current = false;
      setLoop("look_around");
    }, loopDurationMs("hop") * 2);
  }, [say]);

  return (
    <div className={styles.stage}>
      <div className={styles.blob} aria-hidden />
      <div className={styles.doodles} aria-hidden>
        <Doodle kind="star" className={styles.d1} />
        <Doodle kind="sprout" className={styles.d2} />
        <Doodle kind="squiggle" className={styles.d3} />
        <Doodle kind="pencil" className={styles.d4} />
        <Doodle kind="heart" className={styles.d5} />
        <Doodle kind="sparkle" className={styles.d6} />
      </div>

      <button
        type="button"
        className={styles.tonia}
        onClick={poke}
        onPointerEnter={() => {
          if (!busy.current) setLoop("hop");
        }}
        onPointerLeave={() => {
          if (!busy.current) setLoop("look_around");
        }}
        aria-label="Tonia, Etonia's paper mascot. Tap her to say hi."
      >
        <Tonia loop={loop} loops={["look_around", "think", "write", "hop", "pen_spin"]} width="100%" />
      </button>
      <div className={styles.shadow} aria-hidden />

      <AnimatePresence>
        {line && (
          <motion.div
            key={line}
            className={styles.bubble}
            role="status"
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -6 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
          >
            {line}
          </motion.div>
        )}
      </AnimatePresence>

      {bursts.map((b) =>
        b.items.map((it, i) => (
          <motion.span
            key={`${b.id}-${i}`}
            className={styles.burst}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0.3, rotate: 0 }}
            animate={{ opacity: 0, x: it.x, y: it.y, scale: 1, rotate: it.r }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden
          >
            <Doodle kind={it.kind} />
          </motion.span>
        )),
      )}
    </div>
  );
}
