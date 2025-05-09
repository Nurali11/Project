/*
  Warnings:

  - The values [OWNER] on the enum `RoleType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `regionId` on the `Restaurant` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Debt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RoleType_new" AS ENUM ('ADMIN', 'SUPER_ADMIN', 'CASHER', 'WAITER');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "RoleType_new" USING ("role"::text::"RoleType_new");
ALTER TYPE "RoleType" RENAME TO "RoleType_old";
ALTER TYPE "RoleType_new" RENAME TO "RoleType";
DROP TYPE "RoleType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Restaurant" DROP CONSTRAINT "Restaurant_regionId_fkey";

-- AlterTable
ALTER TABLE "Debt" ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "regionId",
ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Withdraw" ADD COLUMN     "orderId" TEXT;

-- AddForeignKey
ALTER TABLE "Withdraw" ADD CONSTRAINT "Withdraw_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
