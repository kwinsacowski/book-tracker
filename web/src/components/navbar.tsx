"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { APP_NAME, APP_TAGLINE } from "@/config/app";
import {
  clearAuth,
  getDisplayName,
  getStoredUser,
  isLoggedIn,
} from "@/lib/auth";
import styles from "./navbar.module.css";

function getAuthSnapshot(): string {
  const user = getStoredUser();

  return JSON.stringify({
    loggedIn: isLoggedIn(),
    displayName: getDisplayName(user),
  });
}

function getServerSnapshot(): string {
  return JSON.stringify({
    loggedIn: false,
    displayName: "",
  });
}

function subscribe(callback: () => void) {
  const handler = () => callback();

  window.addEventListener("storage", handler);
  window.addEventListener("auth-change", handler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("auth-change", handler);
  };
}

export default function NavBar() {
  const router = useRouter();

  const snapshot = useSyncExternalStore(
    subscribe,
    getAuthSnapshot,
    getServerSnapshot,
  );

  const { loggedIn, displayName } = JSON.parse(snapshot) as {
    loggedIn: boolean;
    displayName: string;
  };

  function handleLogout() {
    clearAuth();
    window.dispatchEvent(new Event("auth-change"));
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

          {loggedIn ? (
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

            {!loggedIn ? (
              <>
                <li className={styles.navItem}>
                  <Link href="/login">Login</Link>
                </li>
                <li className={styles.navItem}>
                  <Link href="/register">Register</Link>
                </li>
              </>
            ) : (
              <li className={styles.navItem}>
                <button
                  type="button"
                  onClick={handleLogout}
                  className={styles.logoutButton}
                >
                  Log Out
                </button>
              </li>
            )}
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
