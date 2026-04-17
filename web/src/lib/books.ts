const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type BackendLibraryItem = {
  id?: string;
  status: string;
  progress?: number;
  progressUnit?: string;
  book: {
    id: string;
    title: string;
    author?: string;
    pageCount?: number;
    coverUrl?: string;
    isbn?: string;
    bookGenres?: Array<{
      genre: {
        id: string;
        name: string;
      };
    }>;
  };
};

export type BackendSingleLibraryItem = BackendLibraryItem;

function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
}

async function fetchFromApi<T>(path: string): Promise<T> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is missing.");
  }

  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Request failed.");
  }

  return data as T;
}

export async function getLibraryBooks(): Promise<BackendLibraryItem[]> {
  return fetchFromApi<BackendLibraryItem[]>("/books");
}

export async function getLibraryBook(
  bookId: string
): Promise<BackendSingleLibraryItem> {
  return fetchFromApi<BackendSingleLibraryItem>(`/books/${bookId}`);
}