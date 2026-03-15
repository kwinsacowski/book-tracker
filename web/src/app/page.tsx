import Image from "next/image";
import Link from "next/link";
import { APP_NAME, APP_TAGLINE } from "@/config/app";
import { getBooks } from "../../lib/api";
import type { Book } from "../../types/books";
import styles from "./home.module.css";

export default async function HomePage() {
  const books: Book[] = await getBooks();

  const totalBooks = books.length;
  const readingNow = books.filter((item) => item.status === "READING").length;
  const completed = books.filter((item) => item.status === "COMPLETED").length;

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.heroCard}>
          <div className={styles.badge}>Personal reading hub</div>

          <div className={styles.logoWrap}>
            <Image
              src="/assets/inkling-shelf-logo.png"
              alt="Inkling Shelf Logo"
              width={220}
              height={220}
              priority
            />
          </div>

          <h1 className={styles.title}>Welcome to {APP_NAME}</h1>

          <p className={styles.subtitle}>
            {APP_TAGLINE}. Curate your collection, follow your reading pace, and
            keep every story in one calm, beautiful place.
          </p>

          <div className={styles.ctaRow}>
            <Link href="/library" className={styles.primaryBtn}>
              View My Library
            </Link>
            <Link href="/register" className={styles.secondaryBtn}>
              Start Your Shelf
            </Link>
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
              <h2 className={styles.libraryTitle}>Your Books</h2>
              <p className={styles.libraryHint}>
                A quick look at your current reading shelf.
              </p>
            </div>
          </div>

          {books.length === 0 ? (
            <div className={styles.emptyState}>
              Your shelf is empty right now. Once books are added, they’ll appear
              here as beautifully organized reading cards.
            </div>
          ) : (
            <ul className={styles.bookList}>
              {books.map((item) => {
                const progressValue =
                  item.progressUnit === "PERCENT"
                    ? Math.min(item.Progress, 100)
                    : item.book.pageCount
                    ? Math.min((item.Progress / item.book.pageCount) * 100, 100)
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
                        Progress: {item.Progress}
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