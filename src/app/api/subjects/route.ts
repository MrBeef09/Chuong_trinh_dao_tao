import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/subjects - Lấy danh sách tất cả học phần
export async function GET() {
    try {
        const subjects = await prisma.subject.findMany({
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
                lecturers: {
                    include: {
                        lecturer: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(subjects)
    } catch (error) {
        console.error('Error fetching subjects:', error)
        return NextResponse.json(
            { error: 'Failed to fetch subjects' },
            { status: 500 }
        )
    }
}

// POST /api/subjects - Tạo học phần mới
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            code,
            name,
            description,
            credits,
            hours,
            semester,
            imageUrl,
            syllabus,
            prerequisites,
            objectives,
            status,
            majorId,
            lecturerIds
        } = body

        // Kiểm tra mã học phần đã tồn tại chưa
        const existingSubject = await prisma.subject.findUnique({
            where: { code }
        })

        if (existingSubject) {
            return NextResponse.json(
                { error: 'Subject code already exists' },
                { status: 400 }
            )
        }

        // Kiểm tra major tồn tại
        const major = await prisma.major.findUnique({
            where: { id: majorId }
        })

        if (!major) {
            return NextResponse.json(
                { error: 'Major not found' },
                { status: 404 }
            )
        }

        // Tạo học phần mới
        const subject = await prisma.subject.create({
            data: {
                code,
                name,
                description,
                credits,
                hours,
                semester,
                imageUrl,
                syllabus,
                prerequisites,
                objectives,
                status: status || 'Active',
                majorId
            }
        })

        // Thêm giảng viên cho học phần (nếu có)
        if (lecturerIds && lecturerIds.length > 0) {
            const lecturerConnections = lecturerIds.map((lecturerId: string) => ({
                lecturerId,
                subjectId: subject.id
            }))

            await prisma.lecturerSubject.createMany({
                data: lecturerConnections
            })
        }

        // Fetch lại học phần với đầy đủ thông tin
        const createdSubject = await prisma.subject.findUnique({
            where: { id: subject.id },
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
                lecturers: {
                    include: {
                        lecturer: true
                    }
                }
            }
        })

        return NextResponse.json(createdSubject, { status: 201 })
    } catch (error) {
        console.error('Error creating subject:', error)
        // Add more detailed error information
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        const errorStack = error instanceof Error ? error.stack : ''

        console.error('Error details:', {
            message: errorMessage,
            stack: errorStack
        })

        return NextResponse.json(
            { error: `Failed to create subject: ${errorMessage}` },
            { status: 500 }
        )
    }
}
