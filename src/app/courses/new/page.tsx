'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Calendar, Users, GraduationCap } from 'lucide-react'

interface Major {
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

export default function NewCoursePage() {
    const router = useRouter()
    const [majors, setMajors] = useState<Major[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        academicYear: '',
        educationLevel: 'Đại học chính quy',
        program: '',
        status: 'Đang đào tạo',
        description: '',
        startDate: '',
        endDate: '',
        studentCount: 0,
        majorId: ''
    })

    useEffect(() => {
        fetchMajors()
    }, [])

    const fetchMajors = async () => {
        try {
            const response = await fetch('/api/majors')
            if (!response.ok) {
                throw new Error('Failed to fetch majors')
            }
            const data = await response.json()
            setMajors(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setError(null)

        try {
            const response = await fetch('/api/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to create course')
            }

            router.push('/courses')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'studentCount' ? parseInt(value) || 0 : value
        }))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center mb-4">
                    <Link
                        href="/courses"
                        className="text-gray-400 hover:text-gray-600 mr-4"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Thêm khóa học mới</h1>
                        <p className="mt-2 text-gray-600">
                            Tạo khóa học mới trong hệ thống đại học
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white shadow sm:rounded-lg">
                <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">Lỗi</h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>{error}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {/* Mã khóa học */}
                        <div>
                            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                                Mã khóa học *
                            </label>
                            <input
                                type="text"
                                name="code"
                                id="code"
                                required
                                value={formData.code}
                                onChange={handleChange}
                                placeholder="VD: DH_K17.40"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        {/* Tên khóa học */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Tên khóa học *
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="VD: Khóa học Kỹ thuật phần mềm K17"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        {/* Niên khóa */}
                        <div>
                            <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700">
                                Niên khóa *
                            </label>
                            <input
                                type="text"
                                name="academicYear"
                                id="academicYear"
                                required
                                value={formData.academicYear}
                                onChange={handleChange}
                                placeholder="VD: 2023-2027"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        {/* Hệ đào tạo */}
                        <div>
                            <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700">
                                Hệ đào tạo *
                            </label>
                            <select
                                name="educationLevel"
                                id="educationLevel"
                                required
                                value={formData.educationLevel}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="Đại học chính quy">Đại học chính quy</option>
                                <option value="Đại học tại chức">Đại học tại chức</option>
                                <option value="Đại học từ xa">Đại học từ xa</option>
                                <option value="Cao đẳng">Cao đẳng</option>
                                <option value="Trung cấp">Trung cấp</option>
                            </select>
                        </div>

                        {/* Chương trình đào tạo */}
                        <div>
                            <label htmlFor="program" className="block text-sm font-medium text-gray-700">
                                Chương trình đào tạo *
                            </label>
                            <input
                                type="text"
                                name="program"
                                id="program"
                                required
                                value={formData.program}
                                onChange={handleChange}
                                placeholder="VD: Kỹ thuật phần mềm"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        {/* Ngành học */}
                        <div>
                            <label htmlFor="majorId" className="block text-sm font-medium text-gray-700">
                                Ngành học *
                            </label>
                            <select
                                name="majorId"
                                id="majorId"
                                required
                                value={formData.majorId}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">Chọn ngành học</option>
                                {majors.map((major) => (
                                    <option key={major.id} value={major.id}>
                                        {major.faculty.school.university.name} → {major.faculty.school.name} → {major.faculty.name} → {major.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Trạng thái */}
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                Trạng thái *
                            </label>
                            <select
                                name="status"
                                id="status"
                                required
                                value={formData.status}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="Đang đào tạo">Đang đào tạo</option>
                                <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
                                <option value="Tạm dừng">Tạm dừng</option>
                                <option value="Hủy bỏ">Hủy bỏ</option>
                            </select>
                        </div>

                        {/* Số lượng sinh viên */}
                        <div>
                            <label htmlFor="studentCount" className="block text-sm font-medium text-gray-700">
                                Số lượng sinh viên
                            </label>
                            <input
                                type="number"
                                name="studentCount"
                                id="studentCount"
                                min="0"
                                value={formData.studentCount}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        {/* Ngày bắt đầu */}
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                Ngày bắt đầu
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                id="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        {/* Ngày kết thúc */}
                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                                Ngày kết thúc
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                id="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    {/* Mô tả */}
                    <div className="mt-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Mô tả
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Mô tả về khóa học..."
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6 flex justify-end space-x-3">
                        <Link
                            href="/courses"
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Hủy
                        </Link>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Đang tạo...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Tạo khóa học
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}