'use client'

import Navigation from '@/components/Navigation'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, ArrowLeft, Users, GraduationCap, Building2 } from 'lucide-react'
import Link from 'next/link'

interface Faculty {
    id: string
    name: string
    school: {
        name: string
        university: {
            name: string
        }
    }
}

export default function NewMajorPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [faculties, setFaculties] = useState<Faculty[]>([])
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        duration: '',
        credits: '',
        level: '',
        facultyId: ''
    })

    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                const response = await fetch('/api/faculties')
                if (response.ok) {
                    const data = await response.json()
                    setFaculties(data)
                }
            } catch (error) {
                console.error('Error fetching faculties:', error)
            }
        }

        fetchFaculties()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.facultyId) {
            alert('Please select a faculty')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/majors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    duration: formData.duration ? parseInt(formData.duration) : null,
                    credits: formData.credits ? parseInt(formData.credits) : null
                }),
            })

            if (response.ok) {
                router.push('/majors')
                router.refresh()
            } else {
                console.error('Failed to create major')
            }
        } catch (error) {
            console.error('Error creating major:', error)
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

    return (
        <div className="flex h-screen">
            <Navigation />

            <main className="flex-1 lg:ml-0">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center mb-8">
                        <Link
                            href="/majors"
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors mr-4"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Add New Major</h1>
                            <p className="mt-2 text-gray-600">
                                Create a new major in the system
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="max-w-2xl">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center mb-6">
                                    <div className="p-3 bg-orange-100 rounded-lg">
                                        <BookOpen className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900 ml-3">Major Information</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label htmlFor="facultyId" className="block text-sm font-medium text-gray-700 mb-2">
                                            Faculty *
                                        </label>
                                        <select
                                            id="facultyId"
                                            name="facultyId"
                                            required
                                            value={formData.facultyId}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        >
                                            <option value="">Select a faculty</option>
                                            {faculties.map((faculty) => (
                                                <option key={faculty.id} value={faculty.id}>
                                                    {faculty.name} - {faculty.school.name} - {faculty.school.university.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Major Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                            placeholder="Enter major name"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                                            Major Code *
                                        </label>
                                        <input
                                            type="text"
                                            id="code"
                                            name="code"
                                            required
                                            value={formData.code}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono"
                                            placeholder="e.g., CS101"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                            placeholder="Enter major description"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                                            Academic Level
                                        </label>
                                        <select
                                            id="level"
                                            name="level"
                                            value={formData.level}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        >
                                            <option value="">Select level</option>
                                            <option value="Bachelor">Bachelor</option>
                                            <option value="Master">Master</option>
                                            <option value="PhD">PhD</option>
                                            <option value="Associate">Associate</option>
                                            <option value="Certificate">Certificate</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                                            Duration (years)
                                        </label>
                                        <input
                                            type="number"
                                            id="duration"
                                            name="duration"
                                            min="1"
                                            max="10"
                                            value={formData.duration}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                            placeholder="e.g., 4"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="credits" className="block text-sm font-medium text-gray-700 mb-2">
                                            Total Credits
                                        </label>
                                        <input
                                            type="number"
                                            id="credits"
                                            name="credits"
                                            min="1"
                                            max="500"
                                            value={formData.credits}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                            placeholder="e.g., 120"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end space-x-4">
                                <Link
                                    href="/majors"
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Creating...' : 'Create Major'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}









