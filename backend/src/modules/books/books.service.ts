import { Injectable } from '@nestjs/common';
import { ProgressUnit, ReadingStatus } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AddToLibraryDto } from './dto/add-to-library.dto';
import { UpdateUserBookDto } from './dto/update-userbook.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  findMyLibrary(userId: string) {
    return this.prisma.userBook.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        book: {
          include: {
            bookGenres: {
              include: { genre: true },
            },
          },
        },
      },
    });
  }

  findMyBook(userId: string, bookId: string) {
    return this.prisma.userBook.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
      include: {
        book: {
          include: {
            bookGenres: {
              include: { genre: true },
            },
          },
        },
      },
    });
  }

  async addToLibrary(userId: string, dto: AddToLibraryDto) {
    const {
      genres,
      status,
      progress,
      progressUnit,
      category,
      seriesOrder,
      standaloneOrSeries,
      seriesStatus,
      tropes,
      spiceLevel,
      rating,
      audiobookAvailable,
      ...bookData
    } = dto;

    return this.prisma.$transaction(async (tx) => {
      const existing =
        bookData.isbn != null
          ? await tx.book.findFirst({ where: { isbn: bookData.isbn } })
          : null;

      const book =
        existing ??
        (await tx.book.create({
          data: {
            ...bookData,
            bookGenres: genres?.length
              ? {
                  create: genres.map((name) => ({
                    genre: {
                      connectOrCreate: {
                        where: { name },
                        create: { name },
                      },
                    },
                  })),
                }
              : undefined,
          },
        }));

      return tx.userBook.upsert({
        where: {
          userId_bookId: {
            userId,
            bookId: book.id,
          },
        },
        update: {
          status: status ?? ReadingStatus.WANT_TO_READ,
          progress: progress ?? 0,
          progressUnit: progressUnit ?? ProgressUnit.PAGES,
          category: category ?? null,
          seriesOrder: seriesOrder ?? null,
          standaloneOrSeries: standaloneOrSeries ?? null,
          seriesStatus: seriesStatus ?? null,
          tropes: tropes ?? null,
          spiceLevel: spiceLevel ?? null,
          rating: rating ?? null,
          audiobookAvailable: audiobookAvailable ?? null,
        },
        create: {
          userId,
          bookId: book.id,
          status: status ?? ReadingStatus.WANT_TO_READ,
          progress: progress ?? 0,
          progressUnit: progressUnit ?? ProgressUnit.PAGES,
          category: category ?? null,
          seriesOrder: seriesOrder ?? null,
          standaloneOrSeries: standaloneOrSeries ?? null,
          seriesStatus: seriesStatus ?? null,
          tropes: tropes ?? null,
          spiceLevel: spiceLevel ?? null,
          rating: rating ?? null,
          audiobookAvailable: audiobookAvailable ?? null,
        },
        include: {
          book: {
            include: {
              bookGenres: { include: { genre: true } },
            },
          },
        },
      });
    });
  }

  async updateMyBook(userId: string, bookId: string, dto: UpdateUserBookDto) {
  const { pageCount, ...userBookData } = dto;

  return this.prisma.$transaction(async (tx) => {
    if (pageCount !== undefined) {
      await tx.book.update({
        where: { id: bookId },
        data: { pageCount },
      });
    }

    return tx.userBook.update({
      where: {
        userId_bookId: { userId, bookId },
      },
      data: userBookData,
      include: {
        book: {
          include: {
            bookGenres: { include: { genre: true } },
          },
        },
      },
    });
  });
}

  removeFromMyLibrary(userId: string, bookId: string) {
    return this.prisma.userBook.delete({
      where: {
        userId_bookId: { userId, bookId },
      },
    });
  }
}
