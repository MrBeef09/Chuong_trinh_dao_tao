'use client'

import Navigation from '@/components/Navigation'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Users, ArrowLeft, AlertTriangle, GraduationCap, Building2 } from 'lucide-react'
import Link from 'next/link'

interface Faculty {
    id: string
    name: string
    description: string | null
    school: {
        name: string
        university: {
            name: string
        }
    }
}

interface DeleteFacultyPageProps {
    params: { id: string }
}

export default function DeleteFacultyPage({ params }: DeleteFacultyPageProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const [faculty, setFaculty] = useState<Faculty | null>(null)

    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                const response = await fetch(`/api/faculties/${params.id}`)
                if (response.ok) {
                    const data = await response.json()
                    setFaculty(data)
                }
            } catch (error) {
                console.error('Error fetching faculty:', error)
            } finally {
                setInitialLoading(false)
            }
        }

        fetchFaculty()
    }, [params.id])

    const handleDelete = async () => {
        setLoading(true)

        try {
            const response = await fetch(`/api/faculties/${params.id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                router.push('/faculties')
                router.refresh()
            } else {
                console.error('Failed to delete faculty')
            }
        } catch (error) {
            console.error('Error deleting faculty:', error)
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
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                </main>
            </div>
        )
    }

    if (!faculty) {
        return (
            <div className="flex h-screen">
                <Navigation />
                <main className="flex-1 lg:ml-0 flex items-center justify-center">
                    <div className="text-center">
                        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Faculty not found</h3>
                        <p className="text-gray-500 mb-6">The faculty you're looking for doesn't exist.</p>
                        <Link
                            href="/faculties"
                            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Back to Faculties
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
                            href="/faculties"
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors mr-4"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Delete Faculty</h1>
                            <p className="mt-2 text-gray-600">
                                Permanently remove this faculty from the system
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
                                Deleting this faculty will also permanently remove all associated majors.
                                This action cannot be reversed.
                            </p>
                        </div>

                        {/* Faculty Info */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                            <div className="flex items-center mb-4">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <Users className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-lg font-semibold text-gray-900">{faculty.name}</h3>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <GraduationCap className="h-4 w-4 mr-1" />
                                        {faculty.school.name}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Building2 className="h-4 w-4 mr-1" />
                                        {faculty.school.university.name}
                                    </div>
                                    {faculty.description && (
                                        <p className="text-gray-600 mt-1">{faculty.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Confirmation */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete <strong>{faculty.name}</strong> from <strong>{faculty.school.name}</strong>?
                                This will remove all associated data permanently.
                            </p>

                            <div className="flex justify-end space-x-4">
                                <Link
                                    href="/faculties"
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Deleting...' : 'Delete Faculty'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}









