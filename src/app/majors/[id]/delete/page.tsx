'use client'

import Navigation from '@/components/Navigation'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, ArrowLeft, AlertTriangle, Users, GraduationCap, Building2 } from 'lucide-react'
import Link from 'next/link'

interface Major {
    id: string
    name: string
    code: string
    description: string | null
    level: string | null
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

interface DeleteMajorPageProps {
    params: { id: string }
}

export default function DeleteMajorPage({ params }: DeleteMajorPageProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const [major, setMajor] = useState<Major | null>(null)

    useEffect(() => {
        const fetchMajor = async () => {
            try {
                const response = await fetch(`/api/majors/${params.id}`)
                if (response.ok) {
                    const data = await response.json()
                    setMajor(data)
                }
            } catch (error) {
                console.error('Error fetching major:', error)
            } finally {
                setInitialLoading(false)
            }
        }

        fetchMajor()
    }, [params.id])

    const handleDelete = async () => {
        setLoading(true)

        try {
            const response = await fetch(`/api/majors/${params.id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                router.push('/majors')
                router.refresh()
            } else {
                console.error('Failed to delete major')
            }
        } catch (error) {
            console.error('Error deleting major:', error)
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
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                </main>
            </div>
        )
    }

    if (!major) {
        return (
            <div className="flex h-screen">
                <Navigation />
                <main className="flex-1 lg:ml-0 flex items-center justify-center">
                    <div className="text-center">
                        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Major not found</h3>
                        <p className="text-gray-500 mb-6">The major you're looking for doesn't exist.</p>
                        <Link
                            href="/majors"
                            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Back to Majors
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
                            href="/majors"
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors mr-4"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Delete Major</h1>
                            <p className="mt-2 text-gray-600">
                                Permanently remove this major from the system
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
                                Deleting this major will permanently remove all associated data.
                                This action cannot be reversed.
                            </p>
                        </div>

                        {/* Major Info */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                            <div className="flex items-center mb-4">
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <BookOpen className="h-6 w-6 text-orange-600" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-lg font-semibold text-gray-900">{major.name}</h3>
                                    <p className="text-sm font-mono text-gray-500">{major.code}</p>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Users className="h-4 w-4 mr-1" />
                                        {major.faculty.name}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <GraduationCap className="h-4 w-4 mr-1" />
                                        {major.faculty.school.name}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Building2 className="h-4 w-4 mr-1" />
                                        {major.faculty.school.university.name}
                                    </div>
                                    {major.level && (
                                        <p className="text-sm text-gray-500 mt-1">Level: {major.level}</p>
                                    )}
                                    {major.description && (
                                        <p className="text-gray-600 mt-2">{major.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Confirmation */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete <strong>{major.name} ({major.code})</strong>?
                                This will remove all associated data permanently.
                            </p>

                            <div className="flex justify-end space-x-4">
                                <Link
                                    href="/majors"
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Deleting...' : 'Delete Major'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}









