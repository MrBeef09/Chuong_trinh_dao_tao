'use client'

import Navigation from '@/components/Navigation'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, ArrowLeft, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

interface University {
    id: string
    name: string
    description: string | null
}

interface DeleteUniversityPageProps {
    params: { id: string }
}

export default function DeleteUniversityPage({ params }: DeleteUniversityPageProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const [university, setUniversity] = useState<University | null>(null)

    useEffect(() => {
        const fetchUniversity = async () => {
            try {
                const response = await fetch(`/api/universities/${params.id}`)
                if (response.ok) {
                    const data = await response.json()
                    setUniversity(data)
                }
            } catch (error) {
                console.error('Error fetching university:', error)
            } finally {
                setInitialLoading(false)
            }
        }

        fetchUniversity()
    }, [params.id])

    const handleDelete = async () => {
        setLoading(true)

        try {
            const response = await fetch(`/api/universities/${params.id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                router.push('/universities')
                router.refresh()
            } else {
                console.error('Failed to delete university')
            }
        } catch (error) {
            console.error('Error deleting university:', error)
        } finally {
            setLoading(false)
        }
    }

    if (initialLoading) {
        return (
            <div className="flex h-screen">
                <Navigation />
                <main className="flex-1 lg:ml-0 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                </main>
            </div>
        )
    }

    if (!university) {
        return (
            <div className="flex h-screen">
                <Navigation />
                <main className="flex-1 lg:ml-0 flex items-center justify-center">
                    <div className="text-center">
                        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">University not found</h3>
                        <p className="text-gray-500 mb-6">The university you're looking for doesn't exist.</p>
                        <Link
                            href="/universities"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Back to Universities
                        </Link>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="flex h-screen">
            <Navigation />

            <main className="flex-1 lg:ml-0">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center mb-8">
                        <Link
                            href="/universities"
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors mr-4"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Delete University</h1>
                            <p className="mt-2 text-gray-600">
                                Permanently remove this university from the system
                            </p>
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="max-w-2xl">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                            <div className="flex items-center mb-4">
                                <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                                <h2 className="text-lg font-semibold text-red-800">Warning: This action cannot be undone</h2>
                            </div>
                            <p className="text-red-700">
                                Deleting this university will also permanently remove all associated schools, faculties, and majors.
                                This action cannot be reversed.
                            </p>
                        </div>

                        {/* University Info */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                            <div className="flex items-center mb-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Building2 className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-lg font-semibold text-gray-900">{university.name}</h3>
                                    {university.description && (
                                        <p className="text-gray-600">{university.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Confirmation */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete <strong>{university.name}</strong>?
                                This will remove all associated data permanently.
                            </p>

                            <div className="flex justify-end space-x-4">
                                <Link
                                    href="/universities"
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Deleting...' : 'Delete University'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

