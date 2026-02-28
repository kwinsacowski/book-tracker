import { Injectable } from '@nestjs/common';
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

  async addToLibrary(userId: string, dto: AddToLibraryDto) {
    const { genres, ...bookData } = dto;

    return this.prisma.$transaction(async (tx) => {
      // If ISBN provided, try to reuse an existing Book
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

      // Avoid duplicate UserBook with upsert using compound unique
      return tx.userBook.upsert({
        where: {
          userId_bookId: {
            userId,
            bookId: book.id,
          },
        },
        update: {
          // if they “add again”, just bump updatedAt
        },
        create: {
          userId,
          bookId: book.id,
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

  // Update my reading status / progress
  updateMyBook(userId: string, bookId: string, dto: UpdateUserBookDto) {
    return this.prisma.userBook.update({
      where: {
        userId_bookId: { userId, bookId },
      },
      data: dto,
      include: {
        book: {
          include: {
            bookGenres: { include: { genre: true } },
          },
        },
      },
    });
  }

  // Remove from my library
  removeFromMyLibrary(userId: string, bookId: string) {
    return this.prisma.userBook.delete({
      where: {
        userId_bookId: { userId, bookId },
      },
    });
  }
}
