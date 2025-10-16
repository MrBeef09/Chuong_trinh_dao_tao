'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookOpen, Edit, Trash2, ArrowLeft, Clock, Calculator, Users, CalendarClock } from 'lucide-react'

interface Subject {
    id: string
    code: string
    name: string
    description?: string
    credits: number
    hours?: number
    semester?: string
    prerequisites?: string
    objectives?: string
    syllabus?: string
    imageUrl?: string
    status: string
    createdAt: string
    updatedAt: string
    major: {
        id: string
        name: string
        code: string
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
    lecturers: {
        id: string
        role: string
        lecturer: {
            id: string
            fullName: string
            title?: string
            email?: string
        }
    }[]
}

export default function SubjectDetailsPage({ params }: { params: { id: string } }) {
    const [subject, setSubject] = useState<Subject | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        fetchSubject()
    }, [])

    const fetchSubject = async () => {
        try {
            const response = await fetch(`/api/subjects/${params.id}`)
            if (!response.ok) {
                throw new Error('Failed to fetch subject details')
            }
            const data = await response.json()
            setSubject(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!subject) return

        if (!confirm(`Bạn có chắc chắn muốn xóa học phần ${subject.code}?`)) {
            return
        }

        try {
            const response = await fetch(`/api/subjects/${params.id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error('Failed to delete subject')
            }

            router.push('/subjects')
        } catch (err) {
            alert('Không thể xóa học phần: ' + (err instanceof Error ? err.message : 'Lỗi không xác định'))
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800'
            case 'Inactive':
                return 'bg-red-100 text-red-800'
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (error || !subject) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Lỗi</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{error || 'Không thể tải thông tin học phần'}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <Link href="/subjects" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Quay lại danh sách học phần
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back link */}
            <div className="mb-4">
                <Link href="/subjects" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Quay lại danh sách học phần
                </Link>
            </div>

            {/* Header */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
                    <div>
                        <div className="flex items-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mr-2">
                                {subject.code}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subject.status)}`}>
                                {subject.status}
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mt-1">{subject.name}</h2>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            {subject.major.faculty.school.university.name} → {subject.major.faculty.school.name} → {subject.major.faculty.name} → {subject.major.name}
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <Link
                            href={`/subjects/${subject.id}/edit`}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <Edit className="h-3.5 w-3.5 mr-1" />
                            Chỉnh sửa
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Xóa
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Calculator className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Số tín chỉ</dt>
                                    <dd className="text-lg font-medium text-gray-900">{subject.credits}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {subject.hours && (
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Clock className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Số giờ học</dt>
                                        <dd className="text-lg font-medium text-gray-900">{subject.hours}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {subject.semester && (
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <CalendarClock className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Học kỳ</dt>
                                        <dd className="text-lg font-medium text-gray-900">{subject.semester}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Users className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Giảng viên</dt>
                                    <dd className="text-lg font-medium text-gray-900">{subject.lecturers?.length || 0}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subject Details */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Thông tin chi tiết</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        {subject.description && (
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Mô tả</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {subject.description.split('\n').map((line, i) => (
                                        <p key={i} className={i > 0 ? 'mt-1' : ''}>{line}</p>
                                    ))}
                                </dd>
                            </div>
                        )}
                        {subject.prerequisites && (
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Điều kiện tiên quyết</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {subject.prerequisites.split('\n').map((line, i) => (
                                        <p key={i} className={i > 0 ? 'mt-1' : ''}>{line}</p>
                                    ))}
                                </dd>
                            </div>
                        )}
                        {subject.objectives && (
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Mục tiêu học phần</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {subject.objectives.split('\n').map((line, i) => (
                                        <p key={i} className={i > 0 ? 'mt-1' : ''}>{line}</p>
                                    ))}
                                </dd>
                            </div>
                        )}
                        {subject.syllabus && (
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Đề cương học phần</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {subject.syllabus.split('\n').map((line, i) => (
                                        <p key={i} className={i > 0 ? 'mt-1' : ''}>{line}</p>
                                    ))}
                                </dd>
                            </div>
                        )}
                    </dl>
                </div>
            </div>

            {/* Lecturers */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Giảng viên giảng dạy</h3>
                </div>
                <div className="border-t border-gray-200">
                    {subject.lecturers && subject.lecturers.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {subject.lecturers.map((lecturerRelation) => (
                                <li key={lecturerRelation.id} className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {lecturerRelation.lecturer.title} {lecturerRelation.lecturer.fullName}
                                            </p>
                                            {lecturerRelation.lecturer.email && (
                                                <p className="text-sm text-gray-500">{lecturerRelation.lecturer.email}</p>
                                            )}
                                        </div>
                                        <div>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {lecturerRelation.role}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-sm text-gray-500">Không có giảng viên được phân công</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}




