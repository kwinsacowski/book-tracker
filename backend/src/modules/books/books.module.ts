import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { GoogleBooksService } from './google-books.service';

@Module({
  controllers: [BooksController, GoogleBooksService],
  providers: [BooksService],
})
export class BooksModule {}
