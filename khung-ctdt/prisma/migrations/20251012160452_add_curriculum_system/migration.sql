-- CreateTable
CREATE TABLE `curricula` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `version` VARCHAR(191) NOT NULL DEFAULT '1.0',
    `academicYear` VARCHAR(191) NOT NULL,
    `totalCredits` INTEGER NOT NULL,
    `duration` INTEGER NOT NULL,
    `level` VARCHAR(191) NOT NULL DEFAULT 'Đại học',
    `status` VARCHAR(191) NOT NULL DEFAULT 'Draft',
    `approvedBy` VARCHAR(191) NULL,
    `approvedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `majorId` VARCHAR(191) NOT NULL,

    INDEX `curricula_majorId_fkey`(`majorId`),
    UNIQUE INDEX `curricula_code_majorId_key`(`code`, `majorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `curriculum_knowledge_blocks` (
    `id` VARCHAR(191) NOT NULL,
    `requiredCredits` INTEGER NOT NULL,
    `order` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `curriculumId` VARCHAR(191) NOT NULL,
    `knowledgeBlockId` VARCHAR(191) NOT NULL,

    INDEX `curriculumKnowledgeBlocks_curriculumId_fkey`(`curriculumId`),
    INDEX `curriculumKnowledgeBlocks_knowledgeBlockId_fkey`(`knowledgeBlockId`),
    UNIQUE INDEX `curriculum_knowledge_blocks_curriculumId_knowledgeBlockId_key`(`curriculumId`, `knowledgeBlockId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `curriculum_subjects` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `credits` INTEGER NOT NULL,
    `semester` INTEGER NULL,
    `prerequisite` TEXT NULL,
    `coRequisite` TEXT NULL,
    `order` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `curriculumId` VARCHAR(191) NOT NULL,
    `subjectId` VARCHAR(191) NOT NULL,
    `curriculumKnowledgeBlockId` VARCHAR(191) NULL,

    INDEX `curriculumSubjects_curriculumId_fkey`(`curriculumId`),
    INDEX `curriculumSubjects_subjectId_fkey`(`subjectId`),
    INDEX `curriculumSubjects_curriculumKnowledgeBlockId_fkey`(`curriculumKnowledgeBlockId`),
    UNIQUE INDEX `curriculum_subjects_curriculumId_subjectId_key`(`curriculumId`, `subjectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `curricula` ADD CONSTRAINT `curricula_majorId_fkey` FOREIGN KEY (`majorId`) REFERENCES `majors`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `curriculum_knowledge_blocks` ADD CONSTRAINT `curriculum_knowledge_blocks_curriculumId_fkey` FOREIGN KEY (`curriculumId`) REFERENCES `curricula`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `curriculum_knowledge_blocks` ADD CONSTRAINT `curriculum_knowledge_blocks_knowledgeBlockId_fkey` FOREIGN KEY (`knowledgeBlockId`) REFERENCES `knowledge_blocks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `curriculum_subjects` ADD CONSTRAINT `curriculum_subjects_curriculumId_fkey` FOREIGN KEY (`curriculumId`) REFERENCES `curricula`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `curriculum_subjects` ADD CONSTRAINT `curriculum_subjects_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `subjects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `curriculum_subjects` ADD CONSTRAINT `curriculum_subjects_curriculumKnowledgeBlockId_fkey` FOREIGN KEY (`curriculumKnowledgeBlockId`) REFERENCES `curriculum_knowledge_blocks`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
