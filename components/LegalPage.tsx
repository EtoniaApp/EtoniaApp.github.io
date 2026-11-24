import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { marked } from "marked";
import { Tonia } from "./Tonia";
import styles from "./LegalPage.module.css";

export type LegalDoc = "support" | "privacy" | "terms";

export function readLegal(doc: LegalDoc) {
  const raw = fs.readFileSync(path.join(process.cwd(), "content/legal", `${doc}.md`), "utf8");
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  const title = m?.[1].match(/title:\s*(.+)/)?.[1].trim() ?? "Etonia";
  const body = m ? raw.slice(m[0].length) : raw;
  return { title, html: marked.parse(body, { async: false }) as string };
}

const TABS: { doc: LegalDoc; label: string; href: string }[] = [
  { doc: "support", label: "Support", href: "/support/" },
  { doc: "privacy", label: "Privacy", href: "/privacy/" },
  { doc: "terms", label: "Terms", href: "/terms/" },
];

export function LegalPage({ doc }: { doc: LegalDoc }) {
  const { html } = readLegal(doc);
  return (
    <div className={`wrap ${styles.page}`}>
      <nav className={styles.tabs} aria-label="Help and legal">
        {TABS.map((t) => (
          <Link key={t.doc} href={t.href} aria-current={t.doc === doc ? "page" : undefined}>
            {t.label}
          </Link>
        ))}
      </nav>
      <div className={styles.tonia} aria-hidden>
        <Tonia loop={doc === "support" ? "attend" : "write"} width={110} />
      </div>
      <article className={styles.prose} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
