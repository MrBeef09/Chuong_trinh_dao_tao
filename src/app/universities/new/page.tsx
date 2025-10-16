'use client'

import Navigation from '@/components/Navigation'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewUniversityPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        established: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch('/api/universities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    established: formData.established ? new Date(formData.established) : null
                }),
            })

            if (response.ok) {
                router.push('/universities')
                router.refresh()
            } else {
                console.error('Failed to create university')
            }
        } catch (error) {
            console.error('Error creating university:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
                            href="/universities"
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors mr-4"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Add New University</h1>
                            <p className="mt-2 text-gray-600">
                                Create a new university in the system
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="max-w-2xl">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center mb-6">
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <Building2 className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900 ml-3">University Information</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            University Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter university name"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter university description"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter university address"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter email address"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                                            Website
                                        </label>
                                        <input
                                            type="url"
                                            id="website"
                                            name="website"
                                            value={formData.website}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="https://example.com"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="established" className="block text-sm font-medium text-gray-700 mb-2">
                                            Established Year
                                        </label>
                                        <input
                                            type="date"
                                            id="established"
                                            name="established"
                                            value={formData.established}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end space-x-4">
                                <Link
                                    href="/universities"
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Creating...' : 'Create University'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}

