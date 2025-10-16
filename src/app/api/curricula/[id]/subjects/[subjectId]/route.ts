import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string; subjectId: string } }
) {
    try {
        const body = await request.json();
        const {
            type,
            credits,
            semester,
            prerequisite,
            coRequisite,
            order,
            curriculumKnowledgeBlockId
        } = body;

        // Check if curriculum subject exists
        const existingCurriculumSubject = await prisma.curriculumSubject.findUnique({
            where: {
                curriculumId_subjectId: {
                    curriculumId: params.id,
                    subjectId: params.subjectId
                }
            }
        });

        if (!existingCurriculumSubject) {
            return NextResponse.json(
                { error: 'Subject not found in this curriculum' },
                { status: 404 }
            );
        }

        const updatedCurriculumSubject = await prisma.curriculumSubject.update({
            where: {
                curriculumId_subjectId: {
                    curriculumId: params.id,
                    subjectId: params.subjectId
                }
            },
            data: {
                type,
                credits,
                semester,
                prerequisite,
                coRequisite,
                order,
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

        return NextResponse.json(updatedCurriculumSubject);
    } catch (error) {
        console.error('Error updating curriculum subject:', error);
        return NextResponse.json(
            { error: 'Failed to update curriculum subject' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string; subjectId: string } }
) {
    try {
        // Check if curriculum subject exists
        const existingCurriculumSubject = await prisma.curriculumSubject.findUnique({
            where: {
                curriculumId_subjectId: {
                    curriculumId: params.id,
                    subjectId: params.subjectId
                }
            }
        });

        if (!existingCurriculumSubject) {
            return NextResponse.json(
                { error: 'Subject not found in this curriculum' },
                { status: 404 }
            );
        }

        await prisma.curriculumSubject.delete({
            where: {
                curriculumId_subjectId: {
                    curriculumId: params.id,
                    subjectId: params.subjectId
                }
            }
        });

        return NextResponse.json({ message: 'Subject removed from curriculum successfully' });
    } catch (error) {
        console.error('Error removing subject from curriculum:', error);
        return NextResponse.json(
            { error: 'Failed to remove subject from curriculum' },
            { status: 500 }
        );
    }
}

