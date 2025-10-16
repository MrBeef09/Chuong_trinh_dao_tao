'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Trash2, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

interface KnowledgeBlock {
    id: string
    name: string
    code: string
    credits: number
    order: number
    status: string
    major: {
        name: string
        code: string
        faculty: {
            name: string
            school: {
                name: string
                university: {
                    name: string
                }
            }
        }
    }
    subjects: Array<{
        id: string
        name: string
        code: string
    }>
}

export default function DeleteKnowledgeBlockPage() {
    const router = useRouter()
    const params = useParams()
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [knowledgeBlock, setKnowledgeBlock] = useState<KnowledgeBlock | null>(null)

    useEffect(() => {
        if (params.id) {
            fetchKnowledgeBlock()
        }
    }, [params.id])

    const fetchKnowledgeBlock = async () => {
        try {
            const response = await fetch(`/api/knowledge-blocks/${params.id}`)
            if (response.ok) {
                const data = await response.json()
                setKnowledgeBlock(data)
            } else {
                console.error('Failed to fetch knowledge block')
            }
        } catch (error) {
            console.error('Error fetching knowledge block:', error)
        } finally {
            setLoadingData(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this knowledge block? This action cannot be undone.')) {
            return
        }

        setLoading(true)

        try {
            const response = await fetch(`/api/knowledge-blocks/${params.id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                router.push('/knowledge-blocks')
                router.refresh()
            } else {
                const error = await response.json()
                alert(error.error || 'Failed to delete knowledge block')
            }
        } catch (error) {
            console.error('Error deleting knowledge block:', error)
            alert('Failed to delete knowledge block')
        } finally {
            setLoading(false)
        }
    }

    if (loadingData) {
        return (
            <div className="flex h-screen bg-gray-50 items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    if (!knowledgeBlock) {
        return (
            <div className="flex h-screen bg-gray-50 items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Knowledge Block Not Found</h1>
                    <p className="text-gray-600 mb-4">The knowledge block you're looking for doesn't exist.</p>
                    <Link
                        href="/knowledge-blocks"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Knowledge Blocks
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-4 mb-4">
                            <Link
                                href="/knowledge-blocks"
                                className="flex items-center text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                Back to Knowledge Blocks
                            </Link>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">Delete Knowledge Block</h1>
                            <p className="text-lg text-gray-600">
                                Confirm deletion of knowledge block
                            </p>
                        </div>
                    </div>

                    {/* Warning Card */}
                    <div className="max-w-2xl">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                            <div className="flex items-center mb-4">
                                <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                                <h2 className="text-lg font-semibold text-red-900">Warning</h2>
                            </div>
                            <p className="text-red-700">
                                You are about to permanently delete this knowledge block. This action cannot be undone.
                            </p>
                        </div>

                        {/* Knowledge Block Details */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Knowledge Block Details</h2>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                                        <p className="text-sm text-gray-900">{knowledgeBlock.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Code</label>
                                        <p className="text-sm text-gray-900">{knowledgeBlock.code}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Credits</label>
                                        <p className="text-sm text-gray-900">{knowledgeBlock.credits}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                                        <p className="text-sm text-gray-900">{knowledgeBlock.status}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Major</label>
                                    <p className="text-sm text-gray-900">
                                        {knowledgeBlock.major.name} ({knowledgeBlock.major.code}) - {knowledgeBlock.major.faculty.school.university.name}
                                    </p>
                                </div>


                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Associated Subjects</label>
                                    <p className="text-sm text-gray-900">
                                        {knowledgeBlock.subjects.length} subjects
                                    </p>
                                    {knowledgeBlock.subjects.length > 0 && (
                                        <div className="mt-2">
                                            <p className="text-xs text-red-600 font-medium mb-2">
                                                ⚠️ Cannot delete knowledge block with existing subjects
                                            </p>
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <p className="text-xs text-gray-600 mb-2">Subjects in this knowledge block:</p>
                                                <ul className="text-xs text-gray-700 space-y-1">
                                                    {knowledgeBlock.subjects.map((subject) => (
                                                        <li key={subject.id}>• {subject.name} ({subject.code})</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end space-x-4">
                            <Link
                                href="/knowledge-blocks"
                                className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Cancel
                            </Link>
                            <button
                                onClick={handleDelete}
                                disabled={loading || knowledgeBlock.subjects.length > 0}
                                className="flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {loading ? 'Deleting...' : 'Delete Knowledge Block'}
                            </button>
                        </div>

                        {knowledgeBlock.subjects.length > 0 && (
                            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-800">
                                    <strong>Note:</strong> To delete this knowledge block, you must first remove all associated subjects or reassign them to other knowledge blocks.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

