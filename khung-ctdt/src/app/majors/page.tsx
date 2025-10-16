import Navigation from '@/components/Navigation'
import { prisma } from '@/lib/prisma'
import { BookOpen, Plus, Edit, Trash2, Users, GraduationCap, Building2, Award } from 'lucide-react'
import Link from 'next/link'

async function getMajors() {
    try {
        return await prisma.major.findMany({
            include: {
                faculty: {
                    include: {
                        school: {
                            include: {
                                university: true
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
        console.error('Error fetching majors:', error)
        return []
    }
}

export default async function MajorsPage() {
    const majors = await getMajors()

    return (
        <div className="flex h-screen">
            <Navigation />

            <main className="flex-1 lg:ml-0">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Majors</h1>
                            <p className="mt-2 text-gray-600">
                                Manage major information and academic programs
                            </p>
                        </div>
                        <Link
                            href="/majors/new"
                            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Add Major
                        </Link>
                    </div>

                    {/* Majors List */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {majors.map((major) => (
                            <div key={major.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="p-3 bg-orange-100 rounded-lg">
                                            <BookOpen className="h-6 w-6 text-orange-600" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-lg font-semibold text-gray-900">{major.name}</h3>
                                            <p className="text-sm font-mono text-gray-500">{major.code}</p>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Users className="h-4 w-4 mr-1" />
                                                {major.faculty.name}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <GraduationCap className="h-4 w-4 mr-1" />
                                                {major.faculty.school.name}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Building2 className="h-4 w-4 mr-1" />
                                                {major.faculty.school.university.name}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Link
                                            href={`/majors/${major.id}/edit`}
                                            className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                        <Link
                                            href={`/majors/${major.id}/delete`}
                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>

                                {major.description && (
                                    <p className="text-gray-600 text-sm mb-4">{major.description}</p>
                                )}

                                {/* Major Details */}
                                <div className="space-y-2 mb-4">
                                    {major.level && (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Award className="h-4 w-4 mr-2" />
                                            {major.level}
                                        </div>
                                    )}
                                    {major.duration && (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <BookOpen className="h-4 w-4 mr-2" />
                                            {major.duration} years
                                        </div>
                                    )}
                                    {major.credits && (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Award className="h-4 w-4 mr-2" />
                                            {major.credits} credits
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {majors.length === 0 && (
                        <div className="text-center py-12">
                            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No majors found</h3>
                            <p className="text-gray-500 mb-6">Get started by adding your first major.</p>
                            <Link
                                href="/majors/new"
                                className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Add Major
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}









