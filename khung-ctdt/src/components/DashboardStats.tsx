'use client'

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Area,
    AreaChart
} from 'recharts'
import { Building2, GraduationCap, Users, BookOpen, TrendingUp, Award, BookText } from 'lucide-react'

interface DashboardStatsProps {
    universities: any[]
    schools: any[]
    faculties: any[]
    majors: any[]
    courses: any[]
    lecturers: any[]
    knowledgeBlocks: any[]
    subjects: any[]
}

const COLORS = {
    university: '#3B82F6', // blue
    school: '#10B981', // green
    faculty: '#8B5CF6', // purple
    major: '#F59E0B', // orange
    course: '#6366F1', // indigo
    lecturer: '#2563EB', // deeper blue
}

const CHART_COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316']

export default function DashboardStats({ universities, schools, faculties, majors, courses, lecturers, knowledgeBlocks, subjects }: DashboardStatsProps) {
    // Calculate statistics
    const totalStats = {
        universities: universities.length,
        schools: schools.length,
        faculties: faculties.length,
        majors: majors.length,
        courses: courses.length,
        lecturers: lecturers.length,
        knowledgeBlocks: knowledgeBlocks.length,
        subjects: subjects.length,
    }

    // Prepare data for charts
    const entityDistribution = [
        { name: 'Universities', value: totalStats.universities, color: COLORS.university },
        { name: 'Schools', value: totalStats.schools, color: COLORS.school },
        { name: 'Faculties', value: totalStats.faculties, color: COLORS.faculty },
        { name: 'Majors', value: totalStats.majors, color: COLORS.major },
        { name: 'Knowledge Blocks', value: totalStats.knowledgeBlocks, color: '#14B8A6' },
        { name: 'Courses', value: totalStats.courses, color: COLORS.course },
        { name: 'Lecturers', value: totalStats.lecturers, color: COLORS.lecturer },
        { name: 'Subjects', value: totalStats.subjects, color: '#EF4444' },
    ]

    // Schools per university data
    const schoolsPerUniversity = universities.map(uni => ({
        name: uni.name.length > 15 ? uni.name.substring(0, 15) + '...' : uni.name,
        schools: uni.schools.length,
        faculties: uni.schools.reduce((acc: number, school: any) => acc + school.faculties.length, 0),
        majors: uni.schools.reduce((acc: number, school: any) =>
            acc + school.faculties.reduce((facAcc: number, faculty: any) => facAcc + faculty.majors.length, 0), 0
        ),
    }))

    // Major level distribution
    const majorLevels = majors.reduce((acc: any, major: any) => {
        const level = major.level || 'Unknown'
        acc[level] = (acc[level] || 0) + 1
        return acc
    }, {})

    const majorLevelData = Object.entries(majorLevels).map(([level, count]) => ({
        level,
        count,
    }))

    // Growth trend data (simulated for demonstration)
    const growthData = [
        { month: 'Jan', universities: 1, schools: 0, faculties: 0, majors: 0 },
        { month: 'Feb', universities: 1, schools: 1, faculties: 0, majors: 0 },
        { month: 'Mar', universities: 1, schools: 2, faculties: 2, majors: 0 },
        { month: 'Apr', universities: 1, schools: 2, faculties: 3, majors: 3 },
        { month: 'May', universities: 1, schools: 2, faculties: 3, majors: 5 },
        { month: 'Jun', universities: 1, schools: 2, faculties: 3, majors: 7 },
    ]

    // Process lecturer data for timeline chart
    const lecturerTimelineData = (() => {
        // Group lecturers by month based on join date
        const lecturersByMonth = lecturers.reduce((acc, lecturer) => {
            if (lecturer.joinDate) {
                const date = new Date(lecturer.joinDate);
                const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

                if (!acc[monthYear]) {
                    acc[monthYear] = {
                        month: monthYear,
                        count: 0,
                        lecturers: []
                    };
                }

                acc[monthYear].count += 1;
                acc[monthYear].lecturers.push(lecturer);
            }
            return acc;
        }, {});

        // Convert to array and sort by date
        return Object.values(lecturersByMonth)
            .sort((a: any, b: any) => a.month.localeCompare(b.month))
            .map((item: any, index: number, array: any[]) => {
                // Calculate cumulative count
                const cumulativeCount = array
                    .slice(0, index + 1)
                    .reduce((sum: number, curr: any) => sum + curr.count, 0);

                return {
                    ...item,
                    cumulativeCount,
                    displayMonth: new Date(item.month + '-01').toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                    })
                };
            });
    })();

    // Calculate lecturer statistics by faculty
    const lecturersByFaculty = faculties.map(faculty => ({
        name: faculty.name.length > 15 ? faculty.name.substring(0, 15) + '...' : faculty.name,
        count: lecturers.filter(l => l.facultyId === faculty.id).length,
        schoolName: faculty.school.name
    })).sort((a, b) => b.count - a.count);

    return (
        <>
            {/* Full-Screen Lecturer Line Graph */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-lg font-semibold text-gray-900">Lecturer Growth Timeline</h3>
                            <p className="text-sm text-gray-500">Cumulative growth of lecturers over time</p>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-700">
                        {totalStats.lecturers} <span className="text-sm font-normal text-gray-500">Total Lecturers</span>
                    </div>
                </div>
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={lecturerTimelineData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="displayMonth" />
                            <YAxis />
                            <Tooltip
                                formatter={(value, name) => [value, name === 'cumulativeCount' ? 'Total Lecturers' : 'New Lecturers']}
                                labelFormatter={(label) => `Period: ${label}`}
                            />
                            <Line
                                type="monotone"
                                dataKey="cumulativeCount"
                                stroke={COLORS.lecturer}
                                strokeWidth={3}
                                dot={{ r: 6, fill: COLORS.lecturer }}
                                activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }}
                                name="Total"
                            />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#94A3B8"
                                strokeDasharray="5 5"
                                dot={{ r: 4, fill: "#94A3B8" }}
                                name="New"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Other Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Entity Distribution Pie Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center mb-6">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Award className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-lg font-semibold text-gray-900">Entity Distribution</h3>
                            <p className="text-sm text-gray-500">Overview of all entities</p>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={entityDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {entityDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Schools and Faculties per University */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center mb-6">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-lg font-semibold text-gray-900">University Structure</h3>
                            <p className="text-sm text-gray-500">Schools, faculties, and majors per university</p>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={schoolsPerUniversity}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="schools" fill={COLORS.school} name="Schools" />
                                <Bar dataKey="faculties" fill={COLORS.faculty} name="Faculties" />
                                <Bar dataKey="majors" fill={COLORS.major} name="Majors" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Lecturers by Faculty */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center mb-6">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-lg font-semibold text-gray-900">Lecturers by Faculty</h3>
                            <p className="text-sm text-gray-500">Distribution of lecturers across faculties</p>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={lecturersByFaculty} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip labelFormatter={(name) => `Faculty: ${name}`} />
                                <Bar dataKey="count" fill={COLORS.lecturer} name="Lecturers" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Major Level Distribution */}
                {majorLevelData.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center mb-6">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <BookOpen className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-lg font-semibold text-gray-900">Academic Levels</h3>
                                <p className="text-sm text-gray-500">Distribution of majors by academic level</p>
                            </div>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={majorLevelData} layout="horizontal">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="level" type="category" width={80} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill={COLORS.major} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>

            {/* Courses by Major Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-indigo-100 rounded-lg">
                            <BookText className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-lg font-semibold text-gray-900">Courses by Major</h3>
                            <p className="text-sm text-gray-500">Distribution of courses across different majors</p>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-indigo-700">
                        {totalStats.courses} <span className="text-sm font-normal text-gray-500">Total Courses</span>
                    </div>
                </div>
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={courses
                                .reduce((acc: any, course) => {
                                    const majorName = course.major.name;
                                    const existingMajor = acc.find((m: any) => m.name === majorName);
                                    if (existingMajor) {
                                        existingMajor.courses++;
                                    } else {
                                        acc.push({
                                            name: majorName.length > 20 ? majorName.substring(0, 20) + '...' : majorName,
                                            courses: 1,
                                            facultyName: course.major.faculty.name
                                        });
                                    }
                                    return acc;
                                }, [])
                                .sort((a: any, b: any) => b.courses - a.courses)
                                .slice(0, 10)
                            }
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={150} />
                            <Tooltip
                                formatter={(value, name) => [value, name === 'courses' ? 'Courses' : name]}
                                labelFormatter={(name) => `Major: ${name}`}
                            />
                            <Bar dataKey="courses" fill={COLORS.course} name="Courses" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Subjects by Major Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-red-100 rounded-lg">
                            <BookOpen className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-lg font-semibold text-gray-900">Subjects by Major</h3>
                            <p className="text-sm text-gray-500">Distribution of subjects across different majors</p>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-red-700">
                        {totalStats.subjects} <span className="text-sm font-normal text-gray-500">Total Subjects</span>
                    </div>
                </div>
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={subjects
                                .reduce((acc: any, subject) => {
                                    const majorName = subject.major.name;
                                    const existingMajor = acc.find((m: any) => m.name === majorName);
                                    if (existingMajor) {
                                        existingMajor.subjects++;
                                    } else {
                                        acc.push({
                                            name: majorName.length > 20 ? majorName.substring(0, 20) + '...' : majorName,
                                            subjects: 1,
                                            facultyName: subject.major.faculty.name
                                        });
                                    }
                                    return acc;
                                }, [])
                                .sort((a: any, b: any) => b.subjects - a.subjects)
                                .slice(0, 10)
                            }
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={150} />
                            <Tooltip
                                formatter={(value, name) => [value, name === 'subjects' ? 'Subjects' : name]}
                                labelFormatter={(name) => `Major: ${name}`}
                            />
                            <Bar dataKey="subjects" fill="#EF4444" name="Subjects" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    )
}

