import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/subjects/[id] - Lấy thông tin chi tiết của một học phần
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id
        const subject = await prisma.subject.findUnique({
            where: { id },
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

        if (!subject) {
            return NextResponse.json(
                { error: 'Subject not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(subject)
    } catch (error) {
        console.error('Error fetching subject:', error)
        return NextResponse.json(
            { error: 'Failed to fetch subject' },
            { status: 500 }
        )
    }
}

// PUT /api/subjects/[id] - Cập nhật thông tin học phần
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id
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

        // Kiểm tra học phần tồn tại không
        const existingSubject = await prisma.subject.findUnique({
            where: { id },
            include: {
                lecturers: true
            }
        })

        if (!existingSubject) {
            return NextResponse.json(
                { error: 'Subject not found' },
                { status: 404 }
            )
        }

        // Kiểm tra mã học phần có bị trùng không (nếu thay đổi mã)
        if (code !== existingSubject.code) {
            const codeExists = await prisma.subject.findUnique({
                where: { code }
            })

            if (codeExists) {
                return NextResponse.json(
                    { error: 'Subject code already exists' },
                    { status: 400 }
                )
            }
        }

        // Cập nhật thông tin học phần
        const updatedSubject = await prisma.subject.update({
            where: { id },
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
                status,
                majorId
            }
        })

        // Cập nhật giảng viên giảng dạy học phần
        if (lecturerIds) {
            // Xóa tất cả giảng viên hiện tại của học phần
            await prisma.lecturerSubject.deleteMany({
                where: { subjectId: id }
            })

            // Thêm mới giảng viên từ danh sách được cung cấp
            if (lecturerIds.length > 0) {
                const lecturerConnections = lecturerIds.map((lecturerId: string) => ({
                    lecturerId,
                    subjectId: id
                }))

                await prisma.lecturerSubject.createMany({
                    data: lecturerConnections
                })
            }
        }

        // Fetch lại học phần với đầy đủ thông tin
        const result = await prisma.subject.findUnique({
            where: { id },
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

        return NextResponse.json(result)
    } catch (error) {
        console.error('Error updating subject:', error)
        return NextResponse.json(
            { error: 'Failed to update subject' },
            { status: 500 }
        )
    }
}

// DELETE /api/subjects/[id] - Xóa học phần
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id

        // Kiểm tra học phần tồn tại không
        const subject = await prisma.subject.findUnique({
            where: { id }
        })

        if (!subject) {
            return NextResponse.json(
                { error: 'Subject not found' },
                { status: 404 }
            )
        }

        // Xóa tất cả mối quan hệ với giảng viên
        await prisma.lecturerSubject.deleteMany({
            where: { subjectId: id }
        })

        // Xóa học phần
        await prisma.subject.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Subject deleted successfully' })
    } catch (error) {
        console.error('Error deleting subject:', error)
        return NextResponse.json(
            { error: 'Failed to delete subject' },
            { status: 500 }
        )
    }
}




