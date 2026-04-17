"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  BackendSingleLibraryItem,
  getLibraryBook,
  updateLibraryBook,
} from "@/lib/books";

function formatStatus(status: string) {
  switch (status) {
    case "WANT_TO_READ":
      return "Want to Read";
    case "READING":
      return "Reading";
    case "COMPLETED":
      return "Completed";
    case "PAUSED":
      return "Paused";
    case "DNF":
      return "DNF";
    default:
      return status;
  }
}

function calculatePercent(currentPage: number, totalPages: number) {
  if (!totalPages || totalPages <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((currentPage / totalPages) * 100));
}

export default function SingleBookPage() {
  const params = useParams<{ bookId: string }>();
  const bookId = params.bookId;

  const [item, setItem] = useState<BackendSingleLibraryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState("WANT_TO_READ");
  const [progressUnit, setProgressUnit] = useState("PAGES");
  const [progressValue, setProgressValue] = useState("0");
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      setError("");
      return;
    }

    setIsLoggedIn(true);

    let isMounted = true;

    async function loadBook() {
      try {
        setLoading(true);
        setError("");

        const data = await getLibraryBook(bookId);

        if (isMounted) {
          setItem(data);
          setStatus(data.status ?? "WANT_TO_READ");
          setProgressUnit(data.progressUnit ?? "PAGES");
          setProgressValue(String(data.progress ?? 0));
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

    void loadBook();

    return () => {
      isMounted = false;
    };
  }, [bookId]);

  const currentPage = item?.progress ?? 0;
  const totalPages = item?.book.pageCount ?? 0;

  const calculatedPercent = useMemo(() => {
    return calculatePercent(currentPage, totalPages);
  }, [currentPage, totalPages]);

  const genres = item?.book.bookGenres?.map((entry) => entry.genre.name) ?? [];

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaveError("");

    if (!item) return;

    const nextProgress = Number(progressValue.trim());

    if (Number.isNaN(nextProgress)) {
      setSaveError("Current page must be a number.");
      return;
    }

    if (nextProgress < 0) {
      setSaveError("Current page cannot be less than 0.");
      return;
    }

    if (nextProgress > (item.book.pageCount ?? 0)) {
      setSaveError("Current page cannot be greater than total page count.");
      return;
    }

    try {
      setIsSaving(true);

      const updated = await updateLibraryBook(bookId, {
        status,
        progressUnit,
        progress: nextProgress,
      });

      setItem(updated);
      setStatus(updated.status ?? "WANT_TO_READ");
      setProgressUnit(updated.progressUnit ?? "PAGES");
      setProgressValue(String(updated.progress ?? 0));
      setIsEditing(false);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to save changes.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <main style={{ padding: "32px", display: "grid", gap: "20px" }}>
        <h1 style={{ margin: 0, fontSize: "32px", color: "#4b2e1f" }}>
          Book Details
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
          <h2 style={{ margin: 0 }}>Log in to view book details</h2>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            Sign in or create an account to view and edit your saved books.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
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

  if (loading) {
    return (
      <main style={{ padding: "32px" }}>
        <div>Loading book details...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ padding: "32px", display: "grid", gap: "16px" }}>
        <Link href="/library" style={{ color: "#5b3b2f", textDecoration: "none" }}>
          ← Back to Library
        </Link>
        <div style={{ color: "#b42318" }}>{error}</div>
      </main>
    );
  }

  if (!item) {
    return (
      <main style={{ padding: "32px", display: "grid", gap: "16px" }}>
        <Link href="/library" style={{ color: "#5b3b2f", textDecoration: "none" }}>
          ← Back to Library
        </Link>
        <div>Book not found.</div>
      </main>
    );
  }

  return (
    <main style={{ padding: "32px", display: "grid", gap: "24px" }}>
      <Link href="/library" style={{ color: "#5b3b2f", textDecoration: "none" }}>
        ← Back to Library
      </Link>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(220px, 280px) 1fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <div
          style={{
            minHeight: "380px",
            borderRadius: "20px",
            background: item.book.coverUrl
              ? `center / cover no-repeat url(${item.book.coverUrl})`
              : "linear-gradient(to bottom, #7d5a50, #5b3b2f)",
            boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
          }}
        />

        <div
          style={{
            display: "grid",
            gap: "16px",
            padding: "24px",
            borderRadius: "20px",
            background: "#f7f1e8",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "grid", gap: "8px" }}>
              <h1 style={{ margin: 0, fontSize: "32px", color: "#4b2e1f" }}>
                {item.book.title}
              </h1>
              <p style={{ margin: 0, color: "#6b5748", fontSize: "18px" }}>
                {item.book.author || "Unknown Author"}
              </p>
            </div>

            {!isEditing ? (
              <button
                type="button"
                onClick={() => {
                  setStatus(item.status ?? "WANT_TO_READ");
                  setProgressUnit(item.progressUnit ?? "PAGES");
                  setProgressValue(String(item.progress ?? 0));
                  setSaveError("");
                  setIsEditing(true);
                }}
                style={{
                  minHeight: "44px",
                  padding: "0 16px",
                  borderRadius: "999px",
                  border: "none",
                  background: "#5b3b2f",
                  color: "#fffaf3",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Edit Progress
              </button>
            ) : null}
          </div>

          {!isEditing ? (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "16px",
                }}
              >
                <StatCard label="Status" value={formatStatus(item.status)} />
                <StatCard label="Current Page" value={String(currentPage)} />
                <StatCard label="Total Pages" value={String(totalPages)} />
                <StatCard label="Progress" value={`${calculatedPercent}%`} />
              </div>

              <div style={{ display: "grid", gap: "8px" }}>
                <div
                  style={{
                    height: "14px",
                    borderRadius: "999px",
                    background: "#e7dccf",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${calculatedPercent}%`,
                      height: "100%",
                      background: "#7d5a50",
                      borderRadius: "999px",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
                <small style={{ color: "#6b5748" }}>
                  {currentPage} / {totalPages} pages read
                </small>
              </div>
            </>
          ) : (
            <form onSubmit={handleSave} style={{ display: "grid", gap: "16px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "16px",
                }}
              >
                <div style={{ display: "grid", gap: "8px" }}>
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    style={{
                      height: "44px",
                      padding: "0 14px",
                      borderRadius: "12px",
                      border: "1px solid #d9d9d9",
                    }}
                  >
                    <option value="WANT_TO_READ">Want to Read</option>
                    <option value="READING">Reading</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="PAUSED">Paused</option>
                    <option value="DNF">DNF</option>
                  </select>
                </div>

                <div style={{ display: "grid", gap: "8px" }}>
                  <label htmlFor="progressUnit">Progress Unit</label>
                  <select
                    id="progressUnit"
                    value={progressUnit}
                    onChange={(e) => setProgressUnit(e.target.value)}
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
                  <label htmlFor="progressValue">Current Page</label>
                  <input
                    id="progressValue"
                    type="number"
                    min="0"
                    max={totalPages}
                    value={progressValue}
                    onChange={(e) => setProgressValue(e.target.value)}
                    style={{
                      height: "44px",
                      padding: "0 14px",
                      borderRadius: "12px",
                      border: "1px solid #d9d9d9",
                    }}
                  />
                </div>
              </div>

              <div style={{ color: "#6b5748", fontSize: "14px" }}>
                Percentage is calculated automatically from current page and total
                pages.
              </div>

              {saveError ? (
                <div style={{ color: "#b42318" }}>{saveError}</div>
              ) : null}

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    minHeight: "44px",
                    padding: "0 16px",
                    borderRadius: "999px",
                    border: "none",
                    background: "#5b3b2f",
                    color: "#fffaf3",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStatus(item.status ?? "WANT_TO_READ");
                    setProgressUnit(item.progressUnit ?? "PAGES");
                    setProgressValue(String(item.progress ?? 0));
                    setSaveError("");
                    setIsEditing(false);
                  }}
                  style={{
                    minHeight: "44px",
                    padding: "0 16px",
                    borderRadius: "999px",
                    border: "1px solid #5b3b2f",
                    background: "transparent",
                    color: "#5b3b2f",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {genres.length > 0 ? (
            <div style={{ display: "grid", gap: "8px" }}>
              <strong style={{ color: "#4b2e1f" }}>Genres</strong>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {genres.map((genre) => (
                  <span
                    key={genre}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "999px",
                      background: "#eadfce",
                      color: "#5b4636",
                      fontSize: "14px",
                    }}
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {item.book.isbn ? (
            <div style={{ display: "grid", gap: "4px" }}>
              <strong style={{ color: "#4b2e1f" }}>ISBN</strong>
              <span style={{ color: "#6b5748" }}>{item.book.isbn}</span>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "16px",
        background: "#fffaf3",
        border: "1px solid #eadfce",
        display: "grid",
        gap: "6px",
      }}
    >
      <span style={{ fontSize: "13px", color: "#7b6859" }}>{label}</span>
      <strong style={{ fontSize: "20px", color: "#4b2e1f" }}>{value}</strong>
    </div>
  );
}