"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { APP_NAME, APP_TAGLINE } from "@/config/app";
import styles from "../../styles/home.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

type ReadingStatus = 
    | "WANT_TO_READ"
    | "READING"
    | "PAUSED"
    | "COMPLETED"
    | "DNF";

type ProgressUnit = "PERCENT" | "PAGES";

export default function AddBookPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [isbn, setIsbn] = useState("");
  const [pageCount, setPageCount] = useState("");

  const [status, setStatus] = useState<ReadingStatus>("WANT_TO_READ");
  const [progressUnit, setProgressUnit] = useState<ProgressUnit>("PAGES");
  const [progressValue, setProgressValue] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!API_URL) {
      setError("NEXT_PUBLIC_API_URL is missing.");
      return;
    }

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!pageCount || Number(pageCount) <= 0) {
      setError("Page count must be greater than 0.");
      return;
    }

    try {
      setIsSubmitting(true);

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      const payload = {
        title: title.trim(),
        author: author.trim() || undefined,
        coverUrl: coverUrl.trim() || undefined,
        isbn: isbn.trim() || undefined,
        pageCount: Number(pageCount),
        status,
        progressUnit,
        progress:
          progressValue.trim() !== "" ? Number(progressValue.trim()) : undefined,
      };

      const res = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || "Failed to add book.");
        return;
      }

      setSuccess("Book added successfully.");

      setTitle("");
      setAuthor("");
      setCoverUrl("");
      setIsbn("");
      setPageCount("");
      setStatus("WANT_TO_READ");
      setProgressUnit("PAGES");
      setProgressValue("");

      router.refresh();
    } catch {
      setError("Something went wrong while adding the book.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <p>{APP_NAME}</p>
          <h1>Add a book to your shelf</h1>
          <p>
            {APP_TAGLINE}. Save a title, track your reading status, and keep
            your next favorite story close.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            maxWidth: "440px",
            display: "grid",
            gap: "16px",
            marginTop: "32px",
          }}
        >
          <div style={{ display: "grid", gap: "8px" }}>
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter book title"
              required
              style={{
                height: "44px",
                padding: "0 14px",
                borderRadius: "12px",
                border: "1px solid #d9d9d9",
              }}
            />
          </div>

          <div style={{ display: "grid", gap: "8px" }}>
            <label htmlFor="author">Author</label>
            <input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name"
              style={{
                height: "44px",
                padding: "0 14px",
                borderRadius: "12px",
                border: "1px solid #d9d9d9",
              }}
            />
          </div>

          <div style={{ display: "grid", gap: "8px" }}>
            <label htmlFor="coverUrl">Cover URL</label>
            <input
              id="coverUrl"
              type="url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://example.com/cover.jpg"
              style={{
                height: "44px",
                padding: "0 14px",
                borderRadius: "12px",
                border: "1px solid #d9d9d9",
              }}
            />
          </div>

          <div style={{ display: "grid", gap: "8px" }}>
            <label htmlFor="isbn">ISBN</label>
            <input
              id="isbn"
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="Enter ISBN"
              style={{
                height: "44px",
                padding: "0 14px",
                borderRadius: "12px",
                border: "1px solid #d9d9d9",
              }}
            />
          </div>

          <div style={{ display: "grid", gap: "8px" }}>
            <label htmlFor="pageCount">Page Count *</label>
            <input
              id="pageCount"
              type="number"
              min="1"
              value={pageCount}
              onChange={(e) => setPageCount(e.target.value)}
              placeholder="e.g. 320"
              required
              style={{
                height: "44px",
                padding: "0 14px",
                borderRadius: "12px",
                border: "1px solid #d9d9d9",
              }}
            />
          </div>

          <div style={{ display: "grid", gap: "8px" }}>
            <label htmlFor="status">Reading Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ReadingStatus)}
              style={{
                height: "44px",
                padding: "0 14px",
                borderRadius: "12px",
                border: "1px solid #d9d9d9",
              }}
            >
              <option value="WANT_TO_READ">Want to Read</option>
              <option value="READING">Reading</option>
              <option value="PAUSED">Paused</option>
              <option value="COMPLETED">Completed</option>
              <option value="DNF">DNF</option>
            </select>
          </div>

          <div style={{ display: "grid", gap: "8px" }}>
            <label htmlFor="progressUnit">Progress Unit</label>
            <select
              id="progressUnit"
              value={progressUnit}
              onChange={(e) => setProgressUnit(e.target.value as ProgressUnit)}
              style={{
                height: "44px",
                padding: "0 14px",
                borderRadius: "12px",
                border: "1px solid #d9d9d9",
              }}
            >
              <option value="PAGES">Pages</option>
              <option value="PERCENT">Percent</option>
            </select>
          </div>

          <div style={{ display: "grid", gap: "8px" }}>
            <label htmlFor="progressValue">Progress</label>
            <input
              id="progressValue"
              type="number"
              min="0"
              value={progressValue}
              onChange={(e) => setProgressValue(e.target.value)}
              placeholder={
                progressUnit === "PAGES"
                  ? "Enter current page"
                  : "Enter percent complete"
              }
              style={{
                height: "44px",
                padding: "0 14px",
                borderRadius: "12px",
                border: "1px solid #d9d9d9",
              }}
            />
          </div>

          {error ? (
            <p style={{ color: "#b00020", margin: 0 }}>{error}</p>
          ) : null}

          {success ? (
            <p style={{ color: "#2e7d32", margin: 0 }}>{success}</p>
          ) : null}

          <div className={styles.ctas}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "40px",
                padding: "0 16px",
                borderRadius: "128px",
                border: "1px solid transparent",
                background: "#000",
                color: "#fafafa",
                fontWeight: 500,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? "Adding Book..." : "Add Book"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}