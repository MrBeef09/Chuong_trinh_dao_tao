'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, X } from 'lucide-react'
import Link from 'next/link'


export default function NewKnowledgeBlockPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        minCredits: '',
        maxCredits: '',
        order: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch('/api/knowledge-blocks', {
                method: 'POST',
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
                alert(error.error || 'Failed to create knowledge block')
            }
        } catch (error) {
            console.error('Error creating knowledge block:', error)
            alert('Failed to create knowledge block')
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center space-x-4 mb-6">
                            <Link
                                href="/knowledge-blocks"
                                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
                            >
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                Back to Knowledge Blocks
                            </Link>
                        </div>
                        <div>
                            <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Add New Knowledge Block
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Create a new knowledge block for the curriculum structure
                            </p>
                        </div>
                    </div>

                    {/* Form Container */}
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                                <h2 className="text-2xl font-semibold text-white flex items-center">
                                    <div className="w-2 h-8 bg-white rounded-full mr-4"></div>
                                    Knowledge Block Information
                                </h2>
                                <p className="text-blue-100 mt-2">Fill in the details below to create a new knowledge block</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Name */}
                                    <div className="lg:col-span-2">
                                        <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-3">
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
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                                        />
                                    </div>

                                    {/* Code */}
                                    <div>
                                        <label htmlFor="code" className="block text-sm font-semibold text-gray-800 mb-3">
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
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                                        />
                                    </div>

                                    {/* Min Credits */}
                                    <div>
                                        <label htmlFor="minCredits" className="block text-sm font-semibold text-gray-800 mb-3">
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
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                                        />
                                    </div>

                                    {/* Max Credits */}
                                    <div>
                                        <label htmlFor="maxCredits" className="block text-sm font-semibold text-gray-800 mb-3">
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
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                                        />
                                    </div>


                                    {/* Order */}
                                    <div>
                                        <label htmlFor="order" className="block text-sm font-semibold text-gray-800 mb-3">
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
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                                        />
                                    </div>


                                </div>

                                {/* Form Actions */}
                                <div className="flex items-center justify-center space-x-6 pt-8 border-t border-gray-200">
                                    <Link
                                        href="/knowledge-blocks"
                                        className="flex items-center px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                                    >
                                        <X className="h-5 w-5 mr-2" />
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        <Save className="h-5 w-5 mr-2" />
                                        {loading ? 'Creating...' : 'Create Knowledge Block'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
