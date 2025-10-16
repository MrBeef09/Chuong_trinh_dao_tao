'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, Calendar, Users, GraduationCap, Building, BookOpen } from 'lucide-react'

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
        code: string
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

interface CoursePageProps {
    params: {
        id: string
    }
}

export default function CourseDetailPage({ params }: CoursePageProps) {
    const router = useRouter()
    const [course, setCourse] = useState<Course | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchCourse()
    }, [params.id])

    const fetchCourse = async () => {
        try {
            const response = await fetch(`/api/courses/${params.id}`)
            if (!response.ok) {
                throw new Error('Failed to fetch course')
            }
            const data = await response.json()
            setCourse(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!course || !confirm(`Bạn có chắc chắn muốn xóa khóa học ${course.code}?`)) {
            return
        }

        try {
            const response = await fetch(`/api/courses/${course.id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error('Failed to delete course')
            }

            router.push('/courses')
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

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Chưa xác định'
        return new Date(dateString).toLocaleDateString('vi-VN')
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (error || !course) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Lỗi</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{error || 'Không tìm thấy khóa học'}</p>
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
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link
                            href="/courses"
                            className="text-gray-400 hover:text-gray-600 mr-4"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{course.name}</h1>
                            <p className="mt-2 text-gray-600">
                                Mã khóa học: {course.code}
                            </p>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <Link
                            href={`/courses/${course.id}/edit`}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {/* Course Information */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Thông tin khóa học
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Chi tiết về khóa học
                            </p>
                        </div>
                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Mã khóa học
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {course.code}
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Tên khóa học
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {course.name}
                                    </dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Niên khóa
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {course.academicYear}
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Hệ đào tạo
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {course.educationLevel}
                                    </dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Chương trình đào tạo
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {course.program}
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Trạng thái
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                                            {course.status}
                                        </span>
                                    </dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Ngày bắt đầu
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {formatDate(course.startDate)}
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Ngày kết thúc
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {formatDate(course.endDate)}
                                    </dd>
                                </div>
                                {course.description && (
                                    <div className="bg-gray-50 px-4 py-5 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Mô tả
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {course.description}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    {/* Stats */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Thống kê
                            </h3>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                            <div className="flex items-center mb-4">
                                <Users className="h-8 w-8 text-blue-600 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Số lượng sinh viên</p>
                                    <p className="text-2xl font-bold text-gray-900">{course.studentCount}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Academic Hierarchy */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Cấu trúc học thuật
                            </h3>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <Building className="h-5 w-5 text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {course.major.faculty.school.university.name}
                                        </p>
                                        <p className="text-xs text-gray-500">Trường đại học</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Building className="h-5 w-5 text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {course.major.faculty.school.name}
                                        </p>
                                        <p className="text-xs text-gray-500">Khoa</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Building className="h-5 w-5 text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {course.major.faculty.name}
                                        </p>
                                        <p className="text-xs text-gray-500">Khoa</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <BookOpen className="h-5 w-5 text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {course.major.name}
                                        </p>
                                        <p className="text-xs text-gray-500">Ngành học</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}