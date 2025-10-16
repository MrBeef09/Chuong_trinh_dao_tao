'use client'

import { useState } from 'react'
import {
    Building2,
    GraduationCap,
    Users,
    BookOpen,
    ChevronRight,
    ChevronDown,
    Plus,
    Edit,
    Trash2
} from 'lucide-react'
import Link from 'next/link'

interface University {
    id: string
    name: string
    description?: string
    schools: School[]
}

interface School {
    id: string
    name: string
    description?: string
    dean?: string
    universityId: string
    faculties: Faculty[]
}

interface Faculty {
    id: string
    name: string
    description?: string
    head?: string
    schoolId: string
    majors: Major[]
}

interface Major {
    id: string
    name: string
    code: string
    description?: string
    level?: string
    facultyId: string
}

interface HierarchyTreeProps {
    universities: University[]
}

export default function HierarchyTree({ universities }: HierarchyTreeProps) {
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

    const toggleExpanded = (id: string) => {
        const newExpanded = new Set(expandedItems)
        if (newExpanded.has(id)) {
            newExpanded.delete(id)
        } else {
            newExpanded.add(id)
        }
        setExpandedItems(newExpanded)
    }

    const renderMajor = (major: Major, level: number) => (
        <div key={major.id} className="ml-12 flex items-center py-2 px-3 hover:bg-gray-50 rounded-lg group">
            <div className="flex items-center flex-1">
                <div className="w-4 h-4 mr-3"></div>
                <BookOpen className="h-4 w-4 text-orange-500 mr-3" />
                <div className="flex-1">
                    <div className="flex items-center">
                        <span className="font-medium text-gray-900">{major.name}</span>
                        <span className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full font-mono">
                            {major.code}
                        </span>
                        {major.level && (
                            <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                {major.level}
                            </span>
                        )}
                    </div>
                    {major.description && (
                        <p className="text-sm text-gray-500 mt-1">{major.description}</p>
                    )}
                </div>
            </div>
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link
                    href={`/majors/${major.id}/edit`}
                    className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
                >
                    <Edit className="h-3 w-3" />
                </Link>
                <Link
                    href={`/majors/${major.id}/delete`}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                    <Trash2 className="h-3 w-3" />
                </Link>
            </div>
        </div>
    )

    const renderFaculty = (faculty: Faculty, level: number) => {
        const isExpanded = expandedItems.has(faculty.id)
        const hasChildren = faculty.majors.length > 0

        return (
            <div key={faculty.id}>
                <div className="ml-8 flex items-center py-2 px-3 hover:bg-gray-50 rounded-lg group">
                    <div className="flex items-center flex-1">
                        <button
                            onClick={() => toggleExpanded(faculty.id)}
                            className="mr-2 p-1 hover:bg-gray-200 rounded transition-colors"
                            disabled={!hasChildren}
                        >
                            {hasChildren ? (
                                isExpanded ? (
                                    <ChevronDown className="h-4 w-4 text-gray-500" />
                                ) : (
                                    <ChevronRight className="h-4 w-4 text-gray-500" />
                                )
                            ) : (
                                <div className="w-4 h-4"></div>
                            )}
                        </button>
                        <Users className="h-5 w-5 text-purple-500 mr-3" />
                        <div className="flex-1">
                            <div className="flex items-center">
                                <span className="font-medium text-gray-900">{faculty.name}</span>
                                <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                                    {faculty.majors.length} majors
                                </span>
                            </div>
                            {faculty.head && (
                                <p className="text-sm text-gray-500 mt-1">Head: {faculty.head}</p>
                            )}
                            {faculty.description && (
                                <p className="text-sm text-gray-500">{faculty.description}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                            href={`/faculties/new?schoolId=${faculty.schoolId}`}
                            className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                            title="Add Major"
                        >
                            <Plus className="h-3 w-3" />
                        </Link>
                        <Link
                            href={`/faculties/${faculty.id}/edit`}
                            className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                        >
                            <Edit className="h-3 w-3" />
                        </Link>
                        <Link
                            href={`/faculties/${faculty.id}/delete`}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                            <Trash2 className="h-3 w-3" />
                        </Link>
                    </div>
                </div>
                {isExpanded && hasChildren && (
                    <div className="ml-4 border-l-2 border-gray-200">
                        {faculty.majors.map((major) => renderMajor(major, level + 1))}
                    </div>
                )}
            </div>
        )
    }

    const renderSchool = (school: School, level: number) => {
        const isExpanded = expandedItems.has(school.id)
        const hasChildren = school.faculties.length > 0

        return (
            <div key={school.id}>
                <div className="ml-4 flex items-center py-2 px-3 hover:bg-gray-50 rounded-lg group">
                    <div className="flex items-center flex-1">
                        <button
                            onClick={() => toggleExpanded(school.id)}
                            className="mr-2 p-1 hover:bg-gray-200 rounded transition-colors"
                            disabled={!hasChildren}
                        >
                            {hasChildren ? (
                                isExpanded ? (
                                    <ChevronDown className="h-4 w-4 text-gray-500" />
                                ) : (
                                    <ChevronRight className="h-4 w-4 text-gray-500" />
                                )
                            ) : (
                                <div className="w-4 h-4"></div>
                            )}
                        </button>
                        <GraduationCap className="h-5 w-5 text-green-500 mr-3" />
                        <div className="flex-1">
                            <div className="flex items-center">
                                <span className="font-medium text-gray-900">{school.name}</span>
                                <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                                    {school.faculties.length} faculties
                                </span>
                            </div>
                            {school.dean && (
                                <p className="text-sm text-gray-500 mt-1">Dean: {school.dean}</p>
                            )}
                            {school.description && (
                                <p className="text-sm text-gray-500">{school.description}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                            href={`/schools/new?universityId=${school.universityId}`}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title="Add Faculty"
                        >
                            <Plus className="h-3 w-3" />
                        </Link>
                        <Link
                            href={`/schools/${school.id}/edit`}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        >
                            <Edit className="h-3 w-3" />
                        </Link>
                        <Link
                            href={`/schools/${school.id}/delete`}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                            <Trash2 className="h-3 w-3" />
                        </Link>
                    </div>
                </div>
                {isExpanded && hasChildren && (
                    <div className="ml-4 border-l-2 border-gray-200">
                        {school.faculties.map((faculty) => renderFaculty(faculty, level + 1))}
                    </div>
                )}
            </div>
        )
    }

    const renderUniversity = (university: University) => {
        const isExpanded = expandedItems.has(university.id)
        const hasChildren = university.schools.length > 0

        return (
            <div key={university.id} className="mb-4">
                <div className="flex items-center py-3 px-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-center flex-1">
                        <button
                            onClick={() => toggleExpanded(university.id)}
                            className="mr-3 p-1 hover:bg-gray-200 rounded transition-colors"
                            disabled={!hasChildren}
                        >
                            {hasChildren ? (
                                isExpanded ? (
                                    <ChevronDown className="h-5 w-5 text-gray-600" />
                                ) : (
                                    <ChevronRight className="h-5 w-5 text-gray-600" />
                                )
                            ) : (
                                <div className="w-5 h-5"></div>
                            )}
                        </button>
                        <Building2 className="h-6 w-6 text-blue-500 mr-4" />
                        <div className="flex-1">
                            <div className="flex items-center">
                                <h3 className="text-lg font-semibold text-gray-900">{university.name}</h3>
                                <span className="ml-3 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                                    {university.schools.length} schools
                                </span>
                            </div>
                            {university.description && (
                                <p className="text-gray-600 mt-1">{university.description}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                            href="/universities/new"
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Add School"
                        >
                            <Plus className="h-4 w-4" />
                        </Link>
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
                {isExpanded && hasChildren && (
                    <div className="mt-2 ml-4 space-y-1">
                        {university.schools.map((school) => renderSchool(school, 0))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-2">
            {universities.map((university) => renderUniversity(university))}

            {universities.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
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
    )
}









