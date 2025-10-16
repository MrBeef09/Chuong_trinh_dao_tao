'use client'

import { useState } from 'react'
import QuickStats from './QuickStats'
import DashboardStats from './DashboardStats'
import HierarchyTree from './HierarchyTree'

interface DashboardClientProps {
    universities: any[]
    schools: any[]
    faculties: any[]
    majors: any[]
    courses: any[]
    lecturers: any[]
    knowledgeBlocks: any[]
    subjects: any[]
}

export default function DashboardClient({ universities, schools, faculties, majors, courses, lecturers, knowledgeBlocks, subjects }: DashboardClientProps) {
    return (
        <>
            {/* Quick Stats */}
            <QuickStats
                universities={universities}
                schools={schools}
                faculties={faculties}
                majors={majors}
                courses={courses}
                lecturers={lecturers}
                knowledgeBlocks={knowledgeBlocks}
                subjects={subjects}
            />

            {/* Charts and Analytics */}
            <DashboardStats
                universities={universities}
                schools={schools}
                faculties={faculties}
                majors={majors}
                courses={courses}
                lecturers={lecturers}
                knowledgeBlocks={knowledgeBlocks}
                subjects={subjects}
            />

            {/* Hierarchical Tree View */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">University Hierarchy</h2>
                        <p className="text-sm text-gray-500">Click to expand and view organizational structure</p>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Interactive Tree
                    </div>
                </div>
                <HierarchyTree universities={universities} />
            </div>
        </>
    )
}

