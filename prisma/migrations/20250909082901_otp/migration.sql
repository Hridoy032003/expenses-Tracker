-- CreateTable
CREATE TABLE "public"."emailVerifiedToken" (
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 hour',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "emailVerifiedToken_pkey" PRIMARY KEY ("userId","token")
);

-- CreateIndex
CREATE UNIQUE INDEX "emailVerifiedToken_token_key" ON "public"."emailVerifiedToken"("token");
