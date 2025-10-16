'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

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

interface Lecturer {
    id: string
    fullName: string
    title?: string
    email?: string
    faculty: {
        name: string
    }
}

interface SubjectFormData {
    code: string
    name: string
    credits: number
    semester: string
    prerequisites: string
    majorId: string
    lecturerIds: string[]
}

export default function NewSubjectPage() {
    const router = useRouter()
    const [majors, setMajors] = useState<Major[]>([])
    const [lecturers, setLecturers] = useState<Lecturer[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState<SubjectFormData>({
        code: '',
        name: '',
        credits: 3,
        semester: '',
        prerequisites: '',
        majorId: '',
        lecturerIds: []
    })

    useEffect(() => {
        // Fetch majors and lecturers for dropdowns
        Promise.all([fetchMajors(), fetchLecturers()])
    }, [])

    const fetchMajors = async () => {
        try {
            const response = await fetch('/api/majors')
            if (!response.ok) {
                throw new Error('Failed to fetch majors')
            }
            const data = await response.json()
            setMajors(data)
            // Set default majorId if available
            if (data.length > 0) {
                setFormData(prev => ({ ...prev, majorId: data[0].id }))
            }
        } catch (err) {
            console.error('Error fetching majors:', err)
        }
    }

    const fetchLecturers = async () => {
        try {
            const response = await fetch('/api/lecturers?pageSize=100') // Get all lecturers by setting large pageSize
            if (!response.ok) {
                throw new Error('Failed to fetch lecturers')
            }
            const data = await response.json()
            setLecturers(data.lecturers || []) // Extract lecturers array from paginated response
        } catch (err) {
            console.error('Error fetching lecturers:', err)
            setLecturers([]) // Set empty array on error to prevent map error
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value === '' ? 0 : parseInt(value, 10) }))
    }

    const handleLecturerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
        setFormData(prev => ({ ...prev, lecturerIds: selectedOptions }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // Log the form data being submitted for debugging
        console.log('Submitting subject data:', formData)

        try {
            // Set a timeout to prevent hanging requests
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const response = await fetch('/api/subjects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                signal: controller.signal
            })

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json()
                console.error('Server error response:', errorData)
                throw new Error(errorData.error || 'Failed to create subject')
            }

            const result = await response.json()
            console.log('Subject created successfully:', result)

            router.push('/subjects')
        } catch (err) {
            console.error('Error in submit handler:', err)
            if (err.name === 'AbortError') {
                setError('Request timed out. The server took too long to respond.')
            } else {
                setError(err instanceof Error ? err.message : 'An error occurred')
            }
            setLoading(false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back link */}
            <div className="mb-4">
                <Link href="/subjects" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Quay lại danh sách học phần
                </Link>
            </div>

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Thêm học phần mới</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Điền các thông tin bên dưới để tạo học phần mới
                </p>
            </div>

            {/* Error display */}
            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-sm rounded-lg p-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                            Mã học phần *
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="code"
                                id="code"
                                required
                                value={formData.code}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="VD: MATH101"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Tên học phần *
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="VD: Đại số tuyến tính"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="credits" className="block text-sm font-medium text-gray-700">
                            Số tín chỉ *
                        </label>
                        <div className="mt-1">
                            <input
                                type="number"
                                name="credits"
                                id="credits"
                                required
                                min="1"
                                max="10"
                                value={formData.credits}
                                onChange={handleNumberChange}
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>
                    </div>


                    <div className="sm:col-span-2">
                        <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
                            Học kỳ
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="semester"
                                id="semester"
                                value={formData.semester}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="VD: Học kỳ 1, Năm 2"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="majorId" className="block text-sm font-medium text-gray-700">
                            Ngành học *
                        </label>
                        <div className="mt-1">
                            <select
                                id="majorId"
                                name="majorId"
                                required
                                value={formData.majorId}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            >
                                <option value="" disabled>-- Chọn ngành học --</option>
                                {majors.map((major) => (
                                    <option key={major.id} value={major.id}>
                                        {major.code} - {major.name} ({major.faculty.name})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>



                    <div className="sm:col-span-6">
                        <label htmlFor="prerequisites" className="block text-sm font-medium text-gray-700">
                            Điều kiện tiên quyết
                        </label>
                        <div className="mt-1">
                            <textarea
                                id="prerequisites"
                                name="prerequisites"
                                rows={3}
                                value={formData.prerequisites}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="Các học phần điều kiện cần học trước..."
                            />
                        </div>
                    </div>



                    <div className="sm:col-span-6">
                        <label htmlFor="lecturerIds" className="block text-sm font-medium text-gray-700">
                            Giảng viên phụ trách
                        </label>
                        <div className="mt-1">
                            <select
                                id="lecturerIds"
                                name="lecturerIds"
                                multiple
                                value={formData.lecturerIds}
                                onChange={handleLecturerChange}
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                size={5}
                            >
                                {lecturers.map((lecturer) => (
                                    <option key={lecturer.id} value={lecturer.id}>
                                        {lecturer.title} {lecturer.fullName} ({lecturer.faculty.name})
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1 text-xs text-gray-500">Giữ phím Ctrl (hoặc Command trên Mac) để chọn nhiều giảng viên</p>
                        </div>
                    </div>
                </div>

                {/* Form actions */}
                <div className="flex justify-end space-x-3 pt-5">
                    <Link
                        href="/subjects"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Hủy
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? 'Đang lưu...' : 'Lưu học phần'}
                    </button>
                </div>
            </form>
        </div>
    )
}
