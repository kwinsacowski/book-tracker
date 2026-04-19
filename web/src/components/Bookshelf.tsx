"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import BookSpine from "./BookSpine";
import styles from "./bookshelf.module.css";

export type ShelfBook = {
  id: string;
  title: string;
  author?: string;
  coverColor?: string;
};

type BookshelfProps = {
  books: ShelfBook[];
  newlyAddedBookId?: string | null;
};

const MIN_BOOKS_PER_SHELF = 3;
const MAX_BOOKS_PER_SHELF = 12;
const ESTIMATED_BOOK_WIDTH = 58;
const SHELF_GAP = 8;
const SHELF_SIDE_PADDING = 36;

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

function getBooksPerShelf(containerWidth: number) {
  const usableWidth = Math.max(containerWidth - SHELF_SIDE_PADDING, 0);
  const estimatedSlot = ESTIMATED_BOOK_WIDTH + SHELF_GAP;

  const count = Math.floor(usableWidth / estimatedSlot);

  return Math.max(MIN_BOOKS_PER_SHELF, Math.min(MAX_BOOKS_PER_SHELF, count));
}

export default function Bookshelf({ books, newlyAddedBookId }: BookshelfProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [booksPerShelf, setBooksPerShelf] = useState(8);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    function updateBooksPerShelf() {
      setBooksPerShelf(getBooksPerShelf(element.clientWidth));
    }

    updateBooksPerShelf();

    const observer = new ResizeObserver(() => {
      updateBooksPerShelf();
    });

    observer.observe(element);

    window.addEventListener("resize", updateBooksPerShelf);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateBooksPerShelf);
    };
  }, []);

  const shelves = useMemo(() => {
    return chunkBooks(books, booksPerShelf);
  }, [books, booksPerShelf]);

  if (books.length === 0) {
    return (
      <div className={styles.emptyState}>
        No books in your library yet.
      </div>
    );
  }

  return (
    <div ref={containerRef} className={styles.wrapper}>
      {shelves.map((shelf, shelfIndex) => (
        <div key={`shelf-${shelfIndex}`} className={styles.shelfBlock}>
          <div className={styles.shelfSurface}>
            <motion.div layout className={styles.booksRow}>
              <AnimatePresence>
                {shelf.map((book, index) => (
                  <motion.div
                    key={book.id}
                    layout
                    className={styles.bookSlot}
                  >
                    <BookSpine
                      id={book.id}
                      title={book.title}
                      author={book.author || "Unknown Author"}
                      color={book.coverColor || "#6f4e37"}
                      width={getBookWidth(index)}
                      height={getBookHeight(index)}
                      isNew={book.id === newlyAddedBookId}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            <div className={styles.shelfBoard} />
          </div>
        </div>
      ))}
    </div>
  );
}