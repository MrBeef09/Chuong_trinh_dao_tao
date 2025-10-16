const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding curricula...');

    try {
        // Get existing majors and knowledge blocks
        const majors = await prisma.major.findMany({
            include: {
                faculty: {
                    include: {
                        school: {
                            include: {
                                university: true
                            }
                        }
                    }
                }
            }
        });

        const knowledgeBlocks = await prisma.knowledgeBlock.findMany({
            orderBy: {
                order: 'asc'
            }
        });

        if (majors.length === 0) {
            console.log('❌ No majors found. Please seed majors first.');
            return;
        }

        if (knowledgeBlocks.length === 0) {
            console.log('❌ No knowledge blocks found. Please seed knowledge blocks first.');
            return;
        }

        // Create sample curricula for each major
        for (const major of majors) {
            // Create a main curriculum
            const curriculum = await prisma.curriculum.create({
                data: {
                    name: `Chương trình đào tạo ${major.name}`,
                    code: `${major.code}2024`,
                    description: `Chương trình đào tạo chính thức cho ngành ${major.name}, được thiết kế để cung cấp kiến thức toàn diện và kỹ năng thực hành cần thiết cho sinh viên.`,
                    version: '1.0',
                    academicYear: '2024-2025',
                    totalCredits: 140,
                    duration: 48,
                    level: 'Đại học',
                    status: 'Active',
                    majorId: major.id,
                    knowledgeBlocks: {
                        create: knowledgeBlocks.slice(0, 4).map((kb, index) => ({
                            knowledgeBlockId: kb.id,
                            requiredCredits: Math.floor(kb.minCredits + (kb.maxCredits - kb.minCredits) * 0.7),
                            order: index + 1
                        }))
                    }
                },
                include: {
                    knowledgeBlocks: true
                }
            });

            console.log(`✅ Created curriculum: ${curriculum.name}`);

            // Get subjects for this major
            const subjects = await prisma.subject.findMany({
                where: {
                    majorId: major.id,
                    status: 'Active'
                },
                take: 10 // Take first 10 subjects
            });

            if (subjects.length > 0) {
                // Add some subjects to the curriculum
                const curriculumKnowledgeBlocks = await prisma.curriculumKnowledgeBlock.findMany({
                    where: {
                        curriculumId: curriculum.id
                    },
                    include: {
                        knowledgeBlock: true
                    },
                    orderBy: {
                        order: 'asc'
                    }
                });

                let subjectIndex = 0;
                for (const ckb of curriculumKnowledgeBlocks) {
                    // Add 2-3 subjects to each knowledge block
                    const subjectsToAdd = Math.min(3, subjects.length - subjectIndex);

                    for (let i = 0; i < subjectsToAdd && subjectIndex < subjects.length; i++) {
                        await prisma.curriculumSubject.create({
                            data: {
                                curriculumId: curriculum.id,
                                subjectId: subjects[subjectIndex].id,
                                type: i === 0 ? 'Required' : 'Elective', // First subject is required, others are elective
                                credits: subjects[subjectIndex].credits,
                                semester: Math.floor(subjectIndex / 2) + 1, // Distribute across semesters
                                prerequisite: subjectIndex > 0 ? `Cần học ${subjects[subjectIndex - 1].name} trước` : null,
                                order: i + 1,
                                curriculumKnowledgeBlockId: ckb.id
                            }
                        });
                        subjectIndex++;
                    }
                }

                console.log(`✅ Added ${subjectIndex} subjects to curriculum: ${curriculum.name}`);
            }

            // Create a draft curriculum
            const draftCurriculum = await prisma.curriculum.create({
                data: {
                    name: `CTĐT ${major.name} - Phiên bản mới`,
                    code: `${major.code}2025`,
                    description: `Chương trình đào tạo cập nhật cho ngành ${major.name}, áp dụng từ năm học 2025-2026.`,
                    version: '2.0',
                    academicYear: '2025-2026',
                    totalCredits: 145,
                    duration: 48,
                    level: 'Đại học',
                    status: 'Draft',
                    majorId: major.id,
                    knowledgeBlocks: {
                        create: knowledgeBlocks.slice(0, 3).map((kb, index) => ({
                            knowledgeBlockId: kb.id,
                            requiredCredits: Math.floor(kb.minCredits + (kb.maxCredits - kb.minCredits) * 0.8),
                            order: index + 1
                        }))
                    }
                }
            });

            console.log(`✅ Created draft curriculum: ${draftCurriculum.name}`);
        }

        console.log('🎉 Curricula seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error seeding curricula:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

