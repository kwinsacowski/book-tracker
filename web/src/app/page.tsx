"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { APP_NAME, APP_TAGLINE } from "@/config/app";
import { getDisplayName, getStoredUser, getToken, type StoredUser } from "../lib/auth";
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

export default function HomePage() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();
    const token = getToken();

    setUser(storedUser);

    async function loadBooks() {
      if (!token || !API_URL) {
        setBooks([]);
        setIsLoading(false);
        return;
      }

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

    void loadBooks();
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

            {!user ? (
              <Link href="/register" className={styles.secondaryBtn}>
                Start Your Shelf
              </Link>
            ) : null}
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
              Your shelf is empty right now. Once books are added, they’ll appear
              here as beautifully organized reading cards.
            </div>
          ) : (
            <ul className={styles.bookList}>
              {books.map((item) => {
                const progressValue =
                  item.progressUnit === "PERCENT"
                    ? Math.min(item.progress, 100)
                    : item.book.pageCount
                      ? Math.min((item.progress / item.book.pageCount) * 100, 100)
                      : 0;

                return (
                  <li key={item.book.id} className={styles.bookCard}>
                    <div className={styles.bookTop}>
                      <div>
                        <p className={styles.bookTitle}>{item.book.title}</p>
                        <p className={styles.bookAuthor}>
                          {item.book.author || "Author unknown"}
                        </p>
                      </div>

                      <span className={styles.statusPill}>{item.status}</span>
                    </div>

                    <div className={styles.progressRow}>
                      <p className={styles.progressLabel}>
                        Progress: {item.progress}
                        {item.progressUnit === "PERCENT" ? "%" : " pages"}
                      </p>

                      <div className={styles.progressTrack}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${progressValue}%` }}
                        />
                      </div>
                    </div>
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