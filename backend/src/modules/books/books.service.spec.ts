import { Test } from '@nestjs/testing';
import { BooksService } from './books.service';
import { PrismaService } from '../../common/prisma/prisma.service';

describe('BooksService', () => {
  let service: BooksService;

  const prismaMock = {
    userBook: {
      findMany: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    book: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: PrismaService,
          useValue: prismaMock as unknown as PrismaService,
        },
      ],
    }).compile();

    service = moduleRef.get(BooksService);
  });

  it('findMyLibrary calls prisma.userBook.findMany scoped by userId', async () => {
    prismaMock.userBook.findMany = jest.fn().mockResolvedValueOnce([]);

    await service.findMyLibrary('user-1');

    expect(prismaMock.userBook.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 'user-1' },
      }),
    );
  });

  it('updateMyBook updates using compound key', async () => {
    prismaMock.userBook.update = jest.fn().mockResolvedValueOnce({});

    await service.updateMyBook('user-1', 'book-1', { progress: 10 });

    expect(prismaMock.userBook.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId_bookId: { userId: 'user-1', bookId: 'book-1' } },
        data: { progress: 10 },
      }),
    );
  });

  it('removeFromMyLibrary deletes using compound key', async () => {
    prismaMock.userBook.delete = jest.fn().mockResolvedValueOnce({});

    await service.removeFromMyLibrary('user-1', 'book-1');

    expect(prismaMock.userBook.delete).toHaveBeenCalledWith({
      where: { userId_bookId: { userId: 'user-1', bookId: 'book-1' } },
    });
  });

  it('addToLibrary runs in a transaction and upserts UserBook', async () => {
    prismaMock.$transaction = jest.fn(
      async <T>(fn: (tx: unknown) => Promise<T>) => {
        const tx = {
          book: {
            findFirst: jest.fn().mockResolvedValueOnce(null),
            create: jest.fn().mockResolvedValueOnce({ id: 'book-1' }),
          },
          userBook: {
            upsert: jest.fn().mockResolvedValueOnce({ book: { id: 'book-1' } }),
          },
        };

        return fn(tx);
      },
    );

    const res = await service.addToLibrary('user-1', {
      title: 'Test',
      pageCount: 123,
      genres: ['Fantasy'],
    });

    expect(prismaMock.$transaction).toHaveBeenCalled();
    expect(res).toEqual({ book: { id: 'book-1' } });
  });
});
