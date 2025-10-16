/*
  Warnings:

  - You are about to drop the column `credits` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `hours` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `objectives` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `prerequisites` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `semester` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `syllabus` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the `lecturer_courses` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `academicYear` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `educationLevel` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `program` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `lecturer_courses` DROP FOREIGN KEY `lecturer_courses_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `lecturer_courses` DROP FOREIGN KEY `lecturer_courses_lecturerId_fkey`;

-- AlterTable
ALTER TABLE `courses` DROP COLUMN `credits`,
    DROP COLUMN `hours`,
    DROP COLUMN `imageUrl`,
    DROP COLUMN `objectives`,
    DROP COLUMN `prerequisites`,
    DROP COLUMN `semester`,
    DROP COLUMN `syllabus`,
    ADD COLUMN `academicYear` VARCHAR(191) NOT NULL,
    ADD COLUMN `educationLevel` VARCHAR(191) NOT NULL,
    ADD COLUMN `endDate` DATETIME(3) NULL,
    ADD COLUMN `program` VARCHAR(191) NOT NULL,
    ADD COLUMN `startDate` DATETIME(3) NULL,
    ADD COLUMN `studentCount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'Đang đào tạo';

-- DropTable
DROP TABLE `lecturer_courses`;

-- CreateTable
CREATE TABLE `subjects` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `credits` INTEGER NOT NULL,
    `hours` INTEGER NULL,
    `semester` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NULL,
    `syllabus` TEXT NULL,
    `prerequisites` TEXT NULL,
    `objectives` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `majorId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `subjects_code_key`(`code`),
    INDEX `subjects_majorId_fkey`(`majorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lecturer_subjects` (
    `id` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'Instructor',
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `lecturerId` VARCHAR(191) NOT NULL,
    `subjectId` VARCHAR(191) NOT NULL,

    INDEX `lecturerSubject_lecturerId_fkey`(`lecturerId`),
    INDEX `lecturerSubject_subjectId_fkey`(`subjectId`),
    UNIQUE INDEX `lecturer_subjects_lecturerId_subjectId_key`(`lecturerId`, `subjectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `subjects` ADD CONSTRAINT `subjects_majorId_fkey` FOREIGN KEY (`majorId`) REFERENCES `majors`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lecturer_subjects` ADD CONSTRAINT `lecturer_subjects_lecturerId_fkey` FOREIGN KEY (`lecturerId`) REFERENCES `lecturers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lecturer_subjects` ADD CONSTRAINT `lecturer_subjects_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `subjects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
