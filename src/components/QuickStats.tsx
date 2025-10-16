'use client'

import { Building2, GraduationCap, Users, BookOpen, TrendingUp, Activity, BookText, Layers, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface QuickStatsProps {
    universities: any[]
    schools: any[]
    faculties: any[]
    majors: any[]
    courses: any[]
    lecturers: any[]
    knowledgeBlocks: any[]
    subjects: any[]
}

export default function QuickStats({ universities, schools, faculties, majors, courses, lecturers, knowledgeBlocks, subjects }: QuickStatsProps) {
    const stats = [
        {
            name: 'Universities',
            value: universities.length,
            icon: Building2,
            href: '/universities',
            gradient: 'from-blue-500 to-blue-600',
            bgGradient: 'from-blue-50 to-blue-100',
            textColor: 'text-blue-700',
            borderColor: 'border-blue-200',
            hoverGradient: 'hover:from-blue-600 hover:to-blue-700',
            change: '+1' // This could be calculated from historical data
        },
        {
            name: 'Schools',
            value: schools.length,
            icon: GraduationCap,
            href: '/schools',
            gradient: 'from-emerald-500 to-emerald-600',
            bgGradient: 'from-emerald-50 to-emerald-100',
            textColor: 'text-emerald-700',
            borderColor: 'border-emerald-200',
            hoverGradient: 'hover:from-emerald-600 hover:to-emerald-700',
            change: `+${schools.length}`
        },
        {
            name: 'Faculties',
            value: faculties.length,
            icon: Users,
            href: '/faculties',
            gradient: 'from-purple-500 to-purple-600',
            bgGradient: 'from-purple-50 to-purple-100',
            textColor: 'text-purple-700',
            borderColor: 'border-purple-200',
            hoverGradient: 'hover:from-purple-600 hover:to-purple-700',
            change: `+${faculties.length}`
        },
        {
            name: 'Majors',
            value: majors.length,
            icon: BookOpen,
            href: '/majors',
            gradient: 'from-amber-500 to-amber-600',
            bgGradient: 'from-amber-50 to-amber-100',
            textColor: 'text-amber-700',
            borderColor: 'border-amber-200',
            hoverGradient: 'hover:from-amber-600 hover:to-amber-700',
            change: `+${majors.length}`
        },
        {
            name: 'Courses',
            value: courses.length,
            icon: BookText,
            href: '/courses',
            gradient: 'from-indigo-500 to-indigo-600',
            bgGradient: 'from-indigo-50 to-indigo-100',
            textColor: 'text-indigo-700',
            borderColor: 'border-indigo-200',
            hoverGradient: 'hover:from-indigo-600 hover:to-indigo-700',
            change: `+${courses.length}`
        },
        {
            name: 'Knowledge Blocks',
            value: knowledgeBlocks.length,
            icon: Layers,
            href: '/knowledge-blocks',
            gradient: 'from-cyan-500 to-cyan-600',
            bgGradient: 'from-cyan-50 to-cyan-100',
            textColor: 'text-cyan-700',
            borderColor: 'border-cyan-200',
            hoverGradient: 'hover:from-cyan-600 hover:to-cyan-700',
            change: `+${knowledgeBlocks.length}`
        },
        {
            name: 'Lecturers',
            value: lecturers.length,
            icon: Users,
            href: '/lecturers',
            gradient: 'from-slate-500 to-slate-600',
            bgGradient: 'from-slate-50 to-slate-100',
            textColor: 'text-slate-700',
            borderColor: 'border-slate-200',
            hoverGradient: 'hover:from-slate-600 hover:to-slate-700',
            change: `+${lecturers.length}`
        },
        {
            name: 'Subjects',
            value: subjects.length,
            icon: BookOpen,
            href: '/subjects',
            gradient: 'from-rose-500 to-rose-600',
            bgGradient: 'from-rose-50 to-rose-100',
            textColor: 'text-rose-700',
            borderColor: 'border-rose-200',
            hoverGradient: 'hover:from-rose-600 hover:to-rose-700',
            change: `+${subjects.length}`
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-6 mb-8">
            {stats.map((stat) => (
                <Link
                    key={stat.name}
                    href={stat.href}
                    className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105"
                >
                    {/* Gradient background decoration */}
                    <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${stat.bgGradient} rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>

                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%]"></div>

                    <div className="relative z-10">
                        {/* Icon and main content */}
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300 ${stat.hoverGradient}`}>
                                <stat.icon className="h-8 w-8 text-white" />
                            </div>

                            {/* Arrow indicator */}
                            <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                <ArrowRight className={`h-5 w-5 ${stat.textColor}`} />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                            <h3 className={`text-lg font-bold text-gray-900 group-hover:${stat.textColor} transition-colors duration-300`}>
                                {stat.value.toLocaleString()}
                            </h3>
                            <p className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                                {stat.name}
                            </p>
                        </div>

                        {/* Bottom section with trend */}
                        <div className="mt-4 flex items-center justify-between">
                            <div className={`flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${stat.bgGradient} ${stat.textColor} border ${stat.borderColor}`}>
                                <TrendingUp className="h-3 w-3 mr-1" />
                                {stat.change}
                            </div>

                            {/* View details indicator */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="flex items-center text-xs text-gray-500">
                                    <Activity className="h-3 w-3 mr-1" />
                                    <span>View</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Border gradient on hover */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                </Link>
            ))}
        </div>
    )
}

