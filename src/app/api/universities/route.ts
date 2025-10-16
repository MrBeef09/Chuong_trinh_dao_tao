import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const universities = await prisma.university.findMany({
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
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(universities)
    } catch (error) {
        console.error('Error fetching universities:', error)
        return NextResponse.json(
            { error: 'Failed to fetch universities' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const university = await prisma.university.create({
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

        return NextResponse.json(university, { status: 201 })
    } catch (error) {
        console.error('Error creating university:', error)
        return NextResponse.json(
            { error: 'Failed to create university' },
            { status: 500 }
        )
    }
}

