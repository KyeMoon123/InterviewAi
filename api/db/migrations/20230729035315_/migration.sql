-- CreateTable
CREATE TABLE "ModelRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "businessWebsite" TEXT,

    CONSTRAINT "ModelRequest_pkey" PRIMARY KEY ("id")
);
