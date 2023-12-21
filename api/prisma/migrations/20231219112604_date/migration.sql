/*
  Warnings:

  - Added the required column `userId` to the `PushToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PushToken" ADD COLUMN     "userId" TEXT NOT NULL;
