import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  // UseGuards
} from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthUser } from '../auth/current-user.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { BooksService } from './books.service';
import { AddToLibraryDto } from './dto/add-to-library.dto';
import { UpdateUserBookDto } from './dto/update-userbook.dto';

@Controller('books')
// @UseGuards(JwtAuthGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findMyLibrary() {
    return this.booksService.findMyLibrary();
  }

  @Post()
  addToLibrary(@Body() body: AddToLibraryDto, @CurrentUser() user: AuthUser) {
    return this.booksService.addToLibrary(user.id, body);
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
