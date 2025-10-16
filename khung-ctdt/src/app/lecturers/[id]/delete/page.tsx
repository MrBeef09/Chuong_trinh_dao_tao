'use client'

import Navigation from '@/components/Navigation'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Lecturer {
    id: string
    fullName: string
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

export default function DeleteLecturerPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [lecturer, setLecturer] = useState<Lecturer | null>(null)
    const [loading, setLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchLecturer = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(`/api/lecturers/${params.id}`)
                if (response.ok) {
                    const data = await response.json()
                    setLecturer(data)
                } else {
                    console.error('Failed to fetch lecturer')
                }
            } catch (error) {
                console.error('Error fetching lecturer:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchLecturer()
    }, [params.id])

    const handleDelete = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/lecturers/${params.id}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                router.push('/lecturers')
                router.refresh()
            } else {
                console.error('Failed to delete lecturer')
            }
        } catch (error) {
            console.error('Error deleting lecturer:', error)
        } finally {
            setLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-screen">
                <Navigation />
                <main className="flex-1 lg:ml-0 p-8">
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                </main>
            </div>
        )
    }

    if (!lecturer) {
        return (
            <div className="flex h-screen">
                <Navigation />
                <main className="flex-1 lg:ml-0 p-8">
                    <div className="flex justify-center items-center h-full">
                        <div className="text-center">
                            <h2 className="text-xl font-semibold text-gray-900">Lecturer not found</h2>
                            <p className="mt-2 text-gray-600">The lecturer you're looking for doesn't exist or has been removed.</p>
                            <Link
                                href="/lecturers"
                                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Back to Lecturers
                            </Link>
                        </div>
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
                            href="/lecturers"
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors mr-4"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Delete Lecturer</h1>
                            <p className="mt-2 text-gray-600">
                                Permanently remove this lecturer from the system
                            </p>
                        </div>
                    </div>

                    {/* Confirmation */}
                    <div className="max-w-2xl">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                            <div className="flex items-center mb-4">
                                <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                                <h2 className="text-xl font-semibold text-gray-900">Confirm Deletion</h2>
                            </div>
                            <p className="text-gray-700 mb-4">
                                Are you sure you want to delete the following lecturer? This action cannot be undone.
                            </p>
                            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">{lecturer.fullName}</h3>
                                <p className="text-gray-600">{lecturer.faculty.name}</p>
                                <p className="text-gray-600">{lecturer.faculty.school.name}, {lecturer.faculty.school.university.name}</p>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <Link
                                    href="/lecturers"
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Deleting...' : 'Delete Lecturer'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}








