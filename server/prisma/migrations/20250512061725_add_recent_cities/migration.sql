-- AlterTable
ALTER TABLE "User" ADD COLUMN     "recentCities" TEXT[] DEFAULT ARRAY[]::TEXT[];
