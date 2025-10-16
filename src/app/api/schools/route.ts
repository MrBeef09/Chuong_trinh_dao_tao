import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const schools = await prisma.school.findMany({
            include: {
                university: true,
                faculties: {
                    include: {
                        majors: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(schools)
    } catch (error) {
        console.error('Error fetching schools:', error)
        return NextResponse.json(
            { error: 'Failed to fetch schools' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const school = await prisma.school.create({
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

        return NextResponse.json(school, { status: 201 })
    } catch (error) {
        console.error('Error creating school:', error)
        return NextResponse.json(
            { error: 'Failed to create school' },
            { status: 500 }
        )
    }
}

