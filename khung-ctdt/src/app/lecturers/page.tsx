'use client'

import Navigation from '@/components/Navigation'
import { useState, useEffect } from 'react'
import { Users, Plus, Edit, Trash2, GraduationCap, Building2, Phone, Mail, MapPin, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'

interface Lecturer {
    id: string
    fullName: string
    title: string | null
    firstName: string
    lastName: string
    email: string | null
    phone: string | null
    office: string | null
    biography: string | null
    specialization: string | null
    joinDate: string | null
    status: string
    imageUrl: string | null
    faculty: {
        id: string
        name: string
        school: {
            id: string
            name: string
            university: {
                id: string
                name: string
            }
        }
    }
}

interface PaginationData {
    total: number
    pageSize: number
    currentPage: number
    totalPages: number
}

export default function LecturersPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [lecturers, setLecturers] = useState<Lecturer[]>([])
    const [pagination, setPagination] = useState<PaginationData>({
        total: 0,
        pageSize: 5,
        currentPage: 1,
        totalPages: 1
    })
    const [loading, setLoading] = useState(true)

    const currentPage = parseInt(searchParams.get('page') || '1')
    const pageSize = 5

    useEffect(() => {
        const fetchLecturers = async () => {
            setLoading(true)
            try {
                const response = await fetch(`/api/lecturers?page=${currentPage}&pageSize=${pageSize}`)
                if (response.ok) {
                    const data = await response.json()
                    setLecturers(data.lecturers)
                    setPagination(data.pagination)
                } else {
                    console.error('Failed to fetch lecturers')
                }
            } catch (error) {
                console.error('Error fetching lecturers:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchLecturers()
    }, [currentPage, pageSize])

    const handlePageChange = (page: number) => {
        router.push(`/lecturers?page=${page}`)
    }

    return (
        <div className="flex h-screen">
            <Navigation />

            <main className="flex-1 lg:ml-0 overflow-auto">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Lecturers</h1>
                            <p className="mt-2 text-gray-600">
                                Manage lecturer information by faculty
                            </p>
                        </div>
                        <Link
                            href="/lecturers/new"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Add Lecturer
                        </Link>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    )}

                    {/* Lecturers List */}
                    {!loading && (
                        <>
                            <div className="overflow-hidden bg-white shadow-sm border border-gray-200 rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lecturer</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {lecturers.map((lecturer) => (
                                            <tr key={lecturer.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="p-2 bg-blue-100 rounded-lg">
                                                            <Users className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{lecturer.fullName}</div>
                                                            <div className="text-sm text-gray-500">{lecturer.specialization || 'Not specified'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{lecturer.faculty.name}</div>
                                                    <div className="text-sm text-gray-500">{lecturer.faculty.school.name}</div>
                                                    <div className="text-xs text-gray-500">{lecturer.faculty.school.university.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {lecturer.email && (
                                                        <div className="flex items-center text-sm text-gray-500 mb-1">
                                                            <Mail className="h-4 w-4 mr-1 flex-shrink-0" />
                                                            <span className="truncate max-w-[150px]">{lecturer.email}</span>
                                                        </div>
                                                    )}
                                                    {lecturer.phone && (
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <Phone className="h-4 w-4 mr-1 flex-shrink-0" />
                                                            <span>{lecturer.phone}</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${lecturer.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                            lecturer.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {lecturer.status}
                                                    </span>
                                                    {lecturer.joinDate && (
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            Joined: {new Date(lecturer.joinDate).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link
                                                        href={`/lecturers/${lecturer.id}/edit`}
                                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <Link
                                                        href={`/lecturers/${lecturer.id}/delete`}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Empty State */}
                            {lecturers.length === 0 && !loading && (
                                <div className="text-center py-12">
                                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No lecturers found</h3>
                                    <p className="text-gray-500 mb-6">Get started by adding your first lecturer.</p>
                                    <Link
                                        href="/lecturers/new"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Plus className="h-5 w-5 mr-2" />
                                        Add Lecturer
                                    </Link>
                                </div>
                            )}

                            {/* Enhanced Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="mt-8 flex justify-center">
                                    <div className="flex flex-col items-center">
                                        {/* Main pagination controls */}
                                        <div className="inline-flex shadow-sm rounded-md">
                                            {/* First Page Button */}
                                            <button
                                                onClick={() => handlePageChange(1)}
                                                disabled={pagination.currentPage === 1}
                                                className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <span className="sr-only">First Page</span>
                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0L9.414 10.828a1 1 0 010-1.414L14.293 4.707a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                                    <path fillRule="evenodd" d="M10.707 15.707a1 1 0 01-1.414 0L4.414 10.828a1 1 0 010-1.414L9.293 4.707a1 1 0 011.414 1.414L6.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>

                                            {/* Previous Button */}
                                            <button
                                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                                disabled={pagination.currentPage === 1}
                                                className="relative inline-flex items-center px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <span className="sr-only">Previous</span>
                                                <ChevronLeft className="h-5 w-5" />
                                            </button>

                                            {/* Current Page Indicator */}
                                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium">
                                                Page <span className="font-bold text-blue-700 mx-1">{pagination.currentPage}</span> of {pagination.totalPages}
                                            </span>

                                            {/* Next Button */}
                                            <button
                                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                                disabled={pagination.currentPage === pagination.totalPages}
                                                className="relative inline-flex items-center px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <span className="sr-only">Next</span>
                                                <ChevronRight className="h-5 w-5" />
                                            </button>

                                            {/* Last Page Button */}
                                            <button
                                                onClick={() => handlePageChange(pagination.totalPages)}
                                                disabled={pagination.currentPage === pagination.totalPages}
                                                className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <span className="sr-only">Last Page</span>
                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M4.293 15.707a1 1 0 001.414 0L10.586 10.828a1 1 0 000-1.414L5.707 4.707a1 1 0 00-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 000 1.414z" clipRule="evenodd" />
                                                    <path fillRule="evenodd" d="M9.293 15.707a1 1 0 001.414 0L15.586 10.828a1 1 0 000-1.414L10.707 4.707a1 1 0 00-1.414 1.414L13.586 10l-4.293 4.293a1 1 0 000 1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Jump to specific page */}
                                        {pagination.totalPages > 2 && (
                                            <div className="mt-4 flex items-center space-x-2">
                                                <span className="text-sm text-gray-700">Jump to page:</span>
                                                <div className="flex items-center">
                                                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                                                        <button
                                                            key={page}
                                                            onClick={() => handlePageChange(page)}
                                                            className={`px-3 py-1 mx-1 text-sm rounded-md ${page === pagination.currentPage
                                                                    ? 'bg-blue-600 text-white'
                                                                    : 'border border-gray-300 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Pagination Info */}
                            {pagination.total > 0 && (
                                <div className="mt-4 text-center text-sm text-gray-500">
                                    Showing {(pagination.currentPage - 1) * pagination.pageSize + 1} to {Math.min(pagination.currentPage * pagination.pageSize, pagination.total)} of {pagination.total} lecturers
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}