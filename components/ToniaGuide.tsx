"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GuideCue } from "@/lib/guide";
import { Tonia, loopDurationMs, useReducedMotion, type ToniaLoop } from "./Tonia";
import { Doodle, type DoodleKind } from "./Doodles";
import styles from "./ToniaGuide.module.css";

type Stop = {
  id: string;
  /** Where she stands, as a share of the screen width (0 = left edge, 1 = right edge). */
  at: number;
  loop: ToniaLoop;
  lines: string[];
  /** What she says while walking here. */
  onTheWay?: string;
  next?: string;
  nextLabel?: string;
};

/**
 * Tonia's tour. She starts in the home section and walks along the bottom of
 * the screen from stop to stop as the reader scrolls. Sections opt in with
 * data-guide="<id>".
 */
const TOUR: Stop[] = [
  {
    id: "hero",
    at: 0.8,
    loop: "look_around",
    lines: [
      "Hi, I'm Tonia! Scroll down and I'll show you around.",
      "I'm a sheet of paper with a pencil. Tap me again!",
      "Hehe, that tickles!",
    ],
    next: "ai-plot",
    nextLabel: "Start the tour",
  },
  {
    id: "ai-plot",
    at: 0.86,
    loop: "think",
    onTheWay: "Follow me!",
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
    at: 0.1,
    loop: "look_around",
    onTheWay: "This way, this way!",
    lines: [
      "Scroll slowly here… each paragraph I write lights up the ink it's talking about.",
      "No more hunting for which step I mean. It glows yellow!",
    ],
    next: "study-desk",
    nextLabel: "Next stop",
  },
  {
    id: "study-desk",
    at: 0.84,
    loop: "attend",
    onTheWay: "Off to my desk…",
    lines: [
      "Welcome to my desk! Every class is a folder. Tap the tabs on the class page.",
      "I teach one small step at a time, and I always show which page I got it from.",
    ],
    next: "free",
    nextLabel: "Next stop",
  },
  {
    id: "free",
    at: 0.12,
    loop: "pen_spin",
    onTheWay: "Ooh, the best part is next!",
    lines: [
      "Every notebook feature is free. No ads. Pinky promise.",
      "Pens, paper, shapes, sticky notes, PDFs, audio, export… all of it, free.",
    ],
    next: "switch",
    nextLabel: "Next stop",
  },
  {
    id: "switch",
    at: 0.8,
    loop: "look_around",
    onTheWay: "Coming through!",
    lines: [
      "Moving from Goodnotes? I'll carry your old notebooks over from Google Drive.",
      "Your notes live on your device. Backups go to your own Drive or iCloud.",
    ],
    next: "plans",
    nextLabel: "Next stop",
  },
  {
    id: "plans",
    at: 0.16,
    loop: "think",
    onTheWay: "Almost there…",
    lines: [
      "Notes stay free forever. Plans only give me more AI brainpower.",
      "Sign in and you get two weeks of unlimited Haiku and Luna to try me out.",
    ],
    next: "waitlist",
    nextLabel: "Last stop!",
  },
  {
    id: "waitlist",
    at: 0.5,
    loop: "attend",
    onTheWay: "Last stop!",
    lines: [
      "That's the tour! Leave your email and I'll write to you when Etonia opens.",
      "I'll be waiting right here with my pencil.",
    ],
  },
];

const BY_ID = Object.fromEntries(TOUR.map((s) => [s.id, s]));

/**
 * She never glides: she travels only while her walk loop plays, one fixed
 * step per sprite frame, so every step lands with a frame of the walk.
 */
const WALK_FPS = 16;
const STEP_OF_WIDTH = 0.11; // per frame, as a share of her width
const MARGIN = 10;

const BURST: DoodleKind[] = ["heart", "star", "sprout", "sparkle", "heart", "star"];
type Burst = { id: number; items: { kind: DoodleKind; x: number; y: number; r: number }[] };

function currentSection(): string | null {
  const mid = window.innerHeight * 0.45;
  let found: string | null = null;
  document.querySelectorAll<HTMLElement>("[data-guide]").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top <= mid && r.bottom > mid) found = el.dataset.guide ?? null;
  });
  // below the last stop (the footer) she stays where she is
  return found;
}

