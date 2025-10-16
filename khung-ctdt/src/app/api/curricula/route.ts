import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const majorId = searchParams.get('majorId');
        const status = searchParams.get('status');

        const where: any = {};
        if (majorId) where.majorId = majorId;
        if (status) where.status = status;

        const curricula = await prisma.curriculum.findMany({
            where,
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
                },
                subjects: {
                    include: {
                        subject: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(curricula);
    } catch (error) {
        console.error('Error fetching curricula:', error);
        return NextResponse.json(
            { error: 'Failed to fetch curricula' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            name,
            code,
            description,
            version = '1.0',
            academicYear,
            totalCredits,
            duration,
            level = 'Đại học',
            status = 'Draft',
            majorId,
            knowledgeBlocks = []
        } = body;

        // Validate required fields
        if (!name || !code || !academicYear || !totalCredits || !duration || !majorId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if curriculum code already exists for this major
        const existingCurriculum = await prisma.curriculum.findUnique({
            where: {
                code_majorId: {
                    code,
                    majorId
                }
            }
        });

        if (existingCurriculum) {
            return NextResponse.json(
                { error: 'Curriculum code already exists for this major' },
                { status: 400 }
            );
        }

        // Create curriculum with knowledge blocks
        const curriculum = await prisma.curriculum.create({
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
                majorId,
                knowledgeBlocks: {
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
                        knowledgeBlock: true
                    },
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        });

        return NextResponse.json(curriculum, { status: 201 });
    } catch (error) {
        console.error('Error creating curriculum:', error);
        return NextResponse.json(
            { error: 'Failed to create curriculum' },
            { status: 500 }
        );
    }
}

