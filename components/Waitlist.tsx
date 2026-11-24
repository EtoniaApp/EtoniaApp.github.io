"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type FormEvent } from "react";
import { Doodle, type DoodleKind } from "./Doodles";
import styles from "./Waitlist.module.css";

const SUPABASE_URL = "https://ualdmkijvjgdzraontdg.supabase.co";
// Public anon key (row-level security protects the table; join_waitlist is the only exposed RPC).
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhbGRta2lqdmpnZHpyYW9udGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyOTQ2MTAsImV4cCI6MjEwNzg3MDYxMH0.QUZ_tfHd6gwSQMsozcCICPPmVmPW-ePwjBhIRsyz1Eg";

async function joinWaitlist(email: string, source: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/join_waitlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ p_email: email, p_platform: "all", p_source: source }),
  });
  // 409 = already on the list, which is a success for the visitor
  if (!res.ok && res.status !== 409) throw new Error("We couldn't reach the waitlist just now. Please try again.");
}

const CONFETTI: DoodleKind[] = ["sprout", "heart", "star", "sparkle", "sprout", "star", "heart", "sparkle", "sprout", "star"];

export function WaitlistForm({ source, compact }: { source: string; compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setState("error");
      setMsg("That email doesn't look quite right.");
      return;
    }
    setState("busy");
    try {
      await joinWaitlist(clean, source);
      setState("done");
      setMsg(clean);
      setEmail("");
      window.dispatchEvent(new CustomEvent("etonia:joined"));
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form className={`${styles.form} ${compact ? styles.compact : ""}`} onSubmit={submit} noValidate>
      <label className="sr-only" htmlFor={`email-${source}`}>
        Email address
      </label>
      <div className={styles.field}>
        <input
          id={`email-${source}`}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@school.edu"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          aria-invalid={state === "error"}
          required
        />
        <button className="btn btn-primary" type="submit" disabled={state === "busy"}>
          {state === "busy" ? "Joining…" : "Join the waitlist"}
        </button>
      </div>
      <AnimatePresence mode="wait">
        {(state === "done" || state === "error") && (
          <motion.p
            key={state}
            role="status"
            className={state === "done" ? styles.ok : styles.err}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {state === "done" ? (
              <>
                You're on the list, <strong>{msg}</strong>. Tonia will write to you soon!
              </>
            ) : (
              msg
            )}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

/** Bottom call to action. Tonia (the guide) walks over and celebrates sign-ups. */
export function WaitlistCard() {
  const [party, setParty] = useState(0);

  useEffect(() => {
    const on = () => setParty((n) => n + 1);
    window.addEventListener("etonia:joined", on);
    return () => window.removeEventListener("etonia:joined", on);
  }, []);

  return (
    <div className={styles.card}>
      {party > 0 &&
        CONFETTI.map((k, i) => (
          <motion.span
            key={`${party}-${i}`}
            className={styles.confetti}
            initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 0.4 }}
            animate={{
              opacity: 0,
              x: (i - CONFETTI.length / 2) * 46,
              y: [0, -160 - (i % 3) * 30, 40],
              rotate: (i % 2 ? 1 : -1) * 120,
              scale: 1,
            }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            aria-hidden
          >
            <Doodle kind={k} size={30} />
          </motion.span>
        ))}
      <span className={styles.stamp} aria-hidden>
        <Doodle kind="sprout" size={34} />
      </span>
      <h2 className="section-title">Get early access.</h2>
      <p className={styles.sub}>
        Leave your email for a priority invite, and follow{" "}
        <a href="https://www.instagram.com/etoniaaa/" target="_blank" rel="noopener noreferrer">
          @etoniaaa
        </a>{" "}
        for Tonia's adventures.
      </p>
      <WaitlistForm source="etonia_io_footer" />
    </div>
  );
}
