/*
  Warnings:

  - You are about to drop the column `coverLetter` on the `Application` table. All the data in the column will be lost.
  - Added the required column `role` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "coverLetter",
ADD COLUMN     "availability" TEXT,
ADD COLUMN     "reasonForJoining" TEXT,
ADD COLUMN     "role" TEXT NOT NULL,
ADD COLUMN     "skills" TEXT[];
