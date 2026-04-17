"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { APP_NAME, APP_TAGLINE } from "@/config/app";
import {
  clearAuth,
  getDisplayName,
  getStoredUser,
  isLoggedIn,
} from "../lib/auth";
import styles from "./navbar.module.css";

export default function NavBar() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  const user = getStoredUser();
  const loggedIn = isLoggedIn();
  const displayName = getDisplayName(user);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleLogout() {
    clearAuth();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className={styles.sidebar}>
      <div>
        <div className={styles.brandBlock}>
          <p className={styles.eyebrow}>Reading Dashboard</p>
          <h2 className={styles.brand}>{APP_NAME}</h2>
          <p className={styles.tagline}>{APP_TAGLINE}</p>

          {mounted && loggedIn ? (
            <div className={styles.userBadge}>Signed in as {displayName}</div>
          ) : null}
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="/">Dashboard</Link>
            </li>

            <li className={styles.navItem}>
              <Link href="/library">Library</Link>
            </li>

            {mounted && !loggedIn ? (
              <>
                <li className={styles.navItem}>
                  <Link href="/login">Login</Link>
                </li>
                <li className={styles.navItem}>
                  <Link href="/register">Register</Link>
                </li>
              </>
            ) : mounted && loggedIn ? (
              <li className={styles.navItem}>
                <button
                  type="button"
                  onClick={handleLogout}
                  className={styles.logoutButton}
                >
                  Log Out
                </button>
              </li>
            ) : null}
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