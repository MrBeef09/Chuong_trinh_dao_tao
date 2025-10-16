'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Building2,
    GraduationCap,
    Users,
    BookOpen,
    Home,
    Menu,
    X,
    BookText,
    Calendar,
    Layers,
    FileText
} from 'lucide-react'
import { useState } from 'react'

const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Universities', href: '/universities', icon: Building2 },
    { name: 'Schools', href: '/schools', icon: GraduationCap },
    { name: 'Faculties', href: '/faculties', icon: Users },
    { name: 'Majors', href: '/majors', icon: BookOpen },
    { name: 'Knowledge Blocks', href: '/knowledge-blocks', icon: Layers },
    { name: 'Curricula', href: '/curricula', icon: FileText },
    { name: 'Courses', href: '/courses', icon: Calendar },
    { name: 'Subjects', href: '/subjects', icon: BookText },
    { name: 'Lecturers', href: '/lecturers', icon: Users },
]

export default function Navigation() {
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <>
            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    type="button"
                    className="bg-white p-2 rounded-md shadow-md"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-white to-gray-50 shadow-xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:static lg:inset-0`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center px-6 py-4 border-b border-gray-200">
                        <Building2 className="h-8 w-8 text-blue-600" />
                        <div className="ml-3">
                            <h1 className="text-xl font-bold text-gray-900">Phenikaa UMS</h1>
                            <p className="text-sm text-gray-500">Management System</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="px-4 py-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                            © 2024 Phenikaa University
                        </p>
                    </div>
                </div>
            </div>

            {/* Mobile overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
        </>
    )
}
