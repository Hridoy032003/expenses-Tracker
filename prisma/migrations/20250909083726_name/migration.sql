/*
  Warnings:

  - A unique constraint covering the columns `[identifier]` on the table `emailVerifiedToken` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."emailVerifiedToken" ALTER COLUMN "expires" SET DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 hour';

-- CreateIndex
CREATE UNIQUE INDEX "emailVerifiedToken_identifier_key" ON "public"."emailVerifiedToken"("identifier");
