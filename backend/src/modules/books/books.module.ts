import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { GoogleBooksService } from './google-books.service';

@Module({
  controllers: [BooksController],
  providers: [BooksService, GoogleBooksService],
})
export class BooksModule {}
