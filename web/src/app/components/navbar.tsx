import Link from "next/link";
import { APP_NAME, APP_TAGLINE } from "@/config/app";
import styles from "./navbar.module.css";

export default function NavBar() {
  return (
    <aside className={styles.sidebar}>
      <div>
        <div className={styles.brandBlock}>
          <p className={styles.eyebrow}>Reading Dashboard</p>
          <h2 className={styles.brand}>{APP_NAME}</h2>
          <p className={styles.tagline}>{APP_TAGLINE}</p>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="/">Dashboard</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/library">Library</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/login">Login</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/register">Register</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className={styles.footerCard}>
        <p className={styles.footerTitle}>Build your reading ritual</p>
        <p className={styles.footerText}>
          Organize your books, track progress, and keep your next favorite story
          close.
        </p>
      </div>
    </aside>
  );
}