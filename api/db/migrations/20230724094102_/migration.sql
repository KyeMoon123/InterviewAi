-- AlterTable
ALTER TABLE "User" ADD COLUMN     "subscriptionCancelAtPeriodEnd" BOOLEAN,
ADD COLUMN     "subscriptionCurrentPeriodEnd" TIMESTAMP(3);
