import Navigation from '@/components/Navigation'
import { prisma } from '@/lib/prisma'
import { Building2, Plus, Edit, Trash2, Phone, Mail, Globe, MapPin } from 'lucide-react'
import Link from 'next/link'

async function getUniversities() {
    try {
        return await prisma.university.findMany({
            include: {
                schools: {
                    include: {
                        faculties: {
                            include: {
                                majors: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    } catch (error) {
        console.error('Error fetching universities:', error)
        return []
    }
}

export default async function UniversitiesPage() {
    const universities = await getUniversities()

    return (
        <div className="flex h-screen">
            <Navigation />

            <main className="flex-1 lg:ml-0">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Universities</h1>
                            <p className="mt-2 text-gray-600">
                                Manage university information and hierarchy
                            </p>
                        </div>
                        <Link
                            href="/universities/new"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Add University
                        </Link>
                    </div>

                    {/* Universities List */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {universities.map((university) => (
                            <div key={university.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="p-3 bg-blue-100 rounded-lg">
                                            <Building2 className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-lg font-semibold text-gray-900">{university.name}</h3>
                                            {university.established && (
                                                <p className="text-sm text-gray-500">
                                                    Established {new Date(university.established).getFullYear()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Link
                                            href={`/universities/${university.id}/edit`}
                                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                        <Link
                                            href={`/universities/${university.id}/delete`}
                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>

                                {university.description && (
                                    <p className="text-gray-600 text-sm mb-4">{university.description}</p>
                                )}

                                {/* Contact Info */}
                                <div className="space-y-2 mb-4">
                                    {university.address && (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            {university.address}
                                        </div>
                                    )}
                                    {university.phone && (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Phone className="h-4 w-4 mr-2" />
                                            {university.phone}
                                        </div>
                                    )}
                                    {university.email && (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Mail className="h-4 w-4 mr-2" />
                                            {university.email}
                                        </div>
                                    )}
                                    {university.website && (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Globe className="h-4 w-4 mr-2" />
                                            <a href={university.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                                                {university.website}
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Hierarchy Stats */}
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <p className="text-lg font-semibold text-gray-900">{university.schools.length}</p>
                                            <p className="text-xs text-gray-500">Schools</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {university.schools.reduce((acc, school) => acc + school.faculties.length, 0)}
                                            </p>
                                            <p className="text-xs text-gray-500">Faculties</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {university.schools.reduce((acc, school) =>
                                                    acc + school.faculties.reduce((facAcc, faculty) => facAcc + faculty.majors.length, 0), 0
                                                )}
                                            </p>
                                            <p className="text-xs text-gray-500">Majors</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {universities.length === 0 && (
                        <div className="text-center py-12">
                            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No universities found</h3>
                            <p className="text-gray-500 mb-6">Get started by adding your first university.</p>
                            <Link
                                href="/universities/new"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Add University
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

