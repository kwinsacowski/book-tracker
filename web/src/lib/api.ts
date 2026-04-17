const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getBooks() {
    const res = await fetch(`${API_URL}/books`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch books: ${res.status} ${res.statusText}`);
    }

    return res.json();
}
