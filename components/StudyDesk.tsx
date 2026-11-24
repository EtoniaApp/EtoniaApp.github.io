"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { ToniaLoop } from "./Tonia";
import { cueGuide } from "@/lib/guide";
import { Doodle } from "./Doodles";
import styles from "./StudyDesk.module.css";

type Tab = {
  id: string;
  label: string;
  loop: ToniaLoop;
  say: string;
  title: string;
  body: string;
  rows: { icon: "note" | "chat" | "test" | "card" | "folder"; name: string; meta: string }[];
};

const TABS: Tab[] = [
  {
    id: "notes",
    label: "Notes",
    loop: "write",
    say: "Every class is a folder.",
    title: "Your class is a folder",
    body: "Notes, PDFs and sub folders live inside each class, as deep as you like. Search by meaning, sort, and open any page in one tap.",
    rows: [
      { icon: "folder", name: "Week 6 · Derivatives", meta: "4 notes" },
      { icon: "note", name: "Quadratic sketching", meta: "Lined · 3 pages" },
      { icon: "note", name: "Textbook ch. 3 (PDF)", meta: "Annotated · 42 pages" },
    ],
  },
  {
    id: "chats",
    label: "Chats",
    loop: "think",
    say: "Let's work it out, step by step.",
    title: "A Socratic tutor that cites your pages",
    body: "Study Mode teaches in small steps with quick checks and a scratch pad, and every claim links to the exact page it came from, open beside the chat.",
    rows: [
      { icon: "chat", name: "Why does the vertex form work?", meta: "Cites p. 2, p. 14" },
      { icon: "chat", name: "Chain rule, explained slowly", meta: "3 quick checks" },
      { icon: "chat", name: "Review before Friday's quiz", meta: "Study Mode" },
    ],
  },
  {
    id: "tests",
    label: "Tests",
    loop: "grade",
    say: "Pencils down! Grading…",
    title: "Practice tests, written by AI, graded by AI",
    body: "Etonia writes MCQ and free-response papers from your class notes. Solve them on the paper with your stylus and get step-by-step marking with a rubric.",
    rows: [
      { icon: "test", name: "Midterm practice A", meta: "12 questions · 86%" },
      { icon: "test", name: "Derivatives drill", meta: "Free response · 9/10" },
      { icon: "test", name: "Mistake review", meta: "From your last 3 tests" },
    ],
  },
  {
    id: "flashcards",
    label: "Flashcards",
    loop: "pen_spin",
    say: "Flip, flip, remember!",
    title: "Flashcards from what you wrote",
    body: "Turn any note into a deck. Etonia remembers what you got wrong and brings it back until it sticks.",
    rows: [
      { icon: "card", name: "Limits & continuity", meta: "24 cards" },
      { icon: "card", name: "Trig identities", meta: "18 cards · 3 due" },
      { icon: "card", name: "Key definitions", meta: "40 cards" },
    ],
  },
];

function RowIcon({ kind }: { kind: Tab["rows"][number]["icon"] }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      {kind === "folder" && <path d="M3 7.5V18a1.5 1.5 0 0 0 1.5 1.5h15A1.5 1.5 0 0 0 21 18V9a1.5 1.5 0 0 0-1.5-1.5H12L10 5H4.5A1.5 1.5 0 0 0 3 6.5Z" {...p} />}
      {kind === "note" && (
        <>
          <path d="M6 3.5h9l3.5 3.5v13H6Z" {...p} />
          <path d="M15 3.5V7h3.5M9 11h6M9 14.5h6" {...p} />
        </>
      )}
      {kind === "chat" && <path d="M4 5.5h16v10H9l-5 4Z" {...p} />}
      {kind === "test" && (
        <>
          <rect x="5" y="3.5" width="14" height="17" rx="1.5" {...p} />
          <path d="m8.5 9 1.5 1.5L13 7.5M8.5 15h7" {...p} />
        </>
      )}
      {kind === "card" && (
        <>
          <rect x="3.5" y="7" width="13" height="10" rx="1.5" {...p} />
          <path d="M7.5 4.5H19a1.5 1.5 0 0 1 1.5 1.5v8" {...p} />
        </>
      )}
    </svg>
  );
}

export function StudyDesk() {
  const [tab, setTab] = useState(0);
  const t = TABS[tab];
  return (
    <div className={styles.grid}>
      <div className={styles.window}>
        <aside className={styles.sidebar} aria-hidden>
          <div className={styles.sideHead}>Study Desk</div>
          <div className={styles.sideRow} data-on="true">
            <i style={{ background: "#d8c8f5" }} /> Calculus I
          </div>
          <div className={styles.sideRow}>
            <i style={{ background: "#bfe3c4" }} /> Organic Chemistry
          </div>
          <div className={styles.sideRow}>
            <i style={{ background: "#fbeaa0" }} /> Physics · Optics
          </div>
          <div className={styles.sideFoot}>Recent</div>
          <div className={styles.sideRow}>Chain rule chat</div>
          <div className={styles.sideRow}>Midterm practice A</div>
        </aside>

        <div className={styles.main}>
          <div className={styles.top}>
            <span className={styles.crumb}>Calculus I</span>
            <div className={styles.chips} role="tablist" aria-label="Class page tabs">
              {TABS.map((x, n) => (
                <button key={x.id} role="tab" aria-selected={n === tab} className={styles.chip} onClick={() => {
                    setTab(n);
                    cueGuide({ section: "study-desk", say: x.say, loop: x.loop, hop: n !== tab });
                  }}>
                  {n === tab && <motion.span layoutId="desk-chip" className={styles.chipBg} transition={{ type: "spring", stiffness: 500, damping: 36 }} />}
                  <span>{x.label}</span>
                </button>
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.ul
              key={t.id}
              className={styles.rows}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.11 } }}
              variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            >
              {t.rows.map((r) => (
                <motion.li
                  key={r.name}
                  className={styles.row}
                  variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}
                >
                  <span className={styles.rowIcon}>
                    <RowIcon kind={r.icon} />
                  </span>
                  <span className={styles.rowName}>{r.name}</span>
                  <span className={styles.rowMeta}>{r.meta}</span>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
      </div>

      <div className={styles.copy}>
        <AnimatePresence mode="wait">
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28 }}
          >
            <h3 className={styles.copyTitle}>{t.title}</h3>
            <p className={styles.copyBody}>{t.body}</p>
          </motion.div>
        </AnimatePresence>
        <ul className={styles.points}>
          <li>
            <Doodle kind="check" size={22} /> Opens on the desk, on a fresh chat
          </li>
          <li>
            <Doodle kind="check" size={22} /> Semantic search across ink, diagrams and your marks
          </li>
          <li>
            <Doodle kind="check" size={22} /> Models from Anthropic, OpenAI and Google, or let Auto choose
          </li>
          <li>
            <Doodle kind="check" size={22} /> Mistake memory that adapts what you practise next
          </li>
        </ul>
      </div>
    </div>
  );
}
