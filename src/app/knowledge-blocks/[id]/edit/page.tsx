'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, X } from 'lucide-react'
import Link from 'next/link'


interface KnowledgeBlock {
    id: string
    name: string
    code: string
    minCredits: number
    maxCredits: number
    order: number
}

export default function EditKnowledgeBlockPage() {
    const router = useRouter()
    const params = useParams()
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [knowledgeBlock, setKnowledgeBlock] = useState<KnowledgeBlock | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        minCredits: '',
        maxCredits: '',
        order: ''
    })

    useEffect(() => {
        if (params.id) {
            fetchData()
        }
    }, [params.id])

    const fetchData = async () => {
        try {
            const knowledgeBlockResponse = await fetch(`/api/knowledge-blocks/${params.id}`)

            if (knowledgeBlockResponse.ok) {
                const knowledgeBlockData = await knowledgeBlockResponse.json()
                setKnowledgeBlock(knowledgeBlockData)
                setFormData({
                    name: knowledgeBlockData.name,
                    code: knowledgeBlockData.code,
                    minCredits: knowledgeBlockData.minCredits.toString(),
                    maxCredits: knowledgeBlockData.maxCredits.toString(),
                    order: knowledgeBlockData.order.toString()
                })
            }

        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoadingData(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch(`/api/knowledge-blocks/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                router.push('/knowledge-blocks')
                router.refresh()
            } else {
                const error = await response.json()
                alert(error.error || 'Failed to update knowledge block')
            }
        } catch (error) {
            console.error('Error updating knowledge block:', error)
            alert('Failed to update knowledge block')
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    if (loadingData) {
        return (
            <div className="flex h-screen bg-gray-50 items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
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
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Knowledge Block</h1>
                            <p className="text-lg text-gray-600">
                                Update information for {knowledgeBlock.name}
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="max-w-2xl">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Knowledge Block Information</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Knowledge Block Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Kiến thức đại cương, Cơ sở ngành, Chuyên ngành"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Code */}
                                    <div>
                                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                                            Code *
                                        </label>
                                        <input
                                            type="text"
                                            id="code"
                                            name="code"
                                            required
                                            value={formData.code}
                                            onChange={handleInputChange}
                                            placeholder="e.g., GD, CS, CN"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Min Credits */}
                                    <div>
                                        <label htmlFor="minCredits" className="block text-sm font-medium text-gray-700 mb-2">
                                            Minimum Credits *
                                        </label>
                                        <input
                                            type="number"
                                            id="minCredits"
                                            name="minCredits"
                                            required
                                            min="0"
                                            value={formData.minCredits}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 30"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Max Credits */}
                                    <div>
                                        <label htmlFor="maxCredits" className="block text-sm font-medium text-gray-700 mb-2">
                                            Maximum Credits *
                                        </label>
                                        <input
                                            type="number"
                                            id="maxCredits"
                                            name="maxCredits"
                                            required
                                            min="0"
                                            value={formData.maxCredits}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 60"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>


                                    {/* Order */}
                                    <div>
                                        <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
                                            Display Order
                                        </label>
                                        <input
                                            type="number"
                                            id="order"
                                            name="order"
                                            min="0"
                                            value={formData.order}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 1"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>


                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end space-x-4">
                                <Link
                                    href="/knowledge-blocks"
                                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {loading ? 'Updating...' : 'Update Knowledge Block'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}