export function ToniaGuide() {
  const reduced = useReducedMotion();
  const [section, setSection] = useState<string | null>(null);
  const [x, setX] = useState<number | null>(null);
  const [loop, setLoop] = useState<ToniaLoop>("look_around");
  const [walking, setWalking] = useState(false);
  const [flip, setFlip] = useState(false);
  const [say, setSay] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [vw, setVw] = useState(0);
  const tip = useRef(0);
  const timers = useRef<number[]>([]);
  const walkTimer = useRef<number | undefined>(undefined);
  const xRef = useRef<number | null>(null);
  const stopRef = useRef<Stop | undefined>(undefined);
  const walkingRef = useRef(false);
  const guideRef = useRef<HTMLDivElement>(null);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  const clearLater = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };

  const width = () => guideRef.current?.offsetWidth ?? 140;
  const spotFor = (stop: Stop) => {
    const w = width();
    const max = window.innerWidth - w - MARGIN;
    return Math.round(Math.min(max, Math.max(MARGIN, stop.at * window.innerWidth - w / 2)));
  };

  const place = (px: number) => {
    xRef.current = px;
    setX(px);
  };

  /** Walk to `target` (px from the left), one step per walk frame, then `done`. */
  const walkTo = useCallback(
    (target: number, done: () => void) => {
      window.clearInterval(walkTimer.current);
      const from = xRef.current ?? target;
      if (reduced || from === target) {
        place(target);
        walkingRef.current = false;
        setWalking(false);
        done();
        return;
      }
      const step = Math.max(4, Math.round(width() * STEP_OF_WIDTH));
      const right = target > from;
      setFlip(!right); // her sprites face right
      setLoop("walk");
      walkingRef.current = true;
      setWalking(true);
      walkTimer.current = window.setInterval(() => {
        const cur = xRef.current ?? from;
        const next = right ? Math.min(target, cur + step) : Math.max(target, cur - step);
        place(next);
        if (next === target) {
          window.clearInterval(walkTimer.current);
          walkingRef.current = false;
          setWalking(false);
          setFlip(false);
          done();
        }
      }, 1000 / WALK_FPS);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reduced],
  );

  // which section is being read
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const s = currentSection();
        if (s) setSection(s);
        setVw(window.innerWidth);
      });
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
  stopRef.current = stop;
  const visible = x !== null && Boolean(stop);

  /** Now and then, while you read, she strolls a few steps and looks around. */
  const scheduleStroll = useCallback(() => {
    later(
      () => {
        const s = stopRef.current;
        if (!s || walkingRef.current || reduced) return;
        const home = spotFor(s);
        const w = width();
        const max = window.innerWidth - w - MARGIN;
        const cur = xRef.current ?? home;
        let target = home;
        if (Math.abs(cur - home) < 10) {
          const dist = Math.round(w * (0.7 + Math.random() * 0.9)) * (Math.random() < 0.5 ? -1 : 1);
          target = Math.min(max, Math.max(MARGIN, home + dist));
        }
        walkTo(target, () => {
          setLoop("look_around");
          later(() => {
            const now = stopRef.current;
            if (now?.id === s.id && !walkingRef.current) setLoop(s.loop);
            scheduleStroll();
          }, 2200);
        });
      },
      7000 + Math.random() * 5000,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walkTo, reduced]);

  // walk to each new stop
  useEffect(() => {
    if (!stop) return;
    clearLater();
    tip.current = 0;
    const target = spotFor(stop);
    const arrive = () => {
      setLoop(stop.loop);
      setSay(stop.lines[0]);
      scheduleStroll();
    };
    if (xRef.current === null) {
      // first appearance: she is already standing in the home section
      place(target);
      arrive();
      return clearLater;
    }
    setSay(stop.onTheWay ?? null);
    walkTo(target, arrive);
    return clearLater;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stop?.id, walkTo]);

  // keep her on screen after a resize: walk back to her spot
  useEffect(() => {
    const s = stopRef.current;
    if (!s || xRef.current === null || walkingRef.current) return;
    const max = window.innerWidth - width() - MARGIN;
    if (xRef.current > max) place(max);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vw]);

  useEffect(() => () => window.clearInterval(walkTimer.current), []);

  const celebrate = useCallback(() => {
    const id = Date.now();
    setBursts((b) => [
      ...b,
      {
        id,
        items: BURST.map((kind, i) => {
          const a = (-160 + (i * 140) / (BURST.length - 1)) * (Math.PI / 180);
          const d = 80 + Math.random() * 50;
          return { kind, x: Math.cos(a) * d, y: Math.sin(a) * d, r: Math.random() * 60 - 30 };
        }),
      },
    ]);
    later(() => setBursts((b) => b.filter((z) => z.id !== id)), 1300);
  }, []);

  const hop = useCallback(
    (then: ToniaLoop) => {
      if (walkingRef.current) return;
      setLoop("hop");
      later(() => {
        if (!walkingRef.current) setLoop(then);
      }, loopDurationMs("hop") * 2);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // cues from the demos on the page
  useEffect(() => {
    const onCue = (e: Event) => {
      const cue = (e as CustomEvent<GuideCue>).detail;
      if (!cue || cue.section !== stopRef.current?.id) return;
      if (cue.say) setSay(cue.say);
      if (walkingRef.current) return;
      if (cue.hop) hop(cue.loop ?? stopRef.current.loop);
      else if (cue.loop) setLoop(cue.loop);
    };
    const onJoined = () => {
      setMuted(false);
      setSay("Yay! You're on the list. I'll write to you soon!");
      celebrate();
      hop(stopRef.current?.loop ?? "attend");
    };
    window.addEventListener("tonia:guide", onCue);
    window.addEventListener("etonia:joined", onJoined);
    return () => {
      window.removeEventListener("tonia:guide", onCue);
      window.removeEventListener("etonia:joined", onJoined);
    };
  }, [hop, celebrate]);

  const poke = () => {
    if (!stop || walkingRef.current) return;
    setMuted(false);
    tip.current = (tip.current + 1) % stop.lines.length;
    setSay(stop.lines[tip.current]);
    celebrate();
    hop(stop.loop);
  };

  const goNext = () => {
    if (!stop?.next) return;
    document.getElementById(stop.next)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  // the bubble opens towards the middle of the screen
  const bubbleSide = x !== null && vw && x + width() / 2 > vw / 2 ? "right" : "left";

  return (
    <div className={styles.layer} aria-live="polite">
      <div
        ref={guideRef}
        className={styles.guide}
        data-side={bubbleSide}
        data-visible={visible}
        style={{ transform: `translateX(${x ?? -400}px)` }}
        aria-hidden={!visible}
      >
        <AnimatePresence mode="wait">
          {visible && say && !muted && (
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
              {stop?.next && !walking && (
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
            loops={["walk", "hop", "think", "look_around", "attend", "pen_spin"]}
            width="100%"
            flip={flip}
          />
        </button>
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
              <Doodle kind={it.kind} size={30} />
            </motion.span>
          )),
        )}
      </div>
    </div>
  );
}
