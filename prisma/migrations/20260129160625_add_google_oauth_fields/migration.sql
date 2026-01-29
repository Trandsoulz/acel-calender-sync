-- AlterTable
ALTER TABLE "Subscriber" ADD COLUMN     "googleAccessToken" TEXT,
ADD COLUMN     "googleCalendarId" TEXT,
ADD COLUMN     "googleRefreshToken" TEXT,
ADD COLUMN     "googleTokenExpiry" TIMESTAMP(3);
