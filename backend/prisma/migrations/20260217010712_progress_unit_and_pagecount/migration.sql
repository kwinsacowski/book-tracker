/*
  Warnings:

  - Added the required column `pageCount` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProgressUnit" AS ENUM ('PERCENT', 'PAGES');

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "pageCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UserBook" ADD COLUMN     "progressUnit" "ProgressUnit" NOT NULL DEFAULT 'PERCENT';
