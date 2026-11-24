"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import manifest from "@/lib/tonia-loops.json";

export type ToniaLoop = keyof typeof manifest.loops;

const LOOPS = manifest.loops as Record<ToniaLoop, { frames: number; fps: number }>;

export function loopDurationMs(loop: ToniaLoop): number {
  const { frames, fps } = LOOPS[loop];
  return (frames / fps) * 1000;
}

/** Pauses work while an element is off screen. */
export function useOnScreen<T extends Element>(margin = "120px") {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, visible] as const;
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

function spriteStyle(loop: ToniaLoop, running: boolean): CSSProperties {
  const { frames } = LOOPS[loop];
  return {
    backgroundImage: `url(/tonia/${loop}.webp)`,
    backgroundSize: `${frames * 100}% 100%`,
    animation: `tonia-sprite ${loopDurationMs(loop)}ms steps(${frames}, jump-none) infinite`,
    animationPlayState: running ? "running" : "paused",
  };
}

type ToniaProps = {
  /** The loop currently playing. */
  loop: ToniaLoop;
  /** Every loop this Tonia may switch to; they are stacked so switching never flashes. */
  loops?: ToniaLoop[];
  width?: number | string;
  className?: string;
  style?: CSSProperties;
  label?: string;
  paused?: boolean;
  flip?: boolean;
};

/**
 * Tonia, drawn from the app's own 12 fps animation loops (sprite sheets in
 * /public/tonia, built by scripts/build_assets.py).
 */
export function Tonia({ loop, loops, width = 160, className, style, label, paused, flip }: ToniaProps) {
  const [ref, visible] = useOnScreen<HTMLDivElement>();
  const reduced = useReducedMotion();
  const all = Array.from(new Set([loop, ...(loops ?? [])]));
  const [restart, setRestart] = useState(0);
  const prev = useRef(loop);
  useEffect(() => {
    if (prev.current !== loop) {
      prev.current = loop;
      setRestart((n) => n + 1);
    }
  }, [loop]);

  return (
    <div
      ref={ref}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={className}
      style={{
        position: "relative",
        width,
        aspectRatio: "300 / 353",
        transform: flip ? "scaleX(-1)" : undefined,
        ...style,
      }}
    >
      {all.map((name) => {
        const active = name === loop;
        return (
          <div
            key={active ? `${name}-${restart}` : name}
            className="tonia-sprite"
            style={{
              position: "absolute",
              inset: 0,
              opacity: active ? 1 : 0,
              ...spriteStyle(name, active && visible && !paused && !reduced),
            }}
          />
        );
      })}
    </div>
  );
}
