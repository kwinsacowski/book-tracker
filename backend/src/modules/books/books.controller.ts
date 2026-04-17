import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BooksService } from './books.service';
import { AddToLibraryDto } from './dto/add-to-library.dto';
import { UpdateUserBookDto } from './dto/update-userbook.dto';

@Controller('books')
@UseGuards(JwtAuthGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async getMyLibrary(@CurrentUser() user: AuthUser) {
    const library = await this.booksService.findMyLibrary(user.id);
    return library;
  }

  @Get(':bookId')
  async getMyBook(
    @Param('bookId') bookId: string,
    @CurrentUser() user: AuthUser,
  ) {
    const book = await this.booksService.findMyBook(user.id, bookId);
    return book;
  }

  @Post()
  async addToLibrary(
    @CurrentUser() user: AuthUser,
    @Body() dto: AddToLibraryDto,
  ) {
    const book = await this.booksService.addToLibrary(user.id, dto);
    return book;
  }

  @Patch(':bookId')
  async updateMyBook(
    @Param('bookId') bookId: string,
    @Body() body: UpdateUserBookDto,
    @CurrentUser() user: AuthUser,
  ) {
    const updatedBook = await this.booksService.updateMyBook(
      user.id,
      bookId,
      body,
    );
    return updatedBook;
  }

  @Delete(':bookId')
  async removeFromMyLibrary(
    @Param('bookId') bookId: string,
    @CurrentUser() user: AuthUser,
  ) {
    const removedBook = await this.booksService.removeFromMyLibrary(
      user.id,
      bookId,
    );
    return removedBook;
  }
}
