import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const majors = await prisma.major.findMany({
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
            }
        })

        return NextResponse.json(majors)
    } catch (error) {
        console.error('Error fetching majors:', error)
        return NextResponse.json(
            { error: 'Failed to fetch majors' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const major = await prisma.major.create({
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

        return NextResponse.json(major, { status: 201 })
    } catch (error) {
        console.error('Error creating major:', error)
        return NextResponse.json(
            { error: 'Failed to create major' },
            { status: 500 }
        )
    }
}









