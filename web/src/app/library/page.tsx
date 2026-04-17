"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Bookshelf, { ShelfBook } from "@/components/Bookshelf";
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

  useEffect(() => {
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
            err instanceof Error ? err.message : "Something went wrong.",
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
    return libraryItems.map((item) => ({
      id: item.id ?? item.book.id,
      title: item.book.title,
      author: item.book.author,
      coverColor: getColorFromStatus(item.status),
    }));
  }, [libraryItems]);

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
