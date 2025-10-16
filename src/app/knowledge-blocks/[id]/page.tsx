import Navigation from '@/components/Navigation'
import { prisma } from '@/lib/prisma'
import { ArrowLeft, Edit, Trash2, BookOpen, Clock, Users, GraduationCap } from 'lucide-react'
import Link from 'next/link'

async function getKnowledgeBlock(id: string) {
    try {
        const knowledgeBlock = await prisma.knowledgeBlock.findUnique({
            where: { id },
            include: {
                major: {
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
                    }
                },
                subjects: {
                    include: {
                        lecturers: {
                            include: {
                                lecturer: true
                            }
                        }
                    },
                    orderBy: {
                        code: 'asc'
                    }
                }
            }
        })

        return knowledgeBlock
    } catch (error) {
        console.error('Error fetching knowledge block:', error)
        return null
    }
}

export default async function KnowledgeBlockDetailPage({
    params
}: {
    params: { id: string }
}) {
    const knowledgeBlock = await getKnowledgeBlock(params.id)

    if (!knowledgeBlock) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Navigation />
                <main className="flex-1 lg:ml-0 overflow-y-auto">
                    <div className="p-8">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Knowledge Block Not Found</h1>
                            <p className="text-gray-600 mb-4">The knowledge block you're looking for doesn't exist.</p>
                            <Link
                                href="/knowledge-blocks"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Knowledge Blocks
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    const totalSubjectCredits = knowledgeBlock.subjects.reduce((sum, subject) => sum + subject.credits, 0)

    return (
        <div className="flex h-screen bg-gray-50">
            <Navigation />

            <main className="flex-1 lg:ml-0 overflow-y-auto">
                <div className="p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-4 mb-4">
                            <Link
                                href="/knowledge-blocks"
                                className="flex items-center text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                Back to Knowledge Blocks
                            </Link>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">{knowledgeBlock.name}</h1>
                                <p className="text-lg text-gray-600">
                                    Knowledge Block Details - {knowledgeBlock.major.faculty.school.university.name}
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Link
                                    href={`/knowledge-blocks/${knowledgeBlock.id}/edit`}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Link>
                                <Link
                                    href={`/knowledge-blocks/${knowledgeBlock.id}/delete`}
                                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <BookOpen className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Credits</p>
                                    <p className="text-2xl font-bold text-gray-900">{knowledgeBlock.credits}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <GraduationCap className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Subjects</p>
                                    <p className="text-2xl font-bold text-gray-900">{knowledgeBlock.subjects.length}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <BookOpen className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Subject Credits</p>
                                    <p className="text-2xl font-bold text-gray-900">{totalSubjectCredits}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <Clock className="h-6 w-6 text-orange-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Status</p>
                                    <p className="text-2xl font-bold text-gray-900">{knowledgeBlock.status}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Knowledge Block Information */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Knowledge Block Information</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Code</label>
                                        <p className="text-sm text-gray-900">{knowledgeBlock.code}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                                        <p className="text-sm text-gray-900">{knowledgeBlock.name}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Major</label>
                                        <p className="text-sm text-gray-900">
                                            {knowledgeBlock.major.name} ({knowledgeBlock.major.code})
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Faculty</label>
                                        <p className="text-sm text-gray-900">{knowledgeBlock.major.faculty.name}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">School</label>
                                        <p className="text-sm text-gray-900">{knowledgeBlock.major.faculty.school.name}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">University</label>
                                        <p className="text-sm text-gray-900">{knowledgeBlock.major.faculty.school.university.name}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Display Order</label>
                                        <p className="text-sm text-gray-900">{knowledgeBlock.order}</p>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Subjects List */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900">Associated Subjects</h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {knowledgeBlock.subjects.length} subjects in this knowledge block
                                    </p>
                                </div>

                                <div className="p-6">
                                    {knowledgeBlock.subjects.length > 0 ? (
                                        <div className="space-y-4">
                                            {knowledgeBlock.subjects.map((subject) => (
                                                <div key={subject.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-3 mb-2">
                                                                <h3 className="text-sm font-medium text-gray-900">{subject.name}</h3>
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                                    {subject.code}
                                                                </span>
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                                    {subject.credits} credits
                                                                </span>
                                                            </div>

                                                            {subject.description && (
                                                                <p className="text-sm text-gray-600 mb-2">{subject.description}</p>
                                                            )}

                                                            {subject.semester && (
                                                                <p className="text-xs text-gray-500">Semester: {subject.semester}</p>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center space-x-2">
                                                            <Link
                                                                href={`/subjects/${subject.id}`}
                                                                className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                                                            >
                                                                View Details
                                                            </Link>
                                                        </div>
                                                    </div>

                                                    {subject.lecturers.length > 0 && (
                                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                                            <p className="text-xs text-gray-500 mb-2">Lecturers:</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {subject.lecturers.map((lecturerSubject) => (
                                                                    <span
                                                                        key={lecturerSubject.id}
                                                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                                                                    >
                                                                        {lecturerSubject.lecturer.fullName}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No subjects</h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                No subjects are currently assigned to this knowledge block.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

