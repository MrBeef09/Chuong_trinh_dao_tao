'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, AlertTriangle, Trash2, XCircle } from 'lucide-react'

interface Subject {
    id: string
    code: string
    name: string
    credits: number
    hours?: number
    semester?: string
    status: string
    major: {
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

export default function DeleteSubjectPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [subject, setSubject] = useState<Subject | null>(null)
    const [loading, setLoading] = useState(true)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

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

        setDeleteLoading(true)
        setError(null)

        try {
            const response = await fetch(`/api/subjects/${params.id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error('Failed to delete subject')
            }

            router.push('/subjects')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
            setDeleteLoading(false)
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back link */}
            <div className="flex items-center space-x-4 mb-4">
                <Link href="/subjects" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Danh sách học phần
                </Link>
                <span className="text-gray-300">/</span>
                <Link href={`/subjects/${params.id}`} className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500">
                    Chi tiết học phần
                </Link>
            </div>

            {/* Delete confirmation card */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-center">
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                            <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                        </div>
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Xác nhận xóa học phần</h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                Bạn có chắc chắn muốn xóa học phần này? Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn tất cả dữ liệu liên quan đến học phần này.
                            </p>
                        </div>
                    </div>

                    {/* Subject details */}
                    <div className="mt-6 border-t border-b border-gray-200">
                        <dl className="divide-y divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                <dt className="text-sm font-medium text-gray-500">Mã học phần</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{subject.code}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                <dt className="text-sm font-medium text-gray-500">Tên học phần</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{subject.name}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                <dt className="text-sm font-medium text-gray-500">Số tín chỉ</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{subject.credits}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                <dt className="text-sm font-medium text-gray-500">Ngành học</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{subject.major.name}</dd>
                            </div>
                        </dl>
                    </div>

                    {/* Error message if exists */}
                    {error && (
                        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <XCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">Lỗi khi xóa học phần</h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>{error}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="mt-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleteLoading}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {deleteLoading ? 'Đang xóa...' : 'Xác nhận xóa'}
                        </button>
                        <Link
                            href={`/subjects/${params.id}`}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                        >
                            Hủy
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}




