import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/courses - Lấy danh sách tất cả khóa học
export async function GET() {
    try {
        const courses = await prisma.course.findMany({
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
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(courses)
    } catch (error) {
        console.error('Error fetching courses:', error)
        return NextResponse.json(
            { error: 'Failed to fetch courses' },
            { status: 500 }
        )
    }
}

// POST /api/courses - Tạo khóa học mới
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            code,
            name,
            academicYear,
            educationLevel,
            program,
            status,
            description,
            startDate,
            endDate,
            studentCount,
            majorId
        } = body

        // Kiểm tra mã khóa học đã tồn tại chưa
        const existingCourse = await prisma.course.findUnique({
            where: { code }
        })

        if (existingCourse) {
            return NextResponse.json(
                { error: 'Course code already exists' },
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

        const course = await prisma.course.create({
            data: {
                code,
                name,
                academicYear,
                educationLevel,
                program,
                status: status || 'Đang đào tạo',
                description,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                studentCount: studentCount || 0,
                majorId
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
                }
            }
        })

        return NextResponse.json(course, { status: 201 })
    } catch (error) {
        console.error('Error creating course:', error)
        return NextResponse.json(
            { error: 'Failed to create course' },
            { status: 500 }
        )
    }
}