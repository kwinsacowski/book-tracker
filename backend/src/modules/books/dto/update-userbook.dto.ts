import {
  AudiobookStatus,
  BookCategory,
  ReadingFormat,
  ReadingStatus,
  SeriesStatus,
  SpiceLevel
} from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min, IsNumber } from 'class-validator';

export class UpdateUserBookDto {
  @IsOptional()
  @IsEnum(ReadingStatus)
  status?: ReadingStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  progress?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  pageCount?: number;

  @IsOptional()
  @IsEnum(BookCategory)
  category?: BookCategory;

  @IsOptional()
  @IsInt()
  @Min(1)
  seriesOrder?: number;

  @IsOptional()
  @IsEnum(ReadingFormat)
  standaloneOrSeries?: ReadingFormat;

  @IsOptional()
  @IsEnum(SeriesStatus)
  seriesStatus?: SeriesStatus;

  @IsOptional()
  @IsString()
  tropes?: string;

  @IsOptional()
  @IsEnum(SpiceLevel)
  spiceLevel?: SpiceLevel;

 @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsEnum(AudiobookStatus)
  audiobookAvailable?: AudiobookStatus;
}