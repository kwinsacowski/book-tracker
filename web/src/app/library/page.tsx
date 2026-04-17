"use client";

import { APP_NAME, THEME } from "@/config/app";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getToken } from "../../lib/auth";
import styles from "../home.module.css";

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

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = getToken();
    setLoggedIn(Boolean(token));

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
          throw new Error("Failed to load library.");
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

  return (
    <div className={styles.page}>
      <div className={styles.shell} style={{ gridTemplateColumns: "1fr" }}>
        <section className={styles.libraryCard}>
          <div className={styles.libraryHeader}>
            <div>
              <h1 className={styles.libraryTitle}>My Library</h1>
              <p className={styles.libraryHint}>
                Your saved books and current reading progress.
              </p>
            </div>
          </div>

          {!loggedIn ? (
            <div className={styles.emptyState}>
              Please <Link href="/login">log in</Link> or{" "}
              <Link href="/register">register</Link> to view your library.
            </div>
          ) : isLoading ? (
            <div className={styles.emptyState}>Loading your library...</div>
          ) : books.length === 0 ? (
            <div className={styles.emptyState}>
              You have no books in your library yet.
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