export const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  };
};

export async function getLibraryBooks(): Promise<BackendLibraryItem[]> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is missing.");
  }

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${API_URL}/books`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch library books.");
  }

  return data;
}
