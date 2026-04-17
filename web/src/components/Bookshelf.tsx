"use client";

import { AnimatePresence, motion } from "motion/react";
import BookSpine from "./BookSpine";

export type ShelfBook = {
  id: string;
  title: string;
  author?: string;
  coverColor?: string;
};

type BookshelfProps = {
  books: ShelfBook[];
};

const BOOKS_PER_SHELF = 8;

function chunkBooks(books: ShelfBook[], size: number) {
  const rows: ShelfBook[][] = [];

  for (let i = 0; i < books.length; i += size) {
    rows.push(books.slice(i, i + size));
  }

  return rows;
}

function getBookWidth(index: number) {
  const widths = [48, 54, 58, 52, 62, 50];
  return widths[index % widths.length];
}

function getBookHeight(index: number) {
  const heights = [170, 182, 190, 176, 196, 184];
  return heights[index % heights.length];
}

export default function Bookshelf({ books }: BookshelfProps) {
  const shelves = chunkBooks(books, BOOKS_PER_SHELF);

  if (books.length === 0) {
    return (
      <div
        style={{
          padding: "32px",
          borderRadius: "16px",
          background: "#f7f1e8",
          color: "#5b4636",
        }}
      >
        No books in your library yet.
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "32px" }}>
      {shelves.map((shelf, shelfIndex) => (
        <div key={`shelf-${shelfIndex}`}>
          <div
            style={{
              minHeight: "240px",
              padding: "24px 18px 14px",
              borderRadius: "16px 16px 8px 8px",
              background:
                "linear-gradient(to bottom, #f5eee3 0%, #efe2d0 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
            }}
          >
            <motion.div
              layout
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "8px",
                overflowX: "auto",
                paddingBottom: "10px",
              }}
            >
              <AnimatePresence>
                {shelf.map((book, index) => (
                  <motion.div
                    key={book.id}
                    layout
                    style={{ display: "flex", alignItems: "flex-end" }}
                  >
                    <BookSpine
                      id={book.id}
                      title={book.title}
                      author={book.author || "Unknown Author"}
                      color={book.coverColor || "#6f4e37"}
                      width={getBookWidth(index)}
                      height={getBookHeight(index)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            <div
              style={{
                height: "14px",
                marginTop: "6px",
                borderRadius: "4px",
                background:
                  "linear-gradient(to bottom, #8b5e3c 0%, #6f4b2d 100%)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
