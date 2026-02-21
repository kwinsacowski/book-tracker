import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthUser } from '../auth/current-user.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { BooksService } from './books.service';

@Controller('books')
@UseGuards(JwtAuthGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.booksService.findAll();
  }

  @Post()
  create(
    @Body()
    body: { title: string; author?: string; pageCount: number },
    @CurrentUser() user: AuthUser,
  ) {
    return this.booksService.create(body);
  }
}
