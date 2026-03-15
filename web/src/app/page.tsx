import Image from "next/image";
import { APP_NAME, APP_TAGLINE, THEME } from "@/config/app";
import { getBooks } from "../../lib/api";
import type { Book } from "../../types/books";


export default async function HomePage() {
  const books: Book[] = await getBooks();

  return (
    <main
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: THEME.colors.parchment,
        color: THEME.colors.oldLibrary,
      }}
    >
      <section style={{ flex: 1, padding: "2rem" }}>
        <Image
          src="/assets/inkling-shelf-logo.png"
          alt="Inkling Shelf Logo"
          width={180}
          height={180}
          style={{ marginBottom: "1rem" }}
        />

        <h1
          style={{
            color: THEME.colors.forestInk,
            marginBottom: "0.5rem",
          }}
        >
          Welcome to {APP_NAME}
        </h1>

        <p style={{ marginBottom: "0.5rem" }}>{APP_TAGLINE}</p>

        <p style={{ marginBottom: "2rem" }}>
          Track your reading progress and manage your book collection.
        </p>
      </section>

      <section
        style={{
          flex: 1,
          padding: "2rem",
          borderLeft: `1px solid ${THEME.colors.oldLibrary}`,
        }}
      >
        <h2 style={{ marginTop: "2rem" }}>Your Books</h2>

        <ul>
          {books.map((item) => (
            <li key={item.book.id}>
              {item.book.title} — {item.status} ({item.Progress}
              {item.progressUnit === "PERCENT" ? "%" : " pages"})
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
