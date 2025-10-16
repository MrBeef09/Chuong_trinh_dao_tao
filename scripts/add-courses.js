const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addSampleCourses() {
    try {
        // First, check if we have any majors
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
            console.log('No majors found. Please add majors first before adding courses.')
            return
        }

        console.log(`Found ${majors.length} majors. Adding sample courses...`)

        // Sample courses data
        const sampleCourses = [
            {
                code: 'CS101',
                name: 'Introduction to Computer Science',
                description: 'Fundamental concepts of computer science including programming basics, algorithms, and data structures.',
                credits: 3,
                hours: 45,
                semester: 'Fall 2024',
                syllabus: 'Week 1-2: Programming Fundamentals\nWeek 3-4: Data Types and Variables\nWeek 5-6: Control Structures\nWeek 7-8: Functions and Arrays\nWeek 9-10: Object-Oriented Programming\nWeek 11-12: Algorithms and Data Structures\nWeek 13-14: Problem Solving\nWeek 15: Final Project',
                prerequisites: 'Basic mathematics knowledge',
                objectives: '1. Understand fundamental programming concepts\n2. Learn problem-solving techniques\n3. Master basic data structures\n4. Develop algorithmic thinking',
                status: 'Active'
            },
            {
                code: 'MATH201',
                name: 'Calculus I',
                description: 'Introduction to differential and integral calculus with applications.',
                credits: 4,
                hours: 60,
                semester: 'Fall 2024',
                syllabus: 'Week 1-2: Limits and Continuity\nWeek 3-4: Derivatives\nWeek 5-6: Applications of Derivatives\nWeek 7-8: Integration\nWeek 9-10: Applications of Integration\nWeek 11-12: Transcendental Functions\nWeek 13-14: Review\nWeek 15: Final Exam',
                prerequisites: 'Pre-calculus or equivalent',
                objectives: '1. Master differential calculus\n2. Understand integral calculus\n3. Apply calculus to real-world problems\n4. Develop mathematical reasoning',
                status: 'Active'
            },
            {
                code: 'ENG101',
                name: 'English Composition',
                description: 'Development of writing skills through various types of essays and research papers.',
                credits: 3,
                hours: 45,
                semester: 'Fall 2024',
                syllabus: 'Week 1-2: Grammar and Mechanics Review\nWeek 3-4: Essay Structure\nWeek 5-6: Argumentative Writing\nWeek 7-8: Research Methods\nWeek 9-10: Academic Writing\nWeek 11-12: Creative Writing\nWeek 13-14: Portfolio Review\nWeek 15: Final Presentation',
                prerequisites: 'High school English',
                objectives: '1. Improve writing clarity and coherence\n2. Develop research skills\n3. Master different writing styles\n4. Enhance critical thinking through writing',
                status: 'Active'
            }
        ]

        // Add courses for each major
        for (const major of majors) {
            console.log(`Adding courses for major: ${major.name}`)

            for (const courseData of sampleCourses) {
                try {
                    const course = await prisma.course.create({
                        data: {
                            ...courseData,
                            majorId: major.id
                        }
                    })
                    console.log(`✓ Created course: ${course.code} - ${course.name}`)
                } catch (error) {
                    if (error.code === 'P2002') {
                        console.log(`- Course ${courseData.code} already exists, skipping...`)
                    } else {
                        console.error(`Error creating course ${courseData.code}:`, error.message)
                    }
                }
            }
        }

        // Get total count
        const totalCourses = await prisma.course.count()
        console.log(`\nTotal courses in database: ${totalCourses}`)

    } catch (error) {
        console.error('Error adding courses:', error)
    } finally {
        await prisma.$disconnect()
    }
}

addSampleCourses()

