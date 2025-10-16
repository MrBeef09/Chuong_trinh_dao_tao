import Navigation from '@/components/Navigation'
import DashboardClient from '@/components/DashboardClient'
import { prisma } from '@/lib/prisma'
import { Building2, GraduationCap, Users, BookOpen, Plus, Activity, TrendingUp, BookText, Layers } from 'lucide-react'
import Link from 'next/link'

async function getDashboardData() {
  try {
    const [universities, schools, faculties, majors, courses, lecturers, knowledgeBlocks, subjects] = await Promise.all([
      prisma.university.findMany({
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
        orderBy: { createdAt: 'desc' }
      }),
      prisma.school.findMany({
        include: {
          university: true,
          faculties: {
            include: {
              majors: true
            }
          }
        }
      }),
      prisma.faculty.findMany({
        include: {
          school: {
            include: {
              university: true
            }
          },
          majors: true,
          lecturers: true
        }
      }),
      prisma.major.findMany({
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
      }),
      prisma.course.findMany({
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
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.lecturer.findMany({
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
        orderBy: { createdAt: 'asc' }
      }),
      prisma.knowledgeBlock.findMany({
        orderBy: { createdAt: 'desc' }
      }),
      prisma.subject.findMany({
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
          lecturers: {
            include: {
              lecturer: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    ])

    return { universities, schools, faculties, majors, courses, lecturers, knowledgeBlocks, subjects }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return { universities: [], schools: [], faculties: [], majors: [], courses: [], lecturers: [], knowledgeBlocks: [], subjects: [] }
  }
}

export default async function Home() {
  const { universities, schools, faculties, majors, courses, lecturers, knowledgeBlocks, subjects } = await getDashboardData()

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation />

      <main className="flex-1 lg:ml-0 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="space-y-2">
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Dashboard
                  </h1>
                  <p className="text-xl text-blue-100 font-medium">
                    Welcome to Phenikaa University Management System
                  </p>
                  <div className="flex items-center space-x-4 mt-4">
                    <div className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                      <Activity className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">System Active</span>
                    </div>
                    <div className="text-sm text-blue-200">
                      Last updated: {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Building2 className="h-12 w-12 text-white/80" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Components */}
          <DashboardClient
            universities={universities}
            schools={schools}
            faculties={faculties}
            majors={majors}
            courses={courses}
            lecturers={lecturers}
            knowledgeBlocks={knowledgeBlocks}
            subjects={subjects}
          />

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Actions</h2>
                <p className="text-gray-600 font-medium">Add new entities to the system</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-6">
              <Link
                href="/universities/new"
                className="group flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl hover:from-blue-100 hover:to-blue-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300 shadow-lg">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <span className="font-bold text-blue-800 text-center group-hover:text-blue-900 transition-colors mb-1">Add University</span>
                <Plus className="h-4 w-4 text-blue-600 group-hover:text-blue-700 transition-colors" />
              </Link>
              <Link
                href="/schools/new"
                className="group flex flex-col items-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 rounded-2xl hover:from-emerald-100 hover:to-emerald-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-4 group-hover:from-emerald-600 group-hover:to-emerald-700 transition-all duration-300 shadow-lg">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <span className="font-bold text-emerald-800 text-center group-hover:text-emerald-900 transition-colors mb-1">Add School</span>
                <Plus className="h-4 w-4 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
              </Link>
              <Link
                href="/faculties/new"
                className="group flex flex-col items-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-2xl hover:from-purple-100 hover:to-purple-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-4 group-hover:from-purple-600 group-hover:to-purple-700 transition-all duration-300 shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <span className="font-bold text-purple-800 text-center group-hover:text-purple-900 transition-colors mb-1">Add Faculty</span>
                <Plus className="h-4 w-4 text-purple-600 group-hover:text-purple-700 transition-colors" />
              </Link>
              <Link
                href="/majors/new"
                className="group flex flex-col items-center p-6 bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-2xl hover:from-amber-100 hover:to-amber-200 hover:border-amber-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl mb-4 group-hover:from-amber-600 group-hover:to-amber-700 transition-all duration-300 shadow-lg">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <span className="font-bold text-amber-800 text-center group-hover:text-amber-900 transition-colors mb-1">Add Major</span>
                <Plus className="h-4 w-4 text-amber-600 group-hover:text-amber-700 transition-colors" />
              </Link>
              <Link
                href="/knowledge-blocks/new"
                className="group flex flex-col items-center p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 border-2 border-cyan-200 rounded-2xl hover:from-cyan-100 hover:to-cyan-200 hover:border-cyan-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-4 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl mb-4 group-hover:from-cyan-600 group-hover:to-cyan-700 transition-all duration-300 shadow-lg">
                  <Layers className="h-8 w-8 text-white" />
                </div>
                <span className="font-bold text-cyan-800 text-center group-hover:text-cyan-900 transition-colors mb-1">Add Knowledge Block</span>
                <Plus className="h-4 w-4 text-cyan-600 group-hover:text-cyan-700 transition-colors" />
              </Link>
              <Link
                href="/courses/new"
                className="group flex flex-col items-center p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-200 rounded-2xl hover:from-indigo-100 hover:to-indigo-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl mb-4 group-hover:from-indigo-600 group-hover:to-indigo-700 transition-all duration-300 shadow-lg">
                  <BookText className="h-8 w-8 text-white" />
                </div>
                <span className="font-bold text-indigo-800 text-center group-hover:text-indigo-900 transition-colors mb-1">Add Course</span>
                <Plus className="h-4 w-4 text-indigo-600 group-hover:text-indigo-700 transition-colors" />
              </Link>
              <Link
                href="/subjects/new"
                className="group flex flex-col items-center p-6 bg-gradient-to-br from-rose-50 to-rose-100 border-2 border-rose-200 rounded-2xl hover:from-rose-100 hover:to-rose-200 hover:border-rose-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-4 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl mb-4 group-hover:from-rose-600 group-hover:to-rose-700 transition-all duration-300 shadow-lg">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <span className="font-bold text-rose-800 text-center group-hover:text-rose-900 transition-colors mb-1">Add Subject</span>
                <Plus className="h-4 w-4 text-rose-600 group-hover:text-rose-700 transition-colors" />
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
