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
  getMyLibrary(@CurrentUser() user: AuthUser) {
    return this.booksService.findMyLibrary(user.id);
  }

  @Post()
  addToLibrary(@CurrentUser() user: AuthUser, @Body() dto: AddToLibraryDto) {
    return this.booksService.addToLibrary(user.id, dto);
  }

  @Patch(':bookId')
  updateMyBook(
    @Param('bookId') bookId: string,
    @Body() body: UpdateUserBookDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.booksService.updateMyBook(user.id, bookId, body);
  }

  @Delete(':bookId')
  removeFromMyLibrary(
    @Param('bookId') bookId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.booksService.removeFromMyLibrary(user.id, bookId);
  }
}
