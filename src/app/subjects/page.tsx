'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, BookOpen, Clock, Award, Calculator } from 'lucide-react'

interface Subject {
    id: string
    code: string
    name: string
    credits: number
    hours?: number
    semester?: string
    status: string
    description?: string
    prerequisites?: string
    objectives?: string
    syllabus?: string
    major: {
        id: string
        name: string
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
    lecturers: {
        id: string
        role: string
        lecturer: {
            id: string
            fullName: string
            title?: string
        }
    }[]
}

export default function SubjectsPage() {
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchSubjects()
    }, [])

    const fetchSubjects = async () => {
        try {
            const response = await fetch('/api/subjects')
            if (!response.ok) {
                throw new Error('Failed to fetch subjects')
            }
            const data = await response.json()
            setSubjects(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string, code: string) => {
        if (!confirm(`Bạn có chắc chắn muốn xóa học phần ${code}?`)) {
            return
        }

        try {
            const response = await fetch(`/api/subjects/${id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error('Failed to delete subject')
            }

            setSubjects(subjects.filter(subject => subject.id !== id))
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

    const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0)

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Lỗi</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Quản lý Học phần</h1>
                        <p className="mt-2 text-gray-600">
                            Quản lý các học phần trong hệ thống đào tạo
                        </p>
                    </div>
                    <Link
                        href="/subjects/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm học phần
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <BookOpen className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Tổng số học phần
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {subjects.length}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Calculator className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Tổng số tín chỉ
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {totalCredits}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>


            </div>

            {/* Subjects List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                {subjects.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có học phần</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Bắt đầu bằng cách tạo học phần đầu tiên.
                        </p>
                        <div className="mt-6">
                            <Link
                                href="/subjects/new"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Thêm học phần
                            </Link>
                        </div>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {subjects.map((subject) => (
                            <li key={subject.id}>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <BookOpen className="h-5 w-5 text-blue-600" />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="flex items-center">
                                                    <p className="text-sm font-medium text-blue-600 truncate">
                                                        {subject.code}
                                                    </p>
                                                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subject.status)}`}>
                                                        {subject.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {subject.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {subject.major.faculty.school.university.name} → {subject.major.faculty.school.name} → {subject.major.faculty.name} → {subject.major.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="text-right">
                                                <p className="text-sm text-gray-900">
                                                    {subject.credits} tín chỉ
                                                </p>
                                                {subject.hours && (
                                                    <p className="text-sm text-gray-500">
                                                        {subject.hours} giờ học
                                                    </p>
                                                )}
                                                {subject.semester && (
                                                    <p className="text-sm text-gray-500">
                                                        Học kỳ: {subject.semester}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex space-x-1">
                                                <Link
                                                    href={`/subjects/${subject.id}`}
                                                    className="text-gray-400 hover:text-gray-600"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/subjects/${subject.id}/edit`}
                                                    className="text-gray-400 hover:text-gray-600"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(subject.id, subject.code)}
                                                    className="text-gray-400 hover:text-red-600"
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}
