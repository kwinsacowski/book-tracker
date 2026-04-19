"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Bookshelf, { ShelfBook } from "../../components/Bookshelf";
import { BackendLibraryItem, getLibraryBooks } from "@/lib/books";
import styles from "./page.module.css";

function getColorFromStatus(status: string) {
  switch (status) {
    case "READING":
      return "#7d5a50";
    case "COMPLETED":
      return "#5b7c4d";
    case "WANT_TO_READ":
      return "#6c63a8";
    case "PAUSED":
      return "#9c7a3d";
    default:
      return "#6f4e37";
  }
}

export default function LibraryPage() {
  const [libraryItems, setLibraryItems] = useState<BackendLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newlyAddedBookId, setNewlyAddedBookId] = useState<string | null>(null);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      setIsLoggedIn(false);
      setLibraryItems([]);
      setLoading(false);
      setError("");
      return;
    }

    const storedNewBookId = sessionStorage.getItem("newlyAddedBookId");
    setNewlyAddedBookId(storedNewBookId);

    setIsLoggedIn(true);

    let isMounted = true;

    async function loadBooks() {
      try {
        setLoading(true);
        setError("");

        const data = await getLibraryBooks();

        if (isMounted) {
          setLibraryItems(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Something went wrong."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadBooks();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
  if (!newlyAddedBookId) {
    return;
  }

  const timeout = window.setTimeout(() => {
    sessionStorage.removeItem("newlyAddedBookId");
    setNewlyAddedBookId(null);
  }, 1800);

  return () => window.clearTimeout(timeout);
}, [newlyAddedBookId]);

  const shelfBooks: ShelfBook[] = useMemo(() => {
    return libraryItems.map((item, index) => ({
      id: item.book.id,
      title: item.book.title,
      author: item.book.author,
      coverColor: getColorFromStatus(item.status),
    }));
  }, [libraryItems]);

  if (!isLoggedIn) {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>My Library</h1>

      <div className={styles.messageCard}>
        <h2 className={styles.cardTitle}>Log in to view your shelf</h2>

        <p className={styles.cardText}>
          Your personalized library is available once you log in or create an
          account.
        </p>

        <div className={styles.actionRow}>
          <Link href="/login" className={styles.addButton}>
            Log In
          </Link>

          <Link href="/register" className={styles.secondaryButton}>
            Register
          </Link>
        </div>
      </div>
    </main>
    );
  }

  return (
  <main className={styles.page}>
    <div className={styles.header}>
      <h1 className={styles.title}>My Library</h1>

      <Link href="/add-book" className={styles.addButton}>
        Add Book
      </Link>
    </div>

    {loading ? (
      <div className={styles.messageCard}>Loading your shelf...</div>
    ) : error ? (
      <div className={styles.errorCard}>{error}</div>
    ) : (
      <section className={styles.shelfSection}>
        <Bookshelf books={shelfBooks} newlyAddedBookId={newlyAddedBookId} />
      </section>
    )}
  </main>
);
}