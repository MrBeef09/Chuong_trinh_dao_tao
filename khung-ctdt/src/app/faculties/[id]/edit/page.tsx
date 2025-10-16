'use client'

import Navigation from '@/components/Navigation'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Users, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface School {
    id: string
    name: string
    university: {
        name: string
    }
}

interface Faculty {
    id: string
    name: string
    description: string | null
    head: string | null
    phone: string | null
    email: string | null
    office: string | null
    schoolId: string
}

interface EditFacultyPageProps {
    params: { id: string }
}

export default function EditFacultyPage({ params }: EditFacultyPageProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const [schools, setSchools] = useState<School[]>([])
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        head: '',
        phone: '',
        email: '',
        office: '',
        schoolId: ''
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch schools and faculty data in parallel
                const [schoolsResponse, facultyResponse] = await Promise.all([
                    fetch('/api/schools'),
                    fetch(`/api/faculties/${params.id}`)
                ])

                if (schoolsResponse.ok) {
                    const schoolsData = await schoolsResponse.json()
                    setSchools(schoolsData)
                }

                if (facultyResponse.ok) {
                    const faculty: Faculty = await facultyResponse.json()
                    setFormData({
                        name: faculty.name,
                        description: faculty.description || '',
                        head: faculty.head || '',
                        phone: faculty.phone || '',
                        email: faculty.email || '',
                        office: faculty.office || '',
                        schoolId: faculty.schoolId
                    })
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setInitialLoading(false)
            }
        }

        fetchData()
    }, [params.id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch(`/api/faculties/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                router.push('/faculties')
                router.refresh()
            } else {
                console.error('Failed to update faculty')
            }
        } catch (error) {
            console.error('Error updating faculty:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    if (initialLoading) {
        return (
            <div className="flex h-screen">
                <Navigation />
                <main className="flex-1 lg:ml-0 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
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
                            href="/faculties"
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors mr-4"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Edit Faculty</h1>
                            <p className="mt-2 text-gray-600">
                                Update faculty information
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="max-w-2xl">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center mb-6">
                                    <div className="p-3 bg-purple-100 rounded-lg">
                                        <Users className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900 ml-3">Faculty Information</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label htmlFor="schoolId" className="block text-sm font-medium text-gray-700 mb-2">
                                            School *
                                        </label>
                                        <select
                                            id="schoolId"
                                            name="schoolId"
                                            required
                                            value={formData.schoolId}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        >
                                            <option value="">Select a school</option>
                                            {schools.map((school) => (
                                                <option key={school.id} value={school.id}>
                                                    {school.name} - {school.university.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Faculty Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="Enter faculty name"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows={3}
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="Enter faculty description"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="head" className="block text-sm font-medium text-gray-700 mb-2">
                                            Head of Faculty
                                        </label>
                                        <input
                                            type="text"
                                            id="head"
                                            name="head"
                                            value={formData.head}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="Enter head of faculty name"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="office" className="block text-sm font-medium text-gray-700 mb-2">
                                            Office Location
                                        </label>
                                        <input
                                            type="text"
                                            id="office"
                                            name="office"
                                            value={formData.office}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="Enter office location"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="Enter phone number"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="Enter email address"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end space-x-4">
                                <Link
                                    href="/faculties"
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Updating...' : 'Update Faculty'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}









