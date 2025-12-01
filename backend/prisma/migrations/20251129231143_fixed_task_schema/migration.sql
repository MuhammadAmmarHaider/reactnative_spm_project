/*
  Warnings:

  - You are about to drop the column `actualHours` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedHours` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "actualHours",
DROP COLUMN "completedAt",
DROP COLUMN "dueDate",
DROP COLUMN "estimatedHours",
DROP COLUMN "tags";
