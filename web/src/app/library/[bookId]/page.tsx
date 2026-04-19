"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  BackendSingleLibraryItem,
  getLibraryBook,
  updateLibraryBook,
} from "@/lib/books";
import { getTrackingSettings, type TrackingSettings } from "@/lib/settings";

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
  const [settings, setSettings] = useState<TrackingSettings | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState("WANT_TO_READ");
  const [progressValue, setProgressValue] = useState("0");
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [pageCount, setPageCount] = useState("0");
  const [category, setCategory] = useState("");
  const [seriesOrder, setSeriesOrder] = useState("");
  const [standaloneOrSeries, setStandaloneOrSeries] = useState("");
  const [seriesStatus, setSeriesStatus] = useState("");
  const [tropes, setTropes] = useState("");
  const [spiceLevel, setSpiceLevel] = useState("");
  const [rating, setRating] = useState("");
  const [audiobookAvailable, setAudiobookAvailable] = useState("");

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
    setSettings(getTrackingSettings());

    let isMounted = true;

    async function loadBook() {
      try {
        setLoading(true);
        setError("");

        const data = await getLibraryBook(bookId);

        if (isMounted) {
          setItem(data);
          setStatus(data.status ?? "WANT_TO_READ");
          setProgressValue(String(data.progress ?? 0));
          setPageCount(String(data.book.pageCount ?? 0));

          setCategory(data.category ?? "");
          setSeriesOrder(data.seriesOrder ? String(data.seriesOrder) : "");
          setStandaloneOrSeries(data.standaloneOrSeries ?? "");
          setSeriesStatus(data.seriesStatus ?? "");
          setTropes(data.tropes ?? "");
          setSpiceLevel(data.spiceLevel ?? "");
          setRating(data.rating !== null && data.rating !== undefined ? String(data.rating) : "");
          setAudiobookAvailable(data.audiobookAvailable ?? "");
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

  useEffect(() => {
  function handleTrackingSettingsChange() {
    setSettings(getTrackingSettings());
  }

  window.addEventListener(
    "tracking-settings-change",
    handleTrackingSettingsChange,
  );

  return () => {
    window.removeEventListener(
      "tracking-settings-change",
      handleTrackingSettingsChange,
    );
  };
}, []);

  const currentPage = item?.progress ?? 0;
  const totalPages = item?.book.pageCount ?? 0;

  const calculatedPercent = useMemo(() => {
    return calculatePercent(currentPage, totalPages);
  }, [currentPage, totalPages]);

  const genres = item?.book.bookGenres?.map((entry) => entry.genre.name) ?? [];

  function canShowOnSingleBook(field: keyof TrackingSettings) {
  if (!settings) return false;
  return settings[field].tracked && settings[field].showOnSingleBook;
}

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaveError("");

    if (!item) return;

    const nextProgress = Number(progressValue.trim());
    const nextPageCount = Number(pageCount.trim());

    if (Number.isNaN(nextPageCount)) {
      setSaveError("Total pages must be a number.");
      return;
    }

    if (nextPageCount <= 0) {
      setSaveError("Total pages must be greater than 0.");
      return;
    }

    if (Number.isNaN(nextProgress)) {
      setSaveError("Current page must be a number.");
      return;
    }

    if (nextProgress < 0) {
      setSaveError("Current page cannot be less than 0.");
      return;
    }

    if (nextProgress > nextPageCount) {
      setSaveError("Current page cannot be greater than total page count.");
      return;
    }

    try {
      setIsSaving(true);

      const updated = await updateLibraryBook(bookId, {
        status,
        progress: nextProgress,
        pageCount: nextPageCount,
        category: category || undefined,
        seriesOrder: seriesOrder ? Number(seriesOrder) : undefined,
        standaloneOrSeries: standaloneOrSeries || undefined,
        seriesStatus: seriesStatus || undefined,
        tropes: tropes.trim() || undefined,
        spiceLevel: spiceLevel || undefined,
        rating: rating.trim() !== "" ? Number(rating) : undefined,
        audiobookAvailable: audiobookAvailable || undefined,
      });

      console.log("PATCH returned:", updated);

      const refreshed = await getLibraryBook(bookId);

      setItem(refreshed);
      setStatus(refreshed.status ?? "WANT_TO_READ");
      setProgressValue(String(refreshed.progress ?? 0));
      setPageCount(String(refreshed.book.pageCount ?? 0));
      setRating(
        refreshed.rating !== null && refreshed.rating !== undefined
          ? String(refreshed.rating)
          : ""
      );
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
                  setProgressValue(String(item.progress ?? 0));

                  setCategory(item.category ?? "");
                  setSeriesOrder(item.seriesOrder ? String(item.seriesOrder) : "");
                  setStandaloneOrSeries(item.standaloneOrSeries ?? "");
                  setSeriesStatus(item.seriesStatus ?? "");
                  setTropes(item.tropes ?? "");
                  setSpiceLevel(item.spiceLevel ?? "");
                  setRating(item.rating !== null && item.rating !== undefined ? String(item.rating) : "");
                  setAudiobookAvailable(item.audiobookAvailable ?? "");

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

                {canShowOnSingleBook("category") && item.category ? (
                  <StatCard label="Category" value={item.category} />
                ) : null}

                {canShowOnSingleBook("seriesOrder") && item.seriesOrder ? (
                  <StatCard label="Series Order" value={String(item.seriesOrder)} />
                ) : null}

                {canShowOnSingleBook("standaloneOrSeries") && item.standaloneOrSeries ? (
                  <StatCard label="Format" value={item.standaloneOrSeries} />
                ) : null}

                {canShowOnSingleBook("seriesStatus") && item.seriesStatus ? (
                  <StatCard label="Series Status" value={item.seriesStatus} />
                ) : null}

                {canShowOnSingleBook("spiceLevel") && item.spiceLevel ? (
                  <StatCard label="Spice Level" value={item.spiceLevel} />
                ) : null}

                {canShowOnSingleBook("rating") && item.rating ? (
                  <StatCard
                    label="Rating"
                    value={`${Number(item.rating).toString()}/5`}
                  />
                ) : null}

                {canShowOnSingleBook("audiobookAvailable") && item.audiobookAvailable ? (
                  <StatCard label="Audiobook" value={item.audiobookAvailable} />
                ) : null}

                {canShowOnSingleBook("tropes") && item.tropes ? (
                  <div style={{ display: "grid", gap: "4px" }}>
                    <strong style={{ color: "#4b2e1f" }}>Tropes</strong>
                    <span style={{ color: "#6b5748" }}>{item.tropes}</span>
                  </div>
                ) : null}
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

                <div style={{ display: "grid", gap: "8px" }}>
                  <label htmlFor="pageCount">Total Pages</label>
                  <input
                    id="pageCount"
                    type="number"
                    min="1"
                    value={pageCount}
                    onChange={(e) => setPageCount(e.target.value)}
                    style={{
                      height: "44px",
                      padding: "0 14px",
                      borderRadius: "12px",
                      border: "1px solid #d9d9d9",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "16px",
                }}
              >
                {canShowOnSingleBook("category") ? (
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
                ) : null}

                {canShowOnSingleBook("seriesOrder") ? (
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
                ) : null}

                {canShowOnSingleBook("standaloneOrSeries") ? (
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
                ) : null}

                {canShowOnSingleBook("seriesStatus") ? (
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
                ) : null}

                {canShowOnSingleBook("tropes") ? (
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
                ) : null}

                {canShowOnSingleBook("spiceLevel") ? (
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
                ) : null}

                {canShowOnSingleBook("rating") ? (
                  <div style={{ display: "grid", gap: "8px" }}>
                    <label htmlFor="rating">Rating</label>
                    <input
                      id="rating"
                      type="number"
                      step="0.01"
                      min="0"
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
                ) : null}

                {canShowOnSingleBook("audiobookAvailable") ? (
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
                ) : null}
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
                    setProgressValue(String(item.progress ?? 0));

                    setCategory(item.category ?? "");
                    setSeriesOrder(item.seriesOrder ? String(item.seriesOrder) : "");
                    setStandaloneOrSeries(item.standaloneOrSeries ?? "");
                    setSeriesStatus(item.seriesStatus ?? "");
                    setTropes(item.tropes ?? "");
                    setSpiceLevel(item.spiceLevel ?? "");
                    setRating(
                      item.rating !== null && item.rating !== undefined
                        ? String(item.rating)
                        : ""
                    );
                    setAudiobookAvailable(item.audiobookAvailable ?? "");

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