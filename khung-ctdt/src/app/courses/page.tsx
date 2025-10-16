'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, Calendar, Users, GraduationCap } from 'lucide-react'

interface Course {
    id: string
    code: string
    name: string
    academicYear: string
    educationLevel: string
    program: string
    status: string
    description?: string
    startDate?: string
    endDate?: string
    studentCount: number
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
}

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchCourses()
    }, [])

    const fetchCourses = async () => {
        try {
            const response = await fetch('/api/courses')
            if (!response.ok) {
                throw new Error('Failed to fetch courses')
            }
            const data = await response.json()
            setCourses(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string, code: string) => {
        if (!confirm(`Bạn có chắc chắn muốn xóa khóa học ${code}?`)) {
            return
        }

        try {
            const response = await fetch(`/api/courses/${id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error('Failed to delete course')
            }

            setCourses(courses.filter(course => course.id !== id))
        } catch (err) {
            alert('Không thể xóa khóa học: ' + (err instanceof Error ? err.message : 'Lỗi không xác định'))
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Đang đào tạo':
                return 'bg-green-100 text-green-800'
            case 'Đã tốt nghiệp':
                return 'bg-blue-100 text-blue-800'
            case 'Tạm dừng':
                return 'bg-yellow-100 text-yellow-800'
            case 'Hủy bỏ':
                return 'bg-red-100 text-red-800'
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
                        <h1 className="text-3xl font-bold text-gray-900">Quản lý Khóa học</h1>
                        <p className="mt-2 text-gray-600">
                            Quản lý các khóa học trong hệ thống đại học
                        </p>
                    </div>
                    <Link
                        href="/courses/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm khóa học
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <GraduationCap className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Tổng số khóa học
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {courses.length}
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
                                <Users className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Tổng sinh viên
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {courses.reduce((sum, course) => sum + course.studentCount, 0)}
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
                                <Calendar className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Đang đào tạo
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {courses.filter(course => course.status === 'Đang đào tạo').length}
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
                                <GraduationCap className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Đã tốt nghiệp
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {courses.filter(course => course.status === 'Đã tốt nghiệp').length}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Courses List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                {courses.length === 0 ? (
                    <div className="text-center py-12">
                        <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có khóa học</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Bắt đầu bằng cách tạo khóa học đầu tiên.
                        </p>
                        <div className="mt-6">
                            <Link
                                href="/courses/new"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Thêm khóa học
                            </Link>
                        </div>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {courses.map((course) => (
                            <li key={course.id}>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <GraduationCap className="h-5 w-5 text-blue-600" />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="flex items-center">
                                                    <p className="text-sm font-medium text-blue-600 truncate">
                                                        {course.code}
                                                    </p>
                                                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                                                        {course.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {course.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {course.major.faculty.school.university.name} → {course.major.faculty.school.name} → {course.major.faculty.name} → {course.major.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="text-right">
                                                <p className="text-sm text-gray-900">
                                                    Niên khóa: {course.academicYear}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Hệ: {course.educationLevel}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Sinh viên: {course.studentCount}
                                                </p>
                                            </div>
                                            <div className="flex space-x-1">
                                                <Link
                                                    href={`/courses/${course.id}`}
                                                    className="text-gray-400 hover:text-gray-600"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/courses/${course.id}/edit`}
                                                    className="text-gray-400 hover:text-gray-600"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(course.id, course.code)}
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