import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { searchParams } = new URL(request.url);
        const knowledgeBlockId = searchParams.get('knowledgeBlockId');
        const search = searchParams.get('search');

        // Get curriculum details
        const curriculum = await prisma.curriculum.findUnique({
            where: { id: params.id },
            include: {
                major: true
            }
        });

        if (!curriculum) {
            return NextResponse.json(
                { error: 'Curriculum not found' },
                { status: 404 }
            );
        }

        // Get subjects that are not already in this curriculum
        const curriculumSubjects = await prisma.curriculumSubject.findMany({
            where: {
                curriculumId: params.id
            },
            select: {
                subjectId: true
            }
        });

        const excludedSubjectIds = curriculumSubjects.map(cs => cs.subjectId);

        // Build where clause for subjects
        const where: any = {
            majorId: curriculum.majorId,
            status: 'Active',
            NOT: {
                id: {
                    in: excludedSubjectIds
                }
            }
        };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { code: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        const subjects = await prisma.subject.findMany({
            where,
            include: {
                lecturers: {
                    include: {
                        lecturer: true
                    }
                }
            },
            orderBy: [
                { code: 'asc' },
                { name: 'asc' }
            ]
        });

        // If knowledgeBlockId is specified, filter subjects that match the knowledge block requirements
        let filteredSubjects = subjects;

        if (knowledgeBlockId) {
            const knowledgeBlock = await prisma.knowledgeBlock.findUnique({
                where: { id: knowledgeBlockId }
            });

            if (knowledgeBlock) {
                // You can add specific filtering logic here based on knowledge block requirements
                // For example, filter by subject categories, types, etc.
                filteredSubjects = subjects;
            }
        }

        return NextResponse.json({
            subjects: filteredSubjects,
            total: filteredSubjects.length,
            curriculum: {
                id: curriculum.id,
                name: curriculum.name,
                code: curriculum.code,
                major: curriculum.major
            }
        });
    } catch (error) {
        console.error('Error fetching available subjects:', error);
        return NextResponse.json(
            { error: 'Failed to fetch available subjects' },
            { status: 500 }
        );
    }
}

