import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class AddToLibraryDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsInt()
  @Min(1)
  pageCount: number;

  @IsOptional()
  @IsString()
  isbn?: string;

  @IsOptional()
  @IsString()
  coverUrl?: string;

  @IsOptional()
  @IsString({ each: true })
  genres?: string[];
}
