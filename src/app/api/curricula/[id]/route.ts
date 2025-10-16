import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const curriculum = await prisma.curriculum.findUnique({
            where: { id: params.id },
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

        if (!curriculum) {
            return NextResponse.json(
                { error: 'Curriculum not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(curriculum);
    } catch (error) {
        console.error('Error fetching curriculum:', error);
        return NextResponse.json(
            { error: 'Failed to fetch curriculum' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const {
            name,
            code,
            description,
            version,
            academicYear,
            totalCredits,
            duration,
            level,
            status,
            approvedBy,
            approvedAt,
            knowledgeBlocks = []
        } = body;

        // Check if curriculum exists
        const existingCurriculum = await prisma.curriculum.findUnique({
            where: { id: params.id }
        });

        if (!existingCurriculum) {
            return NextResponse.json(
                { error: 'Curriculum not found' },
                { status: 404 }
            );
        }

        // If code is being changed, check for duplicates
        if (code && code !== existingCurriculum.code) {
            const duplicateCurriculum = await prisma.curriculum.findUnique({
                where: {
                    code_majorId: {
                        code,
                        majorId: existingCurriculum.majorId
                    }
                }
            });

            if (duplicateCurriculum) {
                return NextResponse.json(
                    { error: 'Curriculum code already exists for this major' },
                    { status: 400 }
                );
            }
        }

        // Update curriculum and its knowledge blocks
        const updatedCurriculum = await prisma.curriculum.update({
            where: { id: params.id },
            data: {
                name,
                code,
                description,
                version,
                academicYear,
                totalCredits,
                duration,
                level,
                status,
                approvedBy,
                approvedAt,
                knowledgeBlocks: {
                    deleteMany: {},
                    create: knowledgeBlocks.map((kb: any, index: number) => ({
                        knowledgeBlockId: kb.knowledgeBlockId,
                        requiredCredits: kb.requiredCredits,
                        order: kb.order || index + 1
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
                }
            }
        });

        return NextResponse.json(updatedCurriculum);
    } catch (error) {
        console.error('Error updating curriculum:', error);
        return NextResponse.json(
            { error: 'Failed to update curriculum' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Check if curriculum exists
        const existingCurriculum = await prisma.curriculum.findUnique({
            where: { id: params.id }
        });

        if (!existingCurriculum) {
            return NextResponse.json(
                { error: 'Curriculum not found' },
                { status: 404 }
            );
        }

        // Delete curriculum (this will cascade delete related records)
        await prisma.curriculum.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ message: 'Curriculum deleted successfully' });
    } catch (error) {
        console.error('Error deleting curriculum:', error);
        return NextResponse.json(
            { error: 'Failed to delete curriculum' },
            { status: 500 }
        );
    }
}

