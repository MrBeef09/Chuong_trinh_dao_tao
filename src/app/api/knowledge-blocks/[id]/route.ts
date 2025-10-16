import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const knowledgeBlock = await prisma.knowledgeBlock.findUnique({
            where: { id: params.id }
        })

        if (!knowledgeBlock) {
            return NextResponse.json(
                { error: 'Knowledge block not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(knowledgeBlock)
    } catch (error) {
        console.error('Error fetching knowledge block:', error)
        return NextResponse.json(
            { error: 'Failed to fetch knowledge block' },
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

        // Check if code already exists for different knowledge block
        const existingBlock = await prisma.knowledgeBlock.findUnique({
            where: { code }
        })

        if (existingBlock && existingBlock.id !== params.id) {
            return NextResponse.json(
                { error: 'Knowledge block code already exists' },
                { status: 400 }
            )
        }

        const knowledgeBlock = await prisma.knowledgeBlock.update({
            where: { id: params.id },
            data: {
                name,
                code,
                minCredits: parseInt(minCredits),
                maxCredits: parseInt(maxCredits),
                order: parseInt(order) || 0
            }
        })

        return NextResponse.json(knowledgeBlock)
    } catch (error) {
        console.error('Error updating knowledge block:', error)
        return NextResponse.json(
            { error: 'Failed to update knowledge block' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Check if knowledge block has subjects
        const knowledgeBlock = await prisma.knowledgeBlock.findUnique({
            where: { id: params.id },
            include: {
                subjects: true
            }
        })

        if (!knowledgeBlock) {
            return NextResponse.json(
                { error: 'Knowledge block not found' },
                { status: 404 }
            )
        }

        if (knowledgeBlock.subjects.length > 0) {
            return NextResponse.json(
                { error: 'Cannot delete knowledge block with existing subjects. Please remove all subjects first.' },
                { status: 400 }
            )
        }

        await prisma.knowledgeBlock.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ message: 'Knowledge block deleted successfully' })
    } catch (error) {
        console.error('Error deleting knowledge block:', error)
        return NextResponse.json(
            { error: 'Failed to delete knowledge block' },
            { status: 500 }
        )
    }
}

