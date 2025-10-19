-- CreateTable
CREATE TABLE "user_rate_limits" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "limit" INTEGER NOT NULL,
    "window" INTEGER NOT NULL DEFAULT 3600,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_rate_limits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "endpoint_rate_limits" (
    "id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "limit" INTEGER NOT NULL,
    "window" INTEGER NOT NULL DEFAULT 60,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "endpoint_rate_limits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_rate_limits_userId_key" ON "user_rate_limits"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "endpoint_rate_limits_endpoint_method_key" ON "endpoint_rate_limits"("endpoint", "method");
