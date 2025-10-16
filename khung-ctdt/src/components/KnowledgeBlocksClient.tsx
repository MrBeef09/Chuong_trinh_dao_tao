'use client'

import React, { useState, useMemo } from 'react'
import { BookOpen, Plus, Edit, Trash2, Eye, Search, Filter, ChevronDown } from 'lucide-react'
import Link from 'next/link'

interface KnowledgeBlock {
    id: string
    name: string
    code: string
    minCredits: number
    maxCredits: number
    order: number
    createdAt: string
    updatedAt: string
}

interface KnowledgeBlocksClientProps {
    knowledgeBlocks: KnowledgeBlock[]
}

export default function KnowledgeBlocksClient({ knowledgeBlocks }: KnowledgeBlocksClientProps) {
    const [searchTerm, setSearchTerm] = useState('')

    // Filter knowledge blocks based on search
    const filteredKnowledgeBlocks = useMemo(() => {
        return knowledgeBlocks.filter(block => {
            const matchesSearch =
                block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                block.code.toLowerCase().includes(searchTerm.toLowerCase())

            return matchesSearch
        })
    }, [knowledgeBlocks, searchTerm])


    // Calculate stats for filtered results
    const stats = useMemo(() => {
        const total = filteredKnowledgeBlocks.length
        const totalCredits = filteredKnowledgeBlocks.reduce((sum, block) => sum + block.maxCredits, 0)

        return { total, totalCredits }
    }, [filteredKnowledgeBlocks])

    return (
        <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Blocks</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <BookOpen className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Credits</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalCredits}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Knowledge Blocks Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search knowledge blocks..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="text-sm text-gray-500">
                            {stats.total} knowledge blocks
                        </div>
                    </div>

                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Knowledge Block
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Credits Range
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredKnowledgeBlocks.map((block) => (
                                <tr key={block.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {block.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Code: {block.code}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {block.minCredits} - {block.maxCredits} credits
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Range
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            <Link
                                                href={`/knowledge-blocks/${block.id}`}
                                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                            <Link
                                                href={`/knowledge-blocks/${block.id}/edit`}
                                                className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                                                title="Edit"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            <Link
                                                href={`/knowledge-blocks/${block.id}/delete`}
                                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredKnowledgeBlocks.length === 0 && (
                    <div className="text-center py-12">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            {knowledgeBlocks.length === 0 ? 'No knowledge blocks' : 'No knowledge blocks match your filters'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {knowledgeBlocks.length === 0
                                ? 'Get started by creating a new knowledge block.'
                                : 'Try adjusting your search or filter criteria.'
                            }
                        </p>
                        {knowledgeBlocks.length === 0 && (
                            <div className="mt-6">
                                <Link
                                    href="/knowledge-blocks/new"
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Knowledge Block
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    )
}

