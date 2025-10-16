import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const faculty = await prisma.faculty.findUnique({
            where: { id: params.id },
            include: {
                school: {
                    include: {
                        university: true
                    }
                },
                majors: true
            }
        })

        if (!faculty) {
            return NextResponse.json(
                { error: 'Faculty not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(faculty)
    } catch (error) {
        console.error('Error fetching faculty:', error)
        return NextResponse.json(
            { error: 'Failed to fetch faculty' },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json()

        const faculty = await prisma.faculty.update({
            where: { id: params.id },
            data: {
                name: body.name,
                description: body.description,
                head: body.head,
                phone: body.phone,
                email: body.email,
                office: body.office,
                schoolId: body.schoolId
            },
            include: {
                school: {
                    include: {
                        university: true
                    }
                }
            }
        })

        return NextResponse.json(faculty)
    } catch (error) {
        console.error('Error updating faculty:', error)
        return NextResponse.json(
            { error: 'Failed to update faculty' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.faculty.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ message: 'Faculty deleted successfully' })
    } catch (error) {
        console.error('Error deleting faculty:', error)
        return NextResponse.json(
            { error: 'Failed to delete faculty' },
            { status: 500 }
        )
    }
}









