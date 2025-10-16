import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/courses/[id] - Lấy thông tin khóa học theo ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const course = await prisma.course.findUnique({
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
                }
            }
        })

        if (!course) {
            return NextResponse.json(
                { error: 'Course not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(course)
    } catch (error) {
        console.error('Error fetching course:', error)
        return NextResponse.json(
            { error: 'Failed to fetch course' },
            { status: 500 }
        )
    }
}

// PUT /api/courses/[id] - Cập nhật khóa học
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        // Kiểm tra khóa học tồn tại
        const existingCourse = await prisma.course.findUnique({
            where: { id: params.id }
        })

        if (!existingCourse) {
            return NextResponse.json(
                { error: 'Course not found' },
                { status: 404 }
            )
        }

        // Kiểm tra mã khóa học đã tồn tại chưa (nếu thay đổi)
        if (code && code !== existingCourse.code) {
            const duplicateCourse = await prisma.course.findUnique({
                where: { code }
            })

            if (duplicateCourse) {
                return NextResponse.json(
                    { error: 'Course code already exists' },
                    { status: 400 }
                )
            }
        }

        // Kiểm tra major tồn tại (nếu thay đổi)
        if (majorId && majorId !== existingCourse.majorId) {
            const major = await prisma.major.findUnique({
                where: { id: majorId }
            })

            if (!major) {
                return NextResponse.json(
                    { error: 'Major not found' },
                    { status: 404 }
                )
            }
        }

        const updatedCourse = await prisma.course.update({
            where: { id: params.id },
            data: {
                ...(code && { code }),
                ...(name && { name }),
                ...(academicYear && { academicYear }),
                ...(educationLevel && { educationLevel }),
                ...(program && { program }),
                ...(status && { status }),
                ...(description !== undefined && { description }),
                ...(startDate && { startDate: new Date(startDate) }),
                ...(endDate && { endDate: new Date(endDate) }),
                ...(studentCount !== undefined && { studentCount }),
                ...(majorId && { majorId })
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

        return NextResponse.json(updatedCourse)
    } catch (error) {
        console.error('Error updating course:', error)
        return NextResponse.json(
            { error: 'Failed to update course' },
            { status: 500 }
        )
    }
}

// DELETE /api/courses/[id] - Xóa khóa học
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const course = await prisma.course.findUnique({
            where: { id: params.id }
        })

        if (!course) {
            return NextResponse.json(
                { error: 'Course not found' },
                { status: 404 }
            )
        }

        await prisma.course.delete({
            where: { id: params.id }
        })

        return NextResponse.json(
            { message: 'Course deleted successfully' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error deleting course:', error)
        return NextResponse.json(
            { error: 'Failed to delete course' },
            { status: 500 }
        )
    }
}