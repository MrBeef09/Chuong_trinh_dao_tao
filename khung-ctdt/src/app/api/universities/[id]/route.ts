import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const university = await prisma.university.findUnique({
            where: { id: params.id },
            include: {
                schools: {
                    include: {
                        faculties: {
                            include: {
                                majors: true
                            }
                        }
                    }
                }
            }
        })

        if (!university) {
            return NextResponse.json(
                { error: 'University not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(university)
    } catch (error) {
        console.error('Error fetching university:', error)
        return NextResponse.json(
            { error: 'Failed to fetch university' },
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

        const university = await prisma.university.update({
            where: { id: params.id },
            data: {
                name: body.name,
                description: body.description,
                address: body.address,
                phone: body.phone,
                email: body.email,
                website: body.website,
                established: body.established
            }
        })

        return NextResponse.json(university)
    } catch (error) {
        console.error('Error updating university:', error)
        return NextResponse.json(
            { error: 'Failed to update university' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.university.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ message: 'University deleted successfully' })
    } catch (error) {
        console.error('Error deleting university:', error)
        return NextResponse.json(
            { error: 'Failed to delete university' },
            { status: 500 }
        )
    }
}

