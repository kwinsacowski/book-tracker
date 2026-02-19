import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { title: string; author?: string; pageCount: number }) {
    return this.prisma.book.create({ data });
  }

  findAll() {
    return this.prisma.book.findMany();
  }
}