import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { searchParams } = new URL(request.url);
        const knowledgeBlockId = searchParams.get('knowledgeBlockId');
        const type = searchParams.get('type'); // Required or Elective

        const where: any = {
            curriculumId: params.id
        };

        if (knowledgeBlockId) {
            where.curriculumKnowledgeBlockId = knowledgeBlockId;
        }

        if (type) {
            where.type = type;
        }

        const curriculumSubjects = await prisma.curriculumSubject.findMany({
            where,
            include: {
                subject: true,
                curriculumKnowledgeBlock: {
                    include: {
                        knowledgeBlock: true
                    }
                }
            },
            orderBy: [
                { curriculumKnowledgeBlock: { order: 'asc' } },
                { order: 'asc' }
            ]
        });

        return NextResponse.json(curriculumSubjects);
    } catch (error) {
        console.error('Error fetching curriculum subjects:', error);
        return NextResponse.json(
            { error: 'Failed to fetch curriculum subjects' },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const {
            subjectId,
            type,
            credits,
            semester,
            prerequisite,
            coRequisite,
            order,
            curriculumKnowledgeBlockId
        } = body;

        // Validate required fields
        if (!subjectId || !type) {
            return NextResponse.json(
                { error: 'Subject ID and type are required' },
                { status: 400 }
            );
        }

        // Check if subject is already in this curriculum
        const existingSubject = await prisma.curriculumSubject.findUnique({
            where: {
                curriculumId_subjectId: {
                    curriculumId: params.id,
                    subjectId
                }
            }
        });

        if (existingSubject) {
            return NextResponse.json(
                { error: 'Subject is already in this curriculum' },
                { status: 400 }
            );
        }

        // Get subject details for credits if not provided
        const subject = await prisma.subject.findUnique({
            where: { id: subjectId }
        });

        if (!subject) {
            return NextResponse.json(
                { error: 'Subject not found' },
                { status: 404 }
            );
        }

        const curriculumSubject = await prisma.curriculumSubject.create({
            data: {
                curriculumId: params.id,
                subjectId,
                type,
                credits: credits || subject.credits,
                semester,
                prerequisite,
                coRequisite,
                order: order || 0,
                curriculumKnowledgeBlockId
            },
            include: {
                subject: true,
                curriculumKnowledgeBlock: {
                    include: {
                        knowledgeBlock: true
                    }
                }
            }
        });

        return NextResponse.json(curriculumSubject, { status: 201 });
    } catch (error) {
        console.error('Error adding subject to curriculum:', error);
        return NextResponse.json(
            { error: 'Failed to add subject to curriculum' },
            { status: 500 }
        );
    }
}

