import {
  AudiobookStatus,
  BookCategory,
  ProgressUnit,
  ReadingFormat,
  ReadingStatus,
  SeriesStatus,
  SpiceLevel,
} from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateUserBookDto {
  @IsOptional()
  @IsEnum(ReadingStatus)
  status?: ReadingStatus;

  @IsOptional()
  @IsEnum(ProgressUnit)
  progressUnit?: ProgressUnit;

  @IsOptional()
  @IsInt()
  @Min(0)
  progress?: number;

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
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsEnum(AudiobookStatus)
  audiobookAvailable?: AudiobookStatus;
}
