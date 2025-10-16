import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const school = await prisma.school.findUnique({
            where: { id: params.id },
            include: {
                university: true,
                faculties: {
                    include: {
                        majors: true
                    }
                }
            }
        })

        if (!school) {
            return NextResponse.json(
                { error: 'School not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(school)
    } catch (error) {
        console.error('Error fetching school:', error)
        return NextResponse.json(
            { error: 'Failed to fetch school' },
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

        const school = await prisma.school.update({
            where: { id: params.id },
            data: {
                name: body.name,
                description: body.description,
                dean: body.dean,
                phone: body.phone,
                email: body.email,
                address: body.address,
                universityId: body.universityId
            },
            include: {
                university: true
            }
        })

        return NextResponse.json(school)
    } catch (error) {
        console.error('Error updating school:', error)
        return NextResponse.json(
            { error: 'Failed to update school' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.school.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ message: 'School deleted successfully' })
    } catch (error) {
        console.error('Error deleting school:', error)
        return NextResponse.json(
            { error: 'Failed to delete school' },
            { status: 500 }
        )
    }
}

