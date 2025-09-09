/*
  Warnings:

  - The primary key for the `emailVerifiedToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `emailVerifiedToken` table. All the data in the column will be lost.
  - Added the required column `identifier` to the `emailVerifiedToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."emailVerifiedToken" DROP CONSTRAINT "emailVerifiedToken_pkey",
DROP COLUMN "userId",
ADD COLUMN     "identifier" TEXT NOT NULL,
ALTER COLUMN "expires" SET DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 hour';
