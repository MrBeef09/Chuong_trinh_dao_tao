import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const major = await prisma.major.findUnique({
            where: { id: params.id },
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

        if (!major) {
            return NextResponse.json(
                { error: 'Major not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(major)
    } catch (error) {
        console.error('Error fetching major:', error)
        return NextResponse.json(
            { error: 'Failed to fetch major' },
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

        const major = await prisma.major.update({
            where: { id: params.id },
            data: {
                name: body.name,
                code: body.code,
                description: body.description,
                duration: body.duration,
                credits: body.credits,
                level: body.level,
                facultyId: body.facultyId
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

        return NextResponse.json(major)
    } catch (error) {
        console.error('Error updating major:', error)
        return NextResponse.json(
            { error: 'Failed to update major' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.major.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ message: 'Major deleted successfully' })
    } catch (error) {
        console.error('Error deleting major:', error)
        return NextResponse.json(
            { error: 'Failed to delete major' },
            { status: 500 }
        )
    }
}









