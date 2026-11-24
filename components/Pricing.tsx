"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { cueGuide } from "@/lib/guide";
import styles from "./Pricing.module.css";

const PLANS = [
  {
    name: "Starter",
    monthly: "$6.99",
    yearly: "$69.99",
    tagline: "Essential AI access",
    points: ["Unlimited Haiku & Luna", "Monthly token pool for Sonnet, Sol & Flash", "Study Desk search & Practice Studio"],
  },
  {
    name: "Pro",
    monthly: "$14.99",
    yearly: "$149.99",
    tagline: "2.1× the tokens of Starter",
    points: ["Unlimited Haiku & Luna", "Token pool for Sonnet, Sol & Flash", "Unlocks frontier models Opus, Argon & Astra"],
    featured: true,
  },
  {
    name: "Max",
    monthly: "$24.99",
    yearly: "$249.99",
    tagline: "1.7× the tokens of Pro",
    points: ["Unlimited Haiku & Luna", "Largest pool for every standard & frontier model", "Built for heavy daily study & exam prep"],
  },
];

export function Pricing() {
  const [yearly, setYearly] = useState(false);
  return (
    <>
      <div className={styles.toggle} role="radiogroup" aria-label="Billing period">
        {[false, true].map((y) => (
          <button key={String(y)} role="radio" aria-checked={yearly === y} onClick={() => {
              setYearly(y);
              cueGuide(
                y
                  ? { section: "plans", say: "Smart! Yearly saves about 17%.", hop: true }
                  : { section: "plans", say: "Monthly is nice and flexible too.", loop: "think" },
              );
            }}>
            {yearly === y && <motion.span layoutId="bill" className={styles.toggleBg} transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
            <span>{y ? "Yearly · save 17%" : "Monthly"}</span>
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        <div className={`${styles.plan} ${styles.free}`}>
          <h3>Notebook</h3>
          <div className={styles.price}>
            <span className="serif">Free</span>
            <small>forever</small>
          </div>
          <p className={styles.tagline}>Every note-taking feature. No ads.</p>
          <ul>
            <li>All pens, paper, shapes & sticky notes</li>
            <li>PDF markup, audio, export & backup</li>
            <li>Two-week unlimited AI trial on sign-in</li>
          </ul>
        </div>
        {PLANS.map((p) => (
          <motion.div
            key={p.name}
            className={`${styles.plan} ${p.featured ? styles.featured : ""}`}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
          >
            <h3>
              {p.name}
              {p.featured && <span className={styles.badge}>Recommended</span>}
            </h3>
            <div className={styles.price}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={yearly ? p.yearly : p.monthly}
                  className="serif"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                >
                  {yearly ? p.yearly : p.monthly}
                </motion.span>
              </AnimatePresence>
              <small>/ {yearly ? "year" : "month"}</small>
            </div>
            <p className={styles.tagline}>{p.tagline}</p>
            <ul>
              {p.points.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
      <p className={styles.fine}>
        Sign in with Apple or Google to start a two-week free trial of unlimited Haiku and Luna, beginning with your
        first AI request. Subscriptions are billed through the App Store or Google Play and renew automatically unless
        cancelled at least 24 hours before the end of the period. <Link href="/privacy/">Privacy</Link> ·{" "}
        <Link href="/terms/">Terms</Link>
      </p>
    </>
  );
}
