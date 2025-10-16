import Navigation from '@/components/Navigation'
import { prisma } from '@/lib/prisma'
import { GraduationCap, Plus, Edit, Trash2, Building2, Phone, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'

async function getSchools() {
    try {
        return await prisma.school.findMany({
            include: {
                university: true,
                faculties: {
                    include: {
                        majors: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    } catch (error) {
        console.error('Error fetching schools:', error)
        return []
    }
}

export default async function SchoolsPage() {
    const schools = await getSchools()

    return (
        <div className="flex h-screen">
            <Navigation />

            <main className="flex-1 lg:ml-0">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Schools</h1>
                            <p className="mt-2 text-gray-600">
                                Manage school information and hierarchy
                            </p>
                        </div>
                        <Link
                            href="/schools/new"
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Add School
                        </Link>
                    </div>

                    {/* Schools List */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {schools.map((school) => (
                            <div key={school.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="p-3 bg-green-100 rounded-lg">
                                            <GraduationCap className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-lg font-semibold text-gray-900">{school.name}</h3>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Building2 className="h-4 w-4 mr-1" />
                                                {school.university.name}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Link
                                            href={`/schools/${school.id}/edit`}
                                            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                        <Link
                                            href={`/schools/${school.id}/delete`}
                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>

                                {school.description && (
                                    <p className="text-gray-600 text-sm mb-4">{school.description}</p>
                                )}

                                {school.dean && (
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-700">Dean:</p>
                                        <p className="text-sm text-gray-600">{school.dean}</p>
                                    </div>
                                )}

                                {/* Contact Info */}
                                <div className="space-y-2 mb-4">
                                    {school.address && (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            {school.address}
                                        </div>
                                    )}
                                    {school.phone && (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Phone className="h-4 w-4 mr-2" />
                                            {school.phone}
                                        </div>
                                    )}
                                    {school.email && (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Mail className="h-4 w-4 mr-2" />
                                            {school.email}
                                        </div>
                                    )}
                                </div>

                                {/* Hierarchy Stats */}
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="grid grid-cols-2 gap-4 text-center">
                                        <div>
                                            <p className="text-lg font-semibold text-gray-900">{school.faculties.length}</p>
                                            <p className="text-xs text-gray-500">Faculties</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {school.faculties.reduce((acc, faculty) => acc + faculty.majors.length, 0)}
                                            </p>
                                            <p className="text-xs text-gray-500">Majors</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {schools.length === 0 && (
                        <div className="text-center py-12">
                            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No schools found</h3>
                            <p className="text-gray-500 mb-6">Get started by adding your first school.</p>
                            <Link
                                href="/schools/new"
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Add School
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

