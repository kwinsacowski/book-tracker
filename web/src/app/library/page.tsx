"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Bookshelf, { ShelfBook } from "../../components/Bookshelf";
import { BackendLibraryItem, getLibraryBooks } from "@/lib/books";

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
      <main style={{ padding: "32px", display: "grid", gap: "20px" }}>
        <h1
          style={{
            margin: 0,
            fontSize: "32px",
            color: "#4b2e1f",
          }}
        >
          My Library
        </h1>

        <div
          style={{
            padding: "32px",
            borderRadius: "20px",
            background: "#f7f1e8",
            color: "#5b4636",
            display: "grid",
            gap: "16px",
            maxWidth: "700px",
          }}
        >
          <h2 style={{ margin: 0 }}>Log in to view your shelf</h2>

          <p style={{ margin: 0, lineHeight: 1.6 }}>
            Your personalized library is available once you log in or create an
            account.
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "44px",
                padding: "0 16px",
                borderRadius: "999px",
                textDecoration: "none",
                background: "#5b3b2f",
                color: "#fffaf3",
                fontWeight: 600,
              }}
            >
              Log In
            </Link>

            <Link
              href="/register"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "44px",
                padding: "0 16px",
                borderRadius: "999px",
                textDecoration: "none",
                border: "1px solid #5b3b2f",
                color: "#5b3b2f",
                fontWeight: 600,
                background: "transparent",
              }}
            >
              Register
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: "32px", display: "grid", gap: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "32px",
            color: "#4b2e1f",
          }}
        >
          My Library
        </h1>

        <Link
          href="/add-book"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "44px",
            padding: "0 16px",
            borderRadius: "999px",
            textDecoration: "none",
            background: "#5b3b2f",
            color: "#fffaf3",
            fontWeight: 600,
          }}
        >
          Add Book
        </Link>
      </div>

      {loading ? (
        <div>Loading your shelf...</div>
      ) : error ? (
        <div style={{ color: "#b42318" }}>{error}</div>
      ) : (
        <Bookshelf books={shelfBooks} />
      )}
    </main>
  );
}