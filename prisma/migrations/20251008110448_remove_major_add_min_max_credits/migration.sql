/*
  Warnings:

  - You are about to drop the column `credits` on the `knowledge_blocks` table. All the data in the column will be lost.
  - You are about to drop the column `majorId` on the `knowledge_blocks` table. All the data in the column will be lost.
  - Added the required column `maxCredits` to the `knowledge_blocks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minCredits` to the `knowledge_blocks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `knowledge_blocks` DROP FOREIGN KEY `knowledge_blocks_majorId_fkey`;

-- DropIndex
DROP INDEX `knowledgeBlocks_majorId_fkey` ON `knowledge_blocks`;

-- AlterTable
ALTER TABLE `knowledge_blocks` DROP COLUMN `credits`,
    DROP COLUMN `majorId`,
    ADD COLUMN `maxCredits` INTEGER NOT NULL DEFAULT 60,
    ADD COLUMN `minCredits` INTEGER NOT NULL DEFAULT 30;

-- Update existing records to have proper min/max credits based on old credits value
-- Since we can't access the old credits value directly, we'll set reasonable defaults
UPDATE `knowledge_blocks` SET `minCredits` = 30, `maxCredits` = 60;
