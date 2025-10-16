import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { newName, newCode, newAcademicYear } = body;

        // Validate required fields
        if (!newName || !newCode || !newAcademicYear) {
            return NextResponse.json(
                { error: 'Missing required fields: newName, newCode, newAcademicYear' },
                { status: 400 }
            );
        }

        // Get the original curriculum with all related data
        const originalCurriculum = await prisma.curriculum.findUnique({
            where: { id: params.id },
            include: {
                major: true,
                knowledgeBlocks: {
                    include: {
                        knowledgeBlock: true,
                        subjects: {
                            include: {
                                subject: true
                            }
                        }
                    },
                    orderBy: {
                        order: 'asc'
                    }
                },
                subjects: {
                    include: {
                        subject: true
                    }
                }
            }
        });

        if (!originalCurriculum) {
            return NextResponse.json(
                { error: 'Original curriculum not found' },
                { status: 404 }
            );
        }

        // Check if new curriculum code already exists for this major
        const existingCurriculum = await prisma.curriculum.findUnique({
            where: {
                code_majorId: {
                    code: newCode,
                    majorId: originalCurriculum.majorId
                }
            }
        });

        if (existingCurriculum) {
            return NextResponse.json(
                { error: 'Curriculum code already exists for this major' },
                { status: 400 }
            );
        }

        // Create new curriculum with copied data
        const newCurriculum = await prisma.curriculum.create({
            data: {
                name: newName,
                code: newCode,
                description: originalCurriculum.description,
                version: '1.0', // Reset version for new curriculum
                academicYear: newAcademicYear,
                totalCredits: originalCurriculum.totalCredits,
                duration: originalCurriculum.duration,
                level: originalCurriculum.level,
                status: 'Draft', // New curriculum starts as draft
                majorId: originalCurriculum.majorId,
                knowledgeBlocks: {
                    create: originalCurriculum.knowledgeBlocks.map(kb => ({
                        knowledgeBlockId: kb.knowledgeBlockId,
                        requiredCredits: kb.requiredCredits,
                        order: kb.order
                    }))
                }
            },
            include: {
                major: {
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
                },
                knowledgeBlocks: {
                    include: {
                        knowledgeBlock: true
                    },
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        });

        // Copy all subjects from original curriculum
        const curriculumKnowledgeBlocks = await prisma.curriculumKnowledgeBlock.findMany({
            where: {
                curriculumId: newCurriculum.id
            },
            orderBy: {
                order: 'asc'
            }
        });

        // Create mapping between original and new knowledge blocks
        const knowledgeBlockMapping = new Map();
        originalCurriculum.knowledgeBlocks.forEach((originalKB, index) => {
            if (index < curriculumKnowledgeBlocks.length) {
                knowledgeBlockMapping.set(originalKB.id, curriculumKnowledgeBlocks[index].id);
            }
        });

        // Copy subjects
        for (const originalSubject of originalCurriculum.subjects) {
            const originalKBId = originalCurriculum.knowledgeBlocks.find(
                kb => kb.subjects.some(s => s.id === originalSubject.id)
            )?.id;

            const newKBId = originalKBId ? knowledgeBlockMapping.get(originalKBId) : null;

            await prisma.curriculumSubject.create({
                data: {
                    curriculumId: newCurriculum.id,
                    subjectId: originalSubject.subjectId,
                    type: originalSubject.type,
                    credits: originalSubject.credits,
                    semester: originalSubject.semester,
                    prerequisite: originalSubject.prerequisite,
                    coRequisite: originalSubject.coRequisite,
                    order: originalSubject.order,
                    curriculumKnowledgeBlockId: newKBId
                }
            });
        }

        // Get the complete new curriculum with all data
        const completeNewCurriculum = await prisma.curriculum.findUnique({
            where: { id: newCurriculum.id },
            include: {
                major: {
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
                },
                knowledgeBlocks: {
                    include: {
                        knowledgeBlock: true,
                        subjects: {
                            include: {
                                subject: true
                            },
                            orderBy: {
                                order: 'asc'
                            }
                        }
                    },
                    orderBy: {
                        order: 'asc'
                    }
                },
                subjects: {
                    include: {
                        subject: true
                    }
                }
            }
        });

        return NextResponse.json({
            message: 'Curriculum copied successfully',
            curriculum: completeNewCurriculum
        }, { status: 201 });

    } catch (error) {
        console.error('Error copying curriculum:', error);
        return NextResponse.json(
            { error: 'Failed to copy curriculum' },
            { status: 500 }
        );
    }
}

