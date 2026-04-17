-- CreateEnum
CREATE TYPE "ReadingFormat" AS ENUM ('STANDALONE', 'SERIES');

-- CreateEnum
CREATE TYPE "SeriesStatus" AS ENUM ('COMPLETE', 'ONGOING', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "SpiceLevel" AS ENUM ('NONE', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH');

-- CreateEnum
CREATE TYPE "AudiobookStatus" AS ENUM ('YES', 'NO', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "BookCategory" AS ENUM ('ROMANCE', 'FANTASY', 'DARK_ROMANCE', 'PARANORMAL', 'SCI_FI', 'THRILLER', 'MYSTERY', 'HISTORICAL_ROMANCE', 'CONTEMPORARY_ROMANCE', 'YOUNG_ADULT', 'NEW_ADULT', 'OTHER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "trackingPreferences" JSONB;

-- AlterTable
ALTER TABLE "UserBook" ADD COLUMN     "audiobookAvailable" "AudiobookStatus",
ADD COLUMN     "category" "BookCategory",
ADD COLUMN     "rating" INTEGER,
ADD COLUMN     "seriesOrder" INTEGER,
ADD COLUMN     "seriesStatus" "SeriesStatus",
ADD COLUMN     "spiceLevel" "SpiceLevel",
ADD COLUMN     "standaloneOrSeries" "ReadingFormat",
ADD COLUMN     "tropes" TEXT;
