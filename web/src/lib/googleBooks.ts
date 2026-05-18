import { getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type BookLookupResult = {
  googleBooksId: string;
  title: string;
  subtitle?: string | null;
  author?: string | null;
  pageCount?: number | null;
  coverUrl?: string | null;
  isbn: string;
  publisher?: string | null;
  publishedDate?: string | null;
  categories: string[];
  description?: string | null;
  infoLink?: string | null;
  previewLink?: string | null;
  source: "Google Books";
};

export async function lookupBookByIsbn(isbn: string) {
  const token = getToken();

  const response = await fetch(`${API_URL}/books/lookup/isbn/${isbn}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Could not look up book.");
  }

  return (await response.json()) as BookLookupResult | null;
}