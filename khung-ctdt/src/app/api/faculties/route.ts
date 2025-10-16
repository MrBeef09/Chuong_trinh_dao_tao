import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const faculties = await prisma.faculty.findMany({
            include: {
                school: {
                    include: {
                        university: true
                    }
                },
                majors: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(faculties)
    } catch (error) {
        console.error('Error fetching faculties:', error)
        return NextResponse.json(
            { error: 'Failed to fetch faculties' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const faculty = await prisma.faculty.create({
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

        return NextResponse.json(faculty, { status: 201 })
    } catch (error) {
        console.error('Error creating faculty:', error)
        return NextResponse.json(
            { error: 'Failed to create faculty' },
            { status: 500 }
        )
    }
}









