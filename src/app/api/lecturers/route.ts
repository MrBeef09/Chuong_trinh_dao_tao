import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/lecturers
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const pageSize = parseInt(searchParams.get('pageSize') || '5')

        // Calculate skip value for pagination
        const skip = (page - 1) * pageSize

        // Get total count for pagination
        const total = await prisma.lecturer.count()

        // Get paginated lecturers
        const lecturers = await prisma.lecturer.findMany({
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
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip,
            take: pageSize
        })

        return NextResponse.json({
            lecturers,
            pagination: {
                total,
                pageSize,
                currentPage: page,
                totalPages: Math.ceil(total / pageSize)
            }
        })
    } catch (error) {
        console.error('Error fetching lecturers:', error)
        return NextResponse.json(
            { error: 'Failed to fetch lecturers' },
            { status: 500 }
        )
    }
}

// POST /api/lecturers
export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Create the lecturer
        const lecturer = await prisma.lecturer.create({
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
                status: body.status || 'Active',
                imageUrl: body.imageUrl,
                faculty: {
                    connect: {
                        id: body.facultyId
                    }
                }
            }
        })

        return NextResponse.json(lecturer, { status: 201 })
    } catch (error) {
        console.error('Error creating lecturer:', error)
        return NextResponse.json(
            { error: 'Failed to create lecturer' },
            { status: 500 }
        )
    }
}
