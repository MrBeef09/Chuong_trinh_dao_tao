import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const knowledgeBlocks = await prisma.knowledgeBlock.findMany({
            orderBy: [
                { order: 'asc' },
                { name: 'asc' }
            ]
        })

        return NextResponse.json(knowledgeBlocks)
    } catch (error) {
        console.error('Error fetching knowledge blocks:', error)
        return NextResponse.json(
            { error: 'Failed to fetch knowledge blocks' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, code, minCredits, maxCredits, order } = body

        // Validate required fields
        if (!name || !code || !minCredits || !maxCredits) {
            return NextResponse.json(
                { error: 'Missing required fields: name, code, minCredits, and maxCredits are required' },
                { status: 400 }
            )
        }

        // Validate credits range
        if (parseInt(minCredits) > parseInt(maxCredits)) {
            return NextResponse.json(
                { error: 'Minimum credits cannot be greater than maximum credits' },
                { status: 400 }
            )
        }

        // Check if code already exists
        const existingBlock = await prisma.knowledgeBlock.findUnique({
            where: { code }
        })

        if (existingBlock) {
            return NextResponse.json(
                { error: 'Knowledge block code already exists' },
                { status: 400 }
            )
        }

        const knowledgeBlock = await prisma.knowledgeBlock.create({
            data: {
                name,
                code,
                minCredits: parseInt(minCredits),
                maxCredits: parseInt(maxCredits),
                order: parseInt(order) || 0
            },
        })

        return NextResponse.json(knowledgeBlock, { status: 201 })
    } catch (error) {
        console.error('Error creating knowledge block:', error)
        return NextResponse.json(
            { error: 'Failed to create knowledge block' },
            { status: 500 }
        )
    }
}

