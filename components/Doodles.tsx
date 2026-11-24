import type { CSSProperties } from "react";

export type DoodleKind = "star" | "heart" | "sprout" | "sparkle" | "squiggle" | "pencil" | "check" | "arrow" | "circle";

type Props = { kind: DoodleKind; className?: string; style?: CSSProperties; size?: number };

const S = {
  fill: "none",
  stroke: "var(--line)",
  strokeWidth: 2.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Small pencil doodles in Tonia's line style: dark rounded outline, flat fills. */
export function Doodle({ kind, className, style, size = 40 }: Props) {
  const common = { width: size, height: size, viewBox: "0 0 40 40", className, style, "aria-hidden": true };
  switch (kind) {
    case "star":
      return (
        <svg {...common}>
          <path
            d="M20 4.5 24.6 14l10.2 1.3-7.5 7.1 2 10.1L20 27.6l-9.3 4.9 2-10.1-7.5-7.1L15.4 14z"
            {...S}
            fill="var(--pencil)"
          />
        </svg>
      );
    case "heart":
      return (
        <svg {...common}>
          <path
            d="M20 33.5S6 25.2 6 15.4C6 10.9 9.4 8 13.1 8c3.1 0 5.4 1.9 6.9 4.6C21.5 9.9 23.8 8 26.9 8 30.6 8 34 10.9 34 15.4c0 9.8-14 18.1-14 18.1Z"
            {...S}
            fill="#f6b8cf"
          />
        </svg>
      );
    case "sprout":
      return (
        <svg {...common}>
          <path d="M20 35V19" {...S} stroke="#3f8a4a" />
          <path d="M20 21c-1-6.5-6-9.8-12.5-9.5.3 6.4 5.4 10.4 12.5 9.5Z" {...S} fill="var(--sprout)" />
          <path d="M20 17.5c.8-5.6 5.2-8.7 11-8.3-.4 5.6-4.7 9.2-11 8.3Z" {...S} fill="var(--sprout)" />
        </svg>
      );
    case "sparkle":
      return (
        <svg {...common}>
          <path d="M20 5c1.2 8.3 6.7 13.8 15 15-8.3 1.2-13.8 6.7-15 15-1.2-8.3-6.7-13.8-15-15C13.3 18.8 18.8 13.3 20 5Z" {...S} fill="#d8c8f5" />
        </svg>
      );
    case "squiggle":
      return (
        <svg {...common} viewBox="0 0 60 24" width={size * 1.5} height={size * 0.6}>
          <path d="M3 14c5-9 9 7 14-1s9 7 14-1 9 7 14-1 7 5 12 0" {...S} stroke="var(--brand)" />
        </svg>
      );
    case "pencil":
      return (
        <svg {...common}>
          <path d="M9.5 30.5 27 13l4.5 4.5L14 35l-6 1.5Z" {...S} fill="var(--pencil)" />
          <path d="m8 36.5 1.5-6 4.5 4.5Z" {...S} fill="var(--fold)" />
          <path d="M27 13c-.5-3 .5-6 3.5-7.5M30.5 5.5c2.5-.5 4.5.5 5.5 2.5-2 1-4.5 1-5.5-2.5Z" {...S} stroke="#3f8a4a" fill="var(--sprout)" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="M8 21.5 16 29 33 10" {...S} stroke="var(--success)" strokeWidth={3} />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common} viewBox="0 0 60 40" width={size * 1.5}>
          <path d="M4 30c14-2 30-8 46-22" {...S} />
          <path d="M40 7.5 50.5 7 49 17.5" {...S} />
        </svg>
      );
    case "circle":
      return (
        <svg {...common} viewBox="0 0 120 60" width={size * 3} height={size * 1.5}>
          <path d="M70 6C38 2 6 12 5 30s36 26 66 24 46-12 44-26C113 13 88 7 58 8" {...S} stroke="var(--brand)" />
        </svg>
      );
  }
}
