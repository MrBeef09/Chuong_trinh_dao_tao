import Navigation from '@/components/Navigation'
import { prisma } from '@/lib/prisma'
import { Users, Plus, Edit, Trash2, GraduationCap, Building2, Phone, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'

async function getFaculties() {
    try {
        return await prisma.faculty.findMany({
            include: {
                school: {
                    include: {
                        university: true
                    }
                },
                majors: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    } catch (error) {
        console.error('Error fetching faculties:', error)
        return []
    }
}

export default async function FacultiesPage() {
    const faculties = await getFaculties()

    return (
        <div className="flex h-screen">
            <Navigation />

            <main className="flex-1 lg:ml-0">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Faculties</h1>
                            <p className="mt-2 text-gray-600">
                                Manage faculty information and hierarchy
                            </p>
                        </div>
                        <Link
                            href="/faculties/new"
                            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Add Faculty
                        </Link>
                    </div>

                    {/* Faculties List */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {faculties.map((faculty) => (
                            <div key={faculty.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="p-3 bg-purple-100 rounded-lg">
                                            <Users className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-lg font-semibold text-gray-900">{faculty.name}</h3>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <GraduationCap className="h-4 w-4 mr-1" />
                                                {faculty.school.name}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Building2 className="h-4 w-4 mr-1" />
                                                {faculty.school.university.name}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Link
                                            href={`/faculties/${faculty.id}/edit`}
                                            className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                        <Link
                                            href={`/faculties/${faculty.id}/delete`}
                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>

                                {faculty.description && (
                                    <p className="text-gray-600 text-sm mb-4">{faculty.description}</p>
                                )}

                                {faculty.head && (
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-700">Head:</p>
                                        <p className="text-sm text-gray-600">{faculty.head}</p>
                                    </div>
                                )}

                                {/* Contact Info */}
                                <div className="space-y-2 mb-4">
                                    {faculty.office && (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            {faculty.office}
                                        </div>
                                    )}
                                    {faculty.phone && (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Phone className="h-4 w-4 mr-2" />
                                            {faculty.phone}
                                        </div>
                                    )}
                                    {faculty.email && (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Mail className="h-4 w-4 mr-2" />
                                            {faculty.email}
                                        </div>
                                    )}
                                </div>

                                {/* Hierarchy Stats */}
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="text-center">
                                        <p className="text-lg font-semibold text-gray-900">{faculty.majors.length}</p>
                                        <p className="text-xs text-gray-500">Majors</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {faculties.length === 0 && (
                        <div className="text-center py-12">
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No faculties found</h3>
                            <p className="text-gray-500 mb-6">Get started by adding your first faculty.</p>
                            <Link
                                href="/faculties/new"
                                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Add Faculty
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

