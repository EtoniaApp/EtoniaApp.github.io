import type { ToniaLoop } from "@/components/Tonia";

export type GuideCue = {
  /** Only acted on while the guide is in this section. */
  section: string;
  say?: string;
  loop?: ToniaLoop;
  hop?: boolean;
};

/** Lets any demo on the page tell the guide Tonia what just happened. */
export function cueGuide(cue: GuideCue) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<GuideCue>("tonia:guide", { detail: cue }));
}
