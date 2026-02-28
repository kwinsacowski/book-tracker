import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export enum ReadingStatus {
  WANT_TO_READ = 'WANT_TO_READ',
  READING = 'READING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  DNF = 'DNF',
}

export enum ProgressUnit {
  PERCENT = 'PERCENT',
  PAGES = 'PAGES',
}

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
