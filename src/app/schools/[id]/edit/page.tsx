'use client'

import Navigation from '@/components/Navigation'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { GraduationCap, ArrowLeft, Building2 } from 'lucide-react'
import Link from 'next/link'

interface University {
    id: string
    name: string
}

interface School {
    id: string
    name: string
    description: string | null
    dean: string | null
    phone: string | null
    email: string | null
    address: string | null
    universityId: string
}

interface EditSchoolPageProps {
    params: { id: string }
}

export default function EditSchoolPage({ params }: EditSchoolPageProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const [universities, setUniversities] = useState<University[]>([])
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        dean: '',
        phone: '',
        email: '',
        address: '',
        universityId: ''
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch universities and school data in parallel
                const [universitiesResponse, schoolResponse] = await Promise.all([
                    fetch('/api/universities'),
                    fetch(`/api/schools/${params.id}`)
                ])

                if (universitiesResponse.ok) {
                    const universitiesData = await universitiesResponse.json()
                    setUniversities(universitiesData)
                }

                if (schoolResponse.ok) {
                    const school: School = await schoolResponse.json()
                    setFormData({
                        name: school.name,
                        description: school.description || '',
                        dean: school.dean || '',
                        phone: school.phone || '',
                        email: school.email || '',
                        address: school.address || '',
                        universityId: school.universityId
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
            const response = await fetch(`/api/schools/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                router.push('/schools')
                router.refresh()
            } else {
                console.error('Failed to update school')
            }
        } catch (error) {
            console.error('Error updating school:', error)
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
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
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
                            href="/schools"
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors mr-4"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Edit School</h1>
                            <p className="mt-2 text-gray-600">
                                Update school information
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="max-w-2xl">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center mb-6">
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <GraduationCap className="h-6 w-6 text-green-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900 ml-3">School Information</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label htmlFor="universityId" className="block text-sm font-medium text-gray-700 mb-2">
                                            University *
                                        </label>
                                        <select
                                            id="universityId"
                                            name="universityId"
                                            required
                                            value={formData.universityId}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        >
                                            <option value="">Select a university</option>
                                            {universities.map((university) => (
                                                <option key={university.id} value={university.id}>
                                                    {university.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            School Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Enter school name"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Enter school description"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="dean" className="block text-sm font-medium text-gray-700 mb-2">
                                            Dean
                                        </label>
                                        <input
                                            type="text"
                                            id="dean"
                                            name="dean"
                                            value={formData.dean}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Enter dean name"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Enter school address"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Enter email address"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end space-x-4">
                                <Link
                                    href="/schools"
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Updating...' : 'Update School'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}

