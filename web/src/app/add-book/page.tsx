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

export default function AddBookPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [isbn, setIsbn] = useState("");
  const [pageCount, setPageCount] = useState("");

  const [status, setStatus] = useState<ReadingStatus>("WANT_TO_READ");
  const [progressValue, setProgressValue] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [category, setCategory] = useState("");
  const [seriesOrder, setSeriesOrder] = useState("");
  const [standaloneOrSeries, setStandaloneOrSeries] = useState("");
  const [seriesStatus, setSeriesStatus] = useState("");
  const [tropes, setTropes] = useState("");
  const [spiceLevel, setSpiceLevel] = useState("");
  const [rating, setRating] = useState("");
  const [audiobookAvailable, setAudiobookAvailable] = useState("");

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

    if (progressValue.trim() !== "") {
      const progressNumber = Number(progressValue.trim());

      if (Number.isNaN(progressNumber)) {
        setError("Progress must be a number.");
        return;
      }

      if (progressNumber < 0) {
        setError("Current page cannot be less than 0.");
        return;
      }

      if (progressNumber > Number(pageCount)) {
        setError("Current page cannot be greater than total page count.");
        return;
      }
    }

    try {
      setIsSubmitting(true);

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const payload = {
        title: title.trim(),
        author: author.trim() || undefined,
        coverUrl: coverUrl.trim() || undefined,
        isbn: isbn.trim() || undefined,
        pageCount: Number(pageCount),
        status,
        progress:
          progressValue.trim() !== "" ? Number(progressValue.trim()) : undefined,
        category: category || undefined,
        seriesOrder: seriesOrder ? Number(seriesOrder) : undefined,
        standaloneOrSeries: standaloneOrSeries || undefined,
        seriesStatus: seriesStatus || undefined,
        tropes: tropes.trim() || undefined,
        spiceLevel: spiceLevel || undefined,
        rating: rating ? Number(rating) : undefined,
        audiobookAvailable: audiobookAvailable || undefined,
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

      const addedBookId = data?.book?.id ?? data?.bookId ?? data?.id ??  null;

      if (addedBookId) {
        sessionStorage.setItem("newlyAddedBookId", addedBookId);
      }

      router.push("/library");
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
            <label htmlFor="progressValue">Current Page</label>
            <input
              id="progressValue"
              type="number"
              min="0"
              max={pageCount}
              value={progressValue}
              onChange={(e) => setProgressValue(e.target.value)}
              placeholder="Enter current page"
              style={{
                height: "44px",
                padding: "0 14px",
                borderRadius: "12px",
                border: "1px solid #d9d9d9",
              }}
            />
          </div>

          <div style={{ display: "grid", gap: "16px" }}>
            <h2 style={{ margin: 0, color: "#4b2e1f" }}>Optional Tracking Fields</h2>

            <div style={{ display: "grid", gap: "8px" }}>
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  height: "44px",
                  padding: "0 14px",
                  borderRadius: "12px",
                  border: "1px solid #d9d9d9",
                }}
              >
                <option value="">Select category</option>
                <option value="ROMANCE">Romance</option>
                <option value="FANTASY">Fantasy</option>
                <option value="DARK_ROMANCE">Dark Romance</option>
                <option value="PARANORMAL">Paranormal</option>
                <option value="SCI_FI">Sci-Fi</option>
                <option value="THRILLER">Thriller</option>
                <option value="MYSTERY">Mystery</option>
                <option value="HISTORICAL_ROMANCE">Historical Romance</option>
                <option value="CONTEMPORARY_ROMANCE">Contemporary Romance</option>
                <option value="YOUNG_ADULT">Young Adult</option>
                <option value="NEW_ADULT">New Adult</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div style={{ display: "grid", gap: "8px" }}>
              <label htmlFor="seriesOrder">Series Order</label>
              <input
                id="seriesOrder"
                type="number"
                min="1"
                value={seriesOrder}
                onChange={(e) => setSeriesOrder(e.target.value)}
                style={{
                  height: "44px",
                  padding: "0 14px",
                  borderRadius: "12px",
                  border: "1px solid #d9d9d9",
                }}
              />
            </div>

            <div style={{ display: "grid", gap: "8px" }}>
              <label htmlFor="standaloneOrSeries">Standalone or Series</label>
              <select
                id="standaloneOrSeries"
                value={standaloneOrSeries}
                onChange={(e) => setStandaloneOrSeries(e.target.value)}
                style={{
                  height: "44px",
                  padding: "0 14px",
                  borderRadius: "12px",
                  border: "1px solid #d9d9d9",
                }}
              >
                <option value="">Select format</option>
                <option value="STANDALONE">Standalone</option>
                <option value="SERIES">Series</option>
              </select>
            </div>

            <div style={{ display: "grid", gap: "8px" }}>
              <label htmlFor="seriesStatus">Series Status</label>
              <select
                id="seriesStatus"
                value={seriesStatus}
                onChange={(e) => setSeriesStatus(e.target.value)}
                style={{
                  height: "44px",
                  padding: "0 14px",
                  borderRadius: "12px",
                  border: "1px solid #d9d9d9",
                }}
              >
                <option value="">Select series status</option>
                <option value="COMPLETE">Complete</option>
                <option value="ONGOING">Ongoing</option>
                <option value="UNKNOWN">Unknown</option>
              </select>
            </div>

            <div style={{ display: "grid", gap: "8px" }}>
              <label htmlFor="tropes">Tropes</label>
              <input
                id="tropes"
                value={tropes}
                onChange={(e) => setTropes(e.target.value)}
                placeholder="Enemies to Lovers, Fated Mates"
                style={{
                  height: "44px",
                  padding: "0 14px",
                  borderRadius: "12px",
                  border: "1px solid #d9d9d9",
                }}
              />
            </div>

            <div style={{ display: "grid", gap: "8px" }}>
              <label htmlFor="spiceLevel">Spice Level</label>
              <select
                id="spiceLevel"
                value={spiceLevel}
                onChange={(e) => setSpiceLevel(e.target.value)}
                style={{
                  height: "44px",
                  padding: "0 14px",
                  borderRadius: "12px",
                  border: "1px solid #d9d9d9",
                }}
              >
                <option value="">Select spice level</option>
                <option value="NONE">None</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="VERY_HIGH">Very High</option>
              </select>
            </div>

            <div style={{ display: "grid", gap: "8px" }}>
              <label htmlFor="rating">Rating</label>
              <input
                id="rating"
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                style={{
                  height: "44px",
                  padding: "0 14px",
                  borderRadius: "12px",
                  border: "1px solid #d9d9d9",
                }}
              />
            </div>

            <div style={{ display: "grid", gap: "8px" }}>
              <label htmlFor="audiobookAvailable">Audiobook Availability</label>
              <select
                id="audiobookAvailable"
                value={audiobookAvailable}
                onChange={(e) => setAudiobookAvailable(e.target.value)}
                style={{
                  height: "44px",
                  padding: "0 14px",
                  borderRadius: "12px",
                  border: "1px solid #d9d9d9",
                }}
              >
                <option value="">Select audiobook status</option>
                <option value="YES">Yes</option>
                <option value="NO">No</option>
                <option value="UNKNOWN">Unknown</option>
              </select>
            </div>
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
