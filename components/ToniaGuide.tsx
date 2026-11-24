"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GuideCue } from "@/lib/guide";
import { Tonia, loopDurationMs, useReducedMotion, type ToniaLoop } from "./Tonia";
import styles from "./ToniaGuide.module.css";

type Stop = {
  id: string;
  side: "left" | "right";
  loop: ToniaLoop;
  lines: string[];
  next?: string;
  nextLabel?: string;
};

/** Tonia's tour. Order matches the page; hero and waitlist have their own Tonia. */
const TOUR: Stop[] = [
  {
    id: "ai-plot",
    side: "right",
    loop: "think",
    lines: [
      "First stop: my favourite trick! Circle any handwritten problem and I'll solve it on your page.",
      "See the graph? I draw the axes, the roots and the vertex, right next to your work.",
      "I even write the steps in handwriting that looks like yours.",
    ],
    next: "linked-reading",
    nextLabel: "Show me more",
  },
  {
    id: "linked-reading",
    side: "left",
    loop: "look_around",
    lines: [
      "Scroll slowly here… each paragraph I write lights up the ink it's talking about.",
      "No more hunting for which step I mean. It glows yellow!",
    ],
    next: "study-desk",
    nextLabel: "Next stop",
  },
  {
    id: "study-desk",
    side: "right",
    loop: "attend",
    lines: [
      "Welcome to my desk! Every class is a folder. Tap the tabs on the class page.",
      "I teach one small step at a time, and I always show which page I got it from.",
    ],
    next: "free",
    nextLabel: "Next stop",
  },
  {
    id: "free",
    side: "left",
    loop: "pen_spin",
    lines: [
      "Here's the best part: every notebook feature is free. No ads. Pinky promise.",
      "Pens, paper, shapes, sticky notes, PDFs, audio, export… all of it, free.",
    ],
    next: "switch",
    nextLabel: "Next stop",
  },
  {
    id: "switch",
    side: "right",
    loop: "look_around",
    lines: [
      "Moving from Goodnotes? I'll carry your old notebooks over from Google Drive.",
      "Your notes live on your device. Backups go to your own Drive or iCloud.",
    ],
    next: "plans",
    nextLabel: "Next stop",
  },
  {
    id: "plans",
    side: "left",
    loop: "think",
    lines: [
      "Notes stay free forever. Plans only give me more AI brainpower.",
      "Sign in and you get two weeks of unlimited Haiku and Luna to try me out.",
    ],
    next: "waitlist",
    nextLabel: "Last stop!",
  },
];

const BY_ID = Object.fromEntries(TOUR.map((s) => [s.id, s]));

/**
 * Tonia never glides. She travels only while her walk loop plays, moving one
 * fixed step per sprite frame (12 fps), so each step lands with a frame.
 * Changing sides = walking off one edge and walking in from the other.
 */
const WALK_FPS = 12;
const STEP_OF_WIDTH = 0.09; // distance per frame, as a share of her width

function currentSection(): string | null {
  const mid = window.innerHeight * 0.45;
  let found: string | null = null;
  document.querySelectorAll<HTMLElement>("[data-guide]").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top <= mid && r.bottom > mid) found = el.dataset.guide ?? null;
  });
  return found;
}

export function ToniaGuide() {
  const reduced = useReducedMotion();
  const [section, setSection] = useState<string | null>(null);
  const [side, setSide] = useState<"left" | "right">("right");
  /** How far she is from her spot, towards her edge, in px. */
  const [out, setOut] = useState(10_000);
  const [loop, setLoop] = useState<ToniaLoop>("walk");
  const [walking, setWalking] = useState(false);
  const [flip, setFlip] = useState(false);
  const [say, setSay] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const tip = useRef(0);
  const timers = useRef<number[]>([]);
  const walkTimer = useRef<number | undefined>(undefined);
  const outRef = useRef(out);
  const sideRef = useRef(side);
  const sectionRef = useRef(section);
  const guideRef = useRef<HTMLDivElement>(null);
  sectionRef.current = section;

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  const stopAll = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    window.clearInterval(walkTimer.current);
  };

  const width = () => guideRef.current?.offsetWidth ?? 132;
  /** Far enough out that she is fully off screen. */
  const offscreen = () => width() + 40;

  const place = (px: number) => {
    outRef.current = px;
    setOut(px);
  };

  /** Walk from where she is to `target` (px from her spot), one step per frame. */
  const walkTo = useCallback(
    (target: number, done: () => void) => {
      window.clearInterval(walkTimer.current);
      if (reduced) {
        place(target);
        done();
        return;
      }
      const step = Math.max(4, Math.round(width() * STEP_OF_WIDTH));
      const outward = target > outRef.current;
      // facing: sprites face right; flip when her motion on screen is leftwards
      const movingRight = (sideRef.current === "right") === outward;
      setFlip(!movingRight);
      setLoop("walk");
      setWalking(true);
      walkTimer.current = window.setInterval(() => {
        const cur = outRef.current;
        const next = outward ? Math.min(target, cur + step) : Math.max(target, cur - step);
        place(next);
        if (next === target) {
          window.clearInterval(walkTimer.current);
          setWalking(false);
          setFlip(false);
          done();
        }
      }, 1000 / WALK_FPS);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reduced],
  );

  // start hidden, just past her edge
  useEffect(() => {
    place(offscreen());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // which section is being read
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setSection(currentSection()));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);

  const stop = section ? BY_ID[section] : undefined;
  const visible = Boolean(stop);

  // walk to the new stop: off her edge, round to the other side if needed, and in again
  useEffect(() => {
    stopAll();
    setSay(null);
    tip.current = 0;
    if (!stop) {
      walkTo(offscreen(), () => setLoop("look_around"));
      return stopAll;
    }
    const arrive = () => {
      setLoop(stop.loop);
      setSay(stop.lines[0]);
    };
    const walkIn = () => walkTo(0, arrive);
    if (stop.side !== sideRef.current) {
      walkTo(offscreen(), () => {
        sideRef.current = stop.side;
        setSide(stop.side);
        walkIn();
      });
    } else if (outRef.current !== 0) {
      walkIn();
    } else {
      arrive();
    }
    return stopAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stop?.id, walkTo]);

  const hop = useCallback((then: ToniaLoop) => {
    setLoop("hop");
    later(() => setLoop(then), loopDurationMs("hop") * 2);
  }, []);

  // cues from the demos (ignored while she is walking)
  useEffect(() => {
    const on = (e: Event) => {
      const cue = (e as CustomEvent<GuideCue>).detail;
      if (!cue || cue.section !== sectionRef.current || outRef.current !== 0) return;
      if (cue.say) setSay(cue.say);
      if (cue.hop) hop(cue.loop ?? BY_ID[cue.section]?.loop ?? "look_around");
      else if (cue.loop) setLoop(cue.loop);
    };
    window.addEventListener("tonia:guide", on);
    return () => window.removeEventListener("tonia:guide", on);
  }, [hop]);

  const poke = () => {
    if (!stop || walking) return;
    setMuted(false);
    tip.current = (tip.current + 1) % stop.lines.length;
    setSay(stop.lines[tip.current]);
    hop(stop.loop);
  };

  const goNext = () => {
    if (!stop?.next) return;
    document.getElementById(stop.next)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  const shift = side === "right" ? out : -out;
  const docked = out === 0;

  return (
    <div className={styles.layer} aria-live="polite">
      <div
        ref={guideRef}
        className={styles.guide}
        data-side={side}
        style={{ transform: `translateX(${shift}px)` }}
        aria-hidden={!visible}
      >
        <AnimatePresence mode="wait">
          {visible && docked && say && !walking && !muted && (
            <motion.div
              key={say}
              className={styles.bubble}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.12 } }}
              transition={{ type: "spring", stiffness: 420, damping: 24 }}
            >
              <button type="button" className={styles.close} onClick={() => setMuted(true)} aria-label="Hide Tonia's tip">
                ×
              </button>
              <p>{say}</p>
              {stop?.next && (
                <button type="button" className={styles.next} onClick={goNext}>
                  {stop.nextLabel ?? "Next"} <span aria-hidden>→</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          className={styles.tonia}
          onClick={poke}
          aria-label="Tonia, your guide. Tap her for another tip."
          tabIndex={visible ? 0 : -1}
        >
          <Tonia
            loop={loop}
            loops={["walk", "hop", "think", "look_around", "attend", "pen_spin", "write", "grade"]}
            width="100%"
            flip={flip}
          />
        </button>
      </div>
    </div>
  );
}
