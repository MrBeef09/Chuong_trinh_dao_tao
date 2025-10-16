import Navigation from '@/components/Navigation'
import KnowledgeBlocksClient from '@/components/KnowledgeBlocksClient'
import { prisma } from '@/lib/prisma'
import { Plus } from 'lucide-react'
import Link from 'next/link'

async function getKnowledgeBlocks() {
    try {
        const knowledgeBlocks = await prisma.knowledgeBlock.findMany({
            orderBy: [
                { order: 'asc' },
                { name: 'asc' }
            ]
        })

        return knowledgeBlocks
    } catch (error) {
        console.error('Error fetching knowledge blocks:', error)
        return []
    }
}

export default async function KnowledgeBlocksPage() {
    const knowledgeBlocks = await getKnowledgeBlocks()

    return (
        <div className="flex h-screen bg-gray-50">
            <Navigation />

            <main className="flex-1 lg:ml-0 overflow-y-auto">
                <div className="p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">Knowledge Blocks</h1>
                                <p className="text-lg text-gray-600">
                                    Quản lý danh mục các khối kiến thức trong chương trình đào tạo
                                </p>
                            </div>
                            <Link
                                href="/knowledge-blocks/new"
                                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Add Knowledge Block
                            </Link>
                        </div>
                    </div>

                    {/* Knowledge Blocks Client Component */}
                    <KnowledgeBlocksClient
                        knowledgeBlocks={knowledgeBlocks}
                    />
                </div>
            </main>
        </div>
    )
}