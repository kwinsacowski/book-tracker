import { ProgressUnit, ReadingStatus } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

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
}
