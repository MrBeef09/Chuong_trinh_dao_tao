-- AlterTable
ALTER TABLE `subjects` ADD COLUMN `knowledgeBlockId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `knowledge_blocks` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `credits` INTEGER NOT NULL,
    `order` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `majorId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `knowledge_blocks_code_key`(`code`),
    INDEX `knowledgeBlocks_majorId_fkey`(`majorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `subjects_knowledgeBlockId_fkey` ON `subjects`(`knowledgeBlockId`);

-- AddForeignKey
ALTER TABLE `subjects` ADD CONSTRAINT `subjects_knowledgeBlockId_fkey` FOREIGN KEY (`knowledgeBlockId`) REFERENCES `knowledge_blocks`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knowledge_blocks` ADD CONSTRAINT `knowledge_blocks_majorId_fkey` FOREIGN KEY (`majorId`) REFERENCES `majors`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
