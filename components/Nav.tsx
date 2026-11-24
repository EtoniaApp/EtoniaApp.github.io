"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./Nav.module.css";

const LINKS = [
  { href: "/#ai-plot", label: "AI Plot" },
  { href: "/#study-desk", label: "Study Desk" },
  { href: "/#free", label: "Free notebook" },
  { href: "/#plans", label: "Plans" },
  { href: "/support/", label: "Support" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  return (
    <header className={styles.header} data-scrolled={scrolled || open}>
      <nav className={`wrap ${styles.bar}`} aria-label="Primary">
        <Link href="/" className={styles.brand} onClick={() => setOpen(false)}>
          <img src="/brand/etonia-icon.webp" alt="" width={34} height={34} />
          <span>Etonia</span>
        </Link>

        <ul className={styles.links} data-open={open}>
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            </li>
          ))}
          <li className={styles.mobileOnly}>
            <a href="https://www.instagram.com/etoniaaa/" target="_blank" rel="noopener noreferrer">
              Instagram @etoniaaa
            </a>
          </li>
        </ul>

        <div className={styles.actions}>
          <a
            className={`btn btn-secondary btn-sm ${styles.insta}`}
            href="https://www.instagram.com/etoniaaa/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Etonia on Instagram"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
            </svg>
          </a>
          <Link href="/#waitlist" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>
            Join waitlist
          </Link>
          <button
            type="button"
            className={styles.burger}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </nav>
    </header>
  );
}
