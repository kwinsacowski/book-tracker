import { Injectable } from "@nestjs/common";

type GoogleBooksVolume = {
    id: string;
    volumeInfo?: {
        title?: string;
    subtitle?: string;
    authors?: string[];
    description?: string;
    pageCount?: number;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    industryIdentifiers?: {
      type: string;
      identifier: string;
    }[];
    infoLink?: string;
    previewLink?: string;
    publishedDate?: string;
    publisher?: string;
  };
};

type GoogleBooksResponse = {
  totalItems: number;
  items?: GoogleBooksVolume[];
};

@Injectable()
export class GoogleBooksService {
  async lookupByIsbn(isbn: string) {
    const cleanIsbn = isbn.replace(/[^0-9Xx]/g, '');

    if (!cleanIsbn) {
      return null;
    }

    const params = new URLSearchParams({
      q: `isbn:${cleanIsbn}`,
      maxResults: '1',
      printType: 'books',
      projection: 'lite',
    });

    if (process.env.GOOGLE_BOOKS_API_KEY) {
      params.set('key', process.env.GOOGLE_BOOKS_API_KEY);
    }

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?${params.toString()}`,
    );

    if (!response.ok) {
      throw new Error('Google Books lookup failed.');
    }

    const data = (await response.json()) as GoogleBooksResponse;
    const volume = data.items?.[0];

    if (!volume?.volumeInfo) {
      return null;
    }

    const info = volume.volumeInfo;

    return {
      googleBooksId: volume.id,
      title: info.title ?? '',
      subtitle: info.subtitle ?? null,
      author: info.authors?.join(', ') ?? null,
      pageCount: info.pageCount ?? null,
      coverUrl:
        info.imageLinks?.thumbnail?.replace('http://', 'https://') ??
        info.imageLinks?.smallThumbnail?.replace('http://', 'https://') ??
        null,
      isbn: cleanIsbn,
      publisher: info.publisher ?? null,
      publishedDate: info.publishedDate ?? null,
      categories: info.categories ?? [],
      description: info.description ?? null,
      infoLink: info.infoLink ?? null,
      previewLink: info.previewLink ?? null,
      source: 'Google Books',
    };
  }
}