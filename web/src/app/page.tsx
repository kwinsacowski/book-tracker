"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { APP_NAME, APP_TAGLINE } from "@/config/app";
import {
  getDisplayName,
  getStoredUser,
  getToken,
  type StoredUser,
} from "../lib/auth";
import styles from "../styles/home.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Book = {
  status: string;
  progress: number;
  progressUnit: "PERCENT" | "PAGES";
  book: {
    id: string;
    title: string;
    author?: string | null;
    pageCount?: number | null;
  };
};

function calculateProgressPercent(
  currentPage: number,
  totalPages?: number | null,
) {
  if (!totalPages || totalPages <= 0) {
    return 0;
  }

  return Math.min(Math.round((currentPage / totalPages) * 100), 100);
}

function formatStatus(status: string) {
  switch (status) {
    case "WANT_TO_READ":
      return "Want to Read";
    case "READING":
      return "Reading";
    case "COMPLETED":
      return "Completed";
    case "PAUSED":
      return "Paused";
    case "DNF":
      return "DNF";
    default:
      return status;
  }
}

export default function HomePage() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function syncDashboard() {
      const storedUser = getStoredUser();
      const token = getToken();

      setUser(storedUser);

      if (!token || !API_URL) {
        setBooks([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(`${API_URL}/books`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load books.");
        }

        const data = (await response.json()) as Book[];
        setBooks(data);
      } catch {
        setBooks([]);
      } finally {
        setIsLoading(false);
      }
    }

    void syncDashboard();

    function handleAuthChange() {
      void syncDashboard();
    }

    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  const totalBooks = books.length;
  const readingNow = books.filter((item) => item.status === "READING").length;
  const completed = books.filter((item) => item.status === "COMPLETED").length;

  const heading = useMemo(() => {
    if (!user) return `Welcome to ${APP_NAME}`;
    return `Welcome back, ${getDisplayName(user)}`;
  }, [user]);

  const subtitle = user
    ? "Here is your personal reading dashboard with your latest shelf activity."
    : `${APP_TAGLINE}. Curate your collection, follow your reading pace, and keep every story in one calm, beautiful place.`;

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.heroCard}>
          <div className={styles.badge}>
            {user ? "Your reading dashboard" : "Personal reading hub"}
          </div>

          <div className={styles.logoWrap}>
            <Image
              src="/assets/inkling-shelf-logo.png"
              alt="Inkling Shelf Logo"
              width={220}
              height={220}
              priority
            />
          </div>

          <h1 className={styles.title}>{heading}</h1>

          <p className={styles.subtitle}>{subtitle}</p>

          <div className={styles.ctaRow}>
            <Link href="/library" className={styles.primaryBtn}>
              View My Library
            </Link>

            {user ? (
              <Link href="/add-book" className={styles.secondaryBtn}>
                + Add Book
              </Link>
            ) : (
              <Link href="/register" className={styles.secondaryBtn}>
                Start Your Shelf
              </Link>
            )}
          </div>

          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Books tracked</p>
              <p className={styles.statValue}>{totalBooks}</p>
            </div>

            <div className={styles.statCard}>
              <p className={styles.statLabel}>Currently reading</p>
              <p className={styles.statValue}>{readingNow}</p>
            </div>

            <div className={styles.statCard}>
              <p className={styles.statLabel}>Completed</p>
              <p className={styles.statValue}>{completed}</p>
            </div>
          </div>
        </section>

        <section className={styles.libraryCard}>
          <div className={styles.libraryHeader}>
            <div>
              <h2 className={styles.libraryTitle}>
                {user ? "Your Books" : "Your Shelf Preview"}
              </h2>
              <p className={styles.libraryHint}>
                {user
                  ? "A quick look at your current reading shelf."
                  : "Log in or register to start building your reading space."}
              </p>
            </div>
          </div>

          {!user ? (
            <div className={styles.emptyState}>
              You are currently browsing as a guest. Create an account or log in
              to see your personalized dashboard and saved books.
            </div>
          ) : isLoading ? (
            <div className={styles.emptyState}>Loading your shelf...</div>
          ) : books.length === 0 ? (
            <div className={styles.emptyState}>
              Your shelf is empty right now. Once books are added, they’ll
              appear here as beautifully organized reading cards.
            </div>
          ) : (
            <ul className={styles.bookList}>
              {books.map((item) => {
                const currentPage = item.progress ?? 0;
                const totalPages = item.book.pageCount ?? 0;
                const progressPercent = calculateProgressPercent(
                  currentPage,
                  totalPages,
                );

                return (
                  <li key={item.book.id}>
                    <Link
                      href={`/library/${item.book.id}`}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        display: "block",
                      }}
                    >
                      <div
                        className={styles.bookCard}
                        style={{
                          transition:
                            "transform 0.2s ease, box-shadow 0.2s ease",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-6px)";
                          e.currentTarget.style.boxShadow =
                            "0 12px 24px rgba(0, 0, 0, 0.12)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "";
                        }}
                      >
                        <div className={styles.bookTop}>
                          <div>
                            <p className={styles.bookTitle}>{item.book.title}</p>
                            <p className={styles.bookAuthor}>
                              {item.book.author || "Author unknown"}
                            </p>
                          </div>

                          <span className={styles.statusPill}>
                            {formatStatus(item.status)}
                          </span>
                        </div>

                        <div className={styles.progressRow}>
                          <p className={styles.progressLabel}>
                            {currentPage} / {totalPages} pages
                          </p>

                          <p className={styles.progressLabel}>
                            {progressPercent}%
                          </p>
                        </div>

                        <div className={styles.progressTrack}>
                          <div
                            className={styles.progressFill}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}