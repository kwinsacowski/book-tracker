"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import "./realistic-bookshelf.css"

export type ShelfBook = {
    id: string;
    title: string;
    author?: string | null;
    coverColor?: string;
};

type Props = {
    books: ShelfBook[];
    newlyAddedBookId?: string | null;
};

export default function RealisticBookshelf({
  books,
  newlyAddedBookId,
}: Props) {
  const [selectedBook, setSelectedBook] = useState<ShelfBook | null>(null);

  return (
    <>
      <div className="bookshelf-room">
        <div className="bookshelf-frame">
          <div className="bookshelf-row">
            {books.map((book, index) => (
              <motion.button
                key={book.id}
                className="book-spine"
                style={{
                  backgroundColor: book.coverColor || "#6f4e37",
                  height: `${170 + ((index % 5) * 18)}px`,
                  width: `${48 + ((index % 3) * 8)}px`,
                }}
                initial={
                  book.id === newlyAddedBookId
                    ? {
                        scale: 0.5,
                        opacity: 0,
                        y: -80,
                      }
                    : false
                }
                animate={{
                  scale: 1,
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.03,
                }}
                whileHover={{
                  y: -14,
                  scale: 1.05,
                  rotateZ: index % 2 === 0 ? -2 : 2,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                onClick={() => setSelectedBook(book)}
              >
                <span className="book-highlight" />

                <span className="spine-decoration top" />
                <span className="spine-decoration bottom" />

                <span className="spine-title">
                  {book.title}
                </span>

                <span className="spine-author">
                  {book.author}
                </span>
              </motion.button>
            ))}
          </div>

          <div className="wood-shelf" />
        </div>
      </div>

      <AnimatePresence>
        {selectedBook && (
          <motion.div
            className="book-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBook(null)}
          >
            <motion.div
              className="open-book"
              initial={{
                scale: 0.7,
                y: 80,
                rotateX: 20,
              }}
              animate={{
                scale: 1,
                y: 0,
                rotateX: 0,
              }}
              exit={{
                scale: 0.7,
                y: 80,
                opacity: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 18,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="book-cover"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: -28 }}
                transition={{
                  delay: 0.2,
                  duration: 0.5,
                }}
              >
                <h2>{selectedBook.title}</h2>

                <p>
                  {selectedBook.author ||
                    "Unknown Author"}
                </p>
              </motion.div>

              <div className="book-pages">
                <p className="chapter-label">
                  Library Entry
                </p>

                <h3>{selectedBook.title}</h3>

                <p>
                  Author:{" "}
                  {selectedBook.author ||
                    "Unknown Author"}
                </p>

                <div className="book-actions">
                  <Link
                    href={`/library/${selectedBook.id}`}
                    className="view-button"
                  >
                    View Details
                  </Link>

                  <button
                    type="button"
                    className="close-button"
                    onClick={() =>
                      setSelectedBook(null)
                    }
                  >
                    Close Book
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}