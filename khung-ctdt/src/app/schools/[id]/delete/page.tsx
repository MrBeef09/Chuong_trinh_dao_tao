'use client'

import Navigation from '@/components/Navigation'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { GraduationCap, ArrowLeft, AlertTriangle, Building2 } from 'lucide-react'
import Link from 'next/link'

interface School {
    id: string
    name: string
    description: string | null
    university: {
        name: string
    }
}

interface DeleteSchoolPageProps {
    params: { id: string }
}

export default function DeleteSchoolPage({ params }: DeleteSchoolPageProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const [school, setSchool] = useState<School | null>(null)

    useEffect(() => {
        const fetchSchool = async () => {
            try {
                const response = await fetch(`/api/schools/${params.id}`)
                if (response.ok) {
                    const data = await response.json()
                    setSchool(data)
                }
            } catch (error) {
                console.error('Error fetching school:', error)
            } finally {
                setInitialLoading(false)
            }
        }

        fetchSchool()
    }, [params.id])

    const handleDelete = async () => {
        setLoading(true)

        try {
            const response = await fetch(`/api/schools/${params.id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                router.push('/schools')
                router.refresh()
            } else {
                console.error('Failed to delete school')
            }
        } catch (error) {
            console.error('Error deleting school:', error)
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
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                </main>
            </div>
        )
    }

    if (!school) {
        return (
            <div className="flex h-screen">
                <Navigation />
                <main className="flex-1 lg:ml-0 flex items-center justify-center">
                    <div className="text-center">
                        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">School not found</h3>
                        <p className="text-gray-500 mb-6">The school you're looking for doesn't exist.</p>
                        <Link
                            href="/schools"
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Back to Schools
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
                            href="/schools"
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors mr-4"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Delete School</h1>
                            <p className="mt-2 text-gray-600">
                                Permanently remove this school from the system
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
                                Deleting this school will also permanently remove all associated faculties and majors.
                                This action cannot be reversed.
                            </p>
                        </div>

                        {/* School Info */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                            <div className="flex items-center mb-4">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <GraduationCap className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-lg font-semibold text-gray-900">{school.name}</h3>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Building2 className="h-4 w-4 mr-1" />
                                        {school.university.name}
                                    </div>
                                    {school.description && (
                                        <p className="text-gray-600 mt-1">{school.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Confirmation */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete <strong>{school.name}</strong> from <strong>{school.university.name}</strong>?
                                This will remove all associated data permanently.
                            </p>

                            <div className="flex justify-end space-x-4">
                                <Link
                                    href="/schools"
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Deleting...' : 'Delete School'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
