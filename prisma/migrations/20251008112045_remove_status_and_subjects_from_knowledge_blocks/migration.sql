/*
  Warnings:

  - You are about to drop the column `status` on the `knowledge_blocks` table. All the data in the column will be lost.
  - You are about to drop the column `knowledgeBlockId` on the `subjects` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `subjects` DROP FOREIGN KEY `subjects_knowledgeBlockId_fkey`;

-- DropIndex
DROP INDEX `subjects_knowledgeBlockId_fkey` ON `subjects`;

-- AlterTable
ALTER TABLE `knowledge_blocks` DROP COLUMN `status`,
    ALTER COLUMN `maxCredits` DROP DEFAULT,
    ALTER COLUMN `minCredits` DROP DEFAULT;

-- AlterTable
ALTER TABLE `subjects` DROP COLUMN `knowledgeBlockId`;
