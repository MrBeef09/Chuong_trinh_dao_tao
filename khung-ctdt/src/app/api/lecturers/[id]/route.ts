import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/lecturers/[id]
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const lecturer = await prisma.lecturer.findUnique({
            where: {
                id: params.id
            },
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
        })

        if (!lecturer) {
            return NextResponse.json(
                { error: 'Lecturer not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(lecturer)
    } catch (error) {
        console.error('Error fetching lecturer:', error)
        return NextResponse.json(
            { error: 'Failed to fetch lecturer' },
            { status: 500 }
        )
    }
}

// PUT /api/lecturers/[id]
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json()

        // Check if lecturer exists
        const existingLecturer = await prisma.lecturer.findUnique({
            where: {
                id: params.id
            }
        })

        if (!existingLecturer) {
            return NextResponse.json(
                { error: 'Lecturer not found' },
                { status: 404 }
            )
        }

        // Update the lecturer
        const updatedLecturer = await prisma.lecturer.update({
            where: {
                id: params.id
            },
            data: {
                title: body.title,
                firstName: body.firstName,
                lastName: body.lastName,
                fullName: `${body.title ? body.title + ' ' : ''}${body.firstName} ${body.lastName}`,
                email: body.email,
                phone: body.phone,
                office: body.office,
                biography: body.biography,
                specialization: body.specialization,
                joinDate: body.joinDate ? new Date(body.joinDate) : null,
                status: body.status,
                imageUrl: body.imageUrl,
                facultyId: body.facultyId
            }
        })

        return NextResponse.json(updatedLecturer)
    } catch (error) {
        console.error('Error updating lecturer:', error)
        return NextResponse.json(
            { error: 'Failed to update lecturer' },
            { status: 500 }
        )
    }
}

// DELETE /api/lecturers/[id]
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Check if lecturer exists
        const existingLecturer = await prisma.lecturer.findUnique({
            where: {
                id: params.id
            }
        })

        if (!existingLecturer) {
            return NextResponse.json(
                { error: 'Lecturer not found' },
                { status: 404 }
            )
        }

        // Delete the lecturer
        await prisma.lecturer.delete({
            where: {
                id: params.id
            }
        })

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error('Error deleting lecturer:', error)
        return NextResponse.json(
            { error: 'Failed to delete lecturer' },
            { status: 500 }
        )
    }
}








