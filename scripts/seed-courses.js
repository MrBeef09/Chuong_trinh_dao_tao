const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedCourses() {
    try {
        console.log('🌱 Starting to seed course data...\n')

        // Lấy danh sách majors để tạo khóa học
        const majors = await prisma.major.findMany({
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
        })

        if (majors.length === 0) {
            console.log('❌ No majors found. Please run the main seed script first.')
            return
        }

        console.log(`Found ${majors.length} majors to create courses for\n`)

        // Tạo khóa học mẫu
        const courses = await Promise.all([
            // Khóa học Kỹ thuật phần mềm K17
            prisma.course.create({
                data: {
                    code: 'DH_K17.40',
                    name: 'Khóa học Kỹ thuật phần mềm K17',
                    academicYear: '2023-2027',
                    educationLevel: 'Đại học chính quy',
                    program: 'Kỹ thuật phần mềm',
                    status: 'Đang đào tạo',
                    description: 'Áp dụng CTĐT 2023, dành cho sinh viên K17',
                    startDate: new Date('2023-09-01'),
                    endDate: new Date('2027-06-30'),
                    studentCount: 45,
                    majorId: majors.find(m => m.name === 'Software Engineering')?.id || majors[0].id
                }
            }),
            // Khóa học Khoa học máy tính K18
            prisma.course.create({
                data: {
                    code: 'DH_K18.41',
                    name: 'Khóa học Khoa học máy tính K18',
                    academicYear: '2024-2028',
                    educationLevel: 'Đại học chính quy',
                    program: 'Khoa học máy tính',
                    status: 'Đang đào tạo',
                    description: 'Áp dụng CTĐT 2024, dành cho sinh viên K18',
                    startDate: new Date('2024-09-01'),
                    endDate: new Date('2028-06-30'),
                    studentCount: 38,
                    majorId: majors.find(m => m.name === 'Computer Science')?.id || majors[0].id
                }
            }),
            // Khóa học Hệ thống thông tin K16
            prisma.course.create({
                data: {
                    code: 'DH_K16.39',
                    name: 'Khóa học Hệ thống thông tin K16',
                    academicYear: '2022-2026',
                    educationLevel: 'Đại học chính quy',
                    program: 'Hệ thống thông tin',
                    status: 'Đang đào tạo',
                    description: 'Áp dụng CTĐT 2022, dành cho sinh viên K16',
                    startDate: new Date('2022-09-01'),
                    endDate: new Date('2026-06-30'),
                    studentCount: 42,
                    majorId: majors.find(m => m.name === 'Information Systems')?.id || majors[0].id
                }
            }),
            // Khóa học Khoa học dữ liệu K17
            prisma.course.create({
                data: {
                    code: 'DH_K17.42',
                    name: 'Khóa học Khoa học dữ liệu K17',
                    academicYear: '2023-2027',
                    educationLevel: 'Đại học chính quy',
                    program: 'Khoa học dữ liệu',
                    status: 'Đang đào tạo',
                    description: 'Áp dụng CTĐT 2023, dành cho sinh viên K17',
                    startDate: new Date('2023-09-01'),
                    endDate: new Date('2027-06-30'),
                    studentCount: 35,
                    majorId: majors.find(m => m.name === 'Data Science')?.id || majors[0].id
                }
            }),
            // Khóa học Cơ khí K16
            prisma.course.create({
                data: {
                    code: 'DH_K16.38',
                    name: 'Khóa học Cơ khí K16',
                    academicYear: '2022-2026',
                    educationLevel: 'Đại học chính quy',
                    program: 'Cơ khí',
                    status: 'Đang đào tạo',
                    description: 'Áp dụng CTĐT 2022, dành cho sinh viên K16',
                    startDate: new Date('2022-09-01'),
                    endDate: new Date('2026-06-30'),
                    studentCount: 50,
                    majorId: majors.find(m => m.name === 'Mechanical Engineering')?.id || majors[0].id
                }
            }),
            // Khóa học Điện tử K17
            prisma.course.create({
                data: {
                    code: 'DH_K17.43',
                    name: 'Khóa học Điện tử K17',
                    academicYear: '2023-2027',
                    educationLevel: 'Đại học chính quy',
                    program: 'Điện tử',
                    status: 'Đang đào tạo',
                    description: 'Áp dụng CTĐT 2023, dành cho sinh viên K17',
                    startDate: new Date('2023-09-01'),
                    endDate: new Date('2027-06-30'),
                    studentCount: 40,
                    majorId: majors.find(m => m.name === 'Electrical Engineering')?.id || majors[0].id
                }
            }),
            // Khóa học đã tốt nghiệp
            prisma.course.create({
                data: {
                    code: 'DH_K15.37',
                    name: 'Khóa học Kỹ thuật phần mềm K15',
                    academicYear: '2021-2025',
                    educationLevel: 'Đại học chính quy',
                    program: 'Kỹ thuật phần mềm',
                    status: 'Đã tốt nghiệp',
                    description: 'Áp dụng CTĐT 2021, dành cho sinh viên K15',
                    startDate: new Date('2021-09-01'),
                    endDate: new Date('2025-06-30'),
                    studentCount: 48,
                    majorId: majors.find(m => m.name === 'Software Engineering')?.id || majors[0].id
                }
            }),
            // Khóa học tại chức
            prisma.course.create({
                data: {
                    code: 'DH_K17.TC.44',
                    name: 'Khóa học Kỹ thuật phần mềm K17 (Tại chức)',
                    academicYear: '2023-2027',
                    educationLevel: 'Đại học tại chức',
                    program: 'Kỹ thuật phần mềm',
                    status: 'Đang đào tạo',
                    description: 'Áp dụng CTĐT 2023, dành cho sinh viên K17 hệ tại chức',
                    startDate: new Date('2023-09-01'),
                    endDate: new Date('2027-06-30'),
                    studentCount: 25,
                    majorId: majors.find(m => m.name === 'Software Engineering')?.id || majors[0].id
                }
            })
        ])

        console.log(`✓ Created ${courses.length} courses\n`)

        // Summary
        const summary = await prisma.$queryRaw`
            SELECT 
                (SELECT COUNT(*) FROM courses) as courses,
                (SELECT COUNT(*) FROM courses WHERE status = 'Đang đào tạo') as active_courses,
                (SELECT COUNT(*) FROM courses WHERE status = 'Đã tốt nghiệp') as graduated_courses,
                (SELECT SUM(studentCount) FROM courses) as total_students
        `

        console.log('🎉 Course seeding completed successfully!')
        console.log('📊 Summary:')
        console.log(`   Total courses: ${summary[0].courses}`)
        console.log(`   Active courses: ${summary[0].active_courses}`)
        console.log(`   Graduated courses: ${summary[0].graduated_courses}`)
        console.log(`   Total students: ${summary[0].total_students}`)
        console.log('\n✅ You can now use the course management functionality!')

    } catch (error) {
        console.error('❌ Error seeding courses:', error)
    } finally {
        await prisma.$disconnect()
    }
}

// Run if called directly
if (require.main === module) {
    seedCourses()
}

module.exports = { seedCourses }

