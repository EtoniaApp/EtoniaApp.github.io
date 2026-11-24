import Link from "next/link";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.brand}>
          <img src="/brand/etonia-icon.webp" alt="" width={28} height={28} />
          <span>Etonia</span>
          <small>© {new Date().getFullYear()} · Made with a pencil and a sprout.</small>
        </div>
        <nav aria-label="Footer" className={styles.links}>
          <a href="https://www.instagram.com/etoniaaa/" target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <Link href="/support/">Support</Link>
          <Link href="/privacy/">Privacy</Link>
          <Link href="/terms/">Terms</Link>
        </nav>
      </div>
    </footer>
  );
}
