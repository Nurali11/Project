/*
  Warnings:

  - Added the required column `orderId` to the `Withdraw` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'DEBT');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "Status" "OrderStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Withdraw" ADD COLUMN     "orderId" TEXT NOT NULL,
ALTER COLUMN "type" SET DEFAULT 'INCOME';

-- AddForeignKey
ALTER TABLE "Withdraw" ADD CONSTRAINT "Withdraw_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
