const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedCompleteData() {
    try {
        console.log('🌱 Starting to seed complete university data...\n')

        // 1. Create University
        console.log('1. Creating University...')
        const university = await prisma.university.upsert({
            where: { name: 'Phenikaa University' },
            update: {},
            create: {
                name: 'Phenikaa University',
                description: 'A leading research university in Vietnam',
                address: 'Yen Nghia, Ha Dong, Hanoi, Vietnam',
                phone: '+84 24 3209 6699',
                email: 'info@phenikaa.edu.vn',
                website: 'https://phenikaa.edu.vn',
                established: new Date('2006-01-01')
            }
        })
        console.log(`✓ Created university: ${university.name}\n`)

        // 2. Create Schools
        console.log('2. Creating Schools...')
        const schools = await Promise.all([
            prisma.school.upsert({
                where: {
                    name_universityId: {
                        name: 'School of Information Technology',
                        universityId: university.id
                    }
                },
                update: {},
                create: {
                    name: 'School of Information Technology',
                    description: 'Leading school in IT education and research',
                    dean: 'Prof. Dr. Nguyen Van A',
                    phone: '+84 24 3209 6700',
                    email: 'it@phenikaa.edu.vn',
                    address: 'Building A1, Phenikaa University',
                    universityId: university.id
                }
            }),
            prisma.school.upsert({
                where: {
                    name_universityId: {
                        name: 'School of Engineering',
                        universityId: university.id
                    }
                },
                update: {},
                create: {
                    name: 'School of Engineering',
                    description: 'Advanced engineering education and research',
                    dean: 'Prof. Dr. Tran Thi B',
                    phone: '+84 24 3209 6701',
                    email: 'engineering@phenikaa.edu.vn',
                    address: 'Building B1, Phenikaa University',
                    universityId: university.id
                }
            })
        ])
        console.log(`✓ Created ${schools.length} schools\n`)

        // 3. Create Faculties
        console.log('3. Creating Faculties...')
        const faculties = await Promise.all([
            // IT School Faculties
            prisma.faculty.upsert({
                where: {
                    name_schoolId: {
                        name: 'Faculty of Computer Science',
                        schoolId: schools[0].id
                    }
                },
                update: {},
                create: {
                    name: 'Faculty of Computer Science',
                    description: 'Computer Science and Software Engineering',
                    head: 'Dr. Le Van C',
                    phone: '+84 24 3209 6702',
                    email: 'cs@phenikaa.edu.vn',
                    office: 'Room 201, Building A1',
                    schoolId: schools[0].id
                }
            }),
            prisma.faculty.upsert({
                where: {
                    name_schoolId: {
                        name: 'Faculty of Information Systems',
                        schoolId: schools[0].id
                    }
                },
                update: {},
                create: {
                    name: 'Faculty of Information Systems',
                    description: 'Information Systems and Data Science',
                    head: 'Dr. Pham Thi D',
                    phone: '+84 24 3209 6703',
                    email: 'is@phenikaa.edu.vn',
                    office: 'Room 301, Building A1',
                    schoolId: schools[0].id
                }
            }),
            // Engineering School Faculties
            prisma.faculty.upsert({
                where: {
                    name_schoolId: {
                        name: 'Faculty of Mechanical Engineering',
                        schoolId: schools[1].id
                    }
                },
                update: {},
                create: {
                    name: 'Faculty of Mechanical Engineering',
                    description: 'Mechanical Engineering and Manufacturing',
                    head: 'Dr. Hoang Van E',
                    phone: '+84 24 3209 6704',
                    email: 'me@phenikaa.edu.vn',
                    office: 'Room 101, Building B1',
                    schoolId: schools[1].id
                }
            }),
            prisma.faculty.upsert({
                where: {
                    name_schoolId: {
                        name: 'Faculty of Electrical Engineering',
                        schoolId: schools[1].id
                    }
                },
                update: {},
                create: {
                    name: 'Faculty of Electrical Engineering',
                    description: 'Electrical and Electronics Engineering',
                    head: 'Dr. Vu Thi F',
                    phone: '+84 24 3209 6705',
                    email: 'ee@phenikaa.edu.vn',
                    office: 'Room 201, Building B1',
                    schoolId: schools[1].id
                }
            })
        ])
        console.log(`✓ Created ${faculties.length} faculties\n`)

        // 4. Create Majors
        console.log('4. Creating Majors...')
        const majors = await Promise.all([
            // Computer Science Faculty
            prisma.major.upsert({
                where: { code: 'CS' },
                update: {},
                create: {
                    name: 'Computer Science',
                    code: 'CS',
                    description: 'Bachelor of Science in Computer Science',
                    duration: 4,
                    credits: 120,
                    level: 'Bachelor',
                    facultyId: faculties[0].id
                }
            }),
            prisma.major.upsert({
                where: { code: 'SE' },
                update: {},
                create: {
                    name: 'Software Engineering',
                    code: 'SE',
                    description: 'Bachelor of Science in Software Engineering',
                    duration: 4,
                    credits: 120,
                    level: 'Bachelor',
                    facultyId: faculties[0].id
                }
            }),
            // Information Systems Faculty
            prisma.major.upsert({
                where: { code: 'IS' },
                update: {},
                create: {
                    name: 'Information Systems',
                    code: 'IS',
                    description: 'Bachelor of Science in Information Systems',
                    duration: 4,
                    credits: 120,
                    level: 'Bachelor',
                    facultyId: faculties[1].id
                }
            }),
            prisma.major.upsert({
                where: { code: 'DS' },
                update: {},
                create: {
                    name: 'Data Science',
                    code: 'DS',
                    description: 'Bachelor of Science in Data Science',
                    duration: 4,
                    credits: 120,
                    level: 'Bachelor',
                    facultyId: faculties[1].id
                }
            }),
            // Mechanical Engineering Faculty
            prisma.major.upsert({
                where: { code: 'ME' },
                update: {},
                create: {
                    name: 'Mechanical Engineering',
                    code: 'ME',
                    description: 'Bachelor of Engineering in Mechanical Engineering',
                    duration: 4,
                    credits: 140,
                    level: 'Bachelor',
                    facultyId: faculties[2].id
                }
            }),
            // Electrical Engineering Faculty
            prisma.major.upsert({
                where: { code: 'EE' },
                update: {},
                create: {
                    name: 'Electrical Engineering',
                    code: 'EE',
                    description: 'Bachelor of Engineering in Electrical Engineering',
                    duration: 4,
                    credits: 140,
                    level: 'Bachelor',
                    facultyId: faculties[3].id
                }
            })
        ])
        console.log(`✓ Created ${majors.length} majors\n`)

        // 5. Create Lecturers
        console.log('5. Creating Lecturers...')
        const lecturers = await Promise.all([
            // Computer Science Faculty Lecturers
            prisma.lecturer.upsert({
                where: { email: 'nguyenvang@phenikaa.edu.vn' },
                update: {},
                create: {
                    title: 'Professor',
                    firstName: 'Nguyen',
                    lastName: 'Van G',
                    fullName: 'Prof. Nguyen Van G',
                    email: 'nguyenvang@phenikaa.edu.vn',
                    phone: '+84 24 3209 6706',
                    office: 'Room 201A, Building A1',
                    biography: 'Expert in algorithms and data structures with 15 years of experience.',
                    specialization: 'Algorithms, Data Structures',
                    joinDate: new Date('2010-09-01'),
                    facultyId: faculties[0].id
                }
            }),
            prisma.lecturer.upsert({
                where: { email: 'tranthih@phenikaa.edu.vn' },
                update: {},
                create: {
                    title: 'Associate Professor',
                    firstName: 'Tran',
                    lastName: 'Thi H',
                    fullName: 'Assoc. Prof. Tran Thi H',
                    email: 'tranthih@phenikaa.edu.vn',
                    phone: '+84 24 3209 6707',
                    office: 'Room 201B, Building A1',
                    biography: 'Specialist in software engineering and project management.',
                    specialization: 'Software Engineering, Project Management',
                    joinDate: new Date('2012-03-01'),
                    facultyId: faculties[0].id
                }
            }),
            // Information Systems Faculty Lecturers
            prisma.lecturer.upsert({
                where: { email: 'levani@phenikaa.edu.vn' },
                update: {},
                create: {
                    title: 'Dr.',
                    firstName: 'Le',
                    lastName: 'Van I',
                    fullName: 'Dr. Le Van I',
                    email: 'levani@phenikaa.edu.vn',
                    phone: '+84 24 3209 6708',
                    office: 'Room 301A, Building A1',
                    biography: 'Expert in database systems and information management.',
                    specialization: 'Database Systems, Information Management',
                    joinDate: new Date('2015-08-01'),
                    facultyId: faculties[1].id
                }
            }),
            // Mechanical Engineering Faculty Lecturers
            prisma.lecturer.upsert({
                where: { email: 'phamvanj@phenikaa.edu.vn' },
                update: {},
                create: {
                    title: 'Professor',
                    firstName: 'Pham',
                    lastName: 'Van J',
                    fullName: 'Prof. Pham Van J',
                    email: 'phamvanj@phenikaa.edu.vn',
                    phone: '+84 24 3209 6709',
                    office: 'Room 101A, Building B1',
                    biography: 'Expert in mechanical design and manufacturing processes.',
                    specialization: 'Mechanical Design, Manufacturing',
                    joinDate: new Date('2008-01-01'),
                    facultyId: faculties[2].id
                }
            })
        ])
        console.log(`✓ Created ${lecturers.length} lecturers\n`)

        // 6. Create Subjects
        console.log('6. Creating Subjects...')
        const subjects = await Promise.all([
            // Computer Science Subjects
            prisma.subject.upsert({
                where: { code: 'CS101' },
                update: {},
                create: {
                    code: 'CS101',
                    name: 'Introduction to Computer Science',
                    description: 'Fundamental concepts of computer science including programming basics, algorithms, and data structures.',
                    credits: 3,
                    hours: 45,
                    semester: 'Fall 2024',
                    syllabus: 'Week 1-2: Programming Fundamentals\nWeek 3-4: Data Types and Variables\nWeek 5-6: Control Structures\nWeek 7-8: Functions and Arrays\nWeek 9-10: Object-Oriented Programming\nWeek 11-12: Algorithms and Data Structures\nWeek 13-14: Problem Solving\nWeek 15: Final Project',
                    prerequisites: 'Basic mathematics knowledge',
                    objectives: '1. Understand fundamental programming concepts\n2. Learn problem-solving techniques\n3. Master basic data structures\n4. Develop algorithmic thinking',
                    status: 'Active',
                    majorId: majors[0].id
                }
            }),
            prisma.subject.upsert({
                where: { code: 'CS102' },
                update: {},
                create: {
                    code: 'CS102',
                    name: 'Data Structures and Algorithms',
                    description: 'Advanced study of data structures and algorithm design and analysis.',
                    credits: 3,
                    hours: 45,
                    semester: 'Spring 2024',
                    syllabus: 'Week 1-2: Arrays and Linked Lists\nWeek 3-4: Stacks and Queues\nWeek 5-6: Trees and Binary Trees\nWeek 7-8: Graphs\nWeek 9-10: Sorting Algorithms\nWeek 11-12: Searching Algorithms\nWeek 13-14: Dynamic Programming\nWeek 15: Final Exam',
                    prerequisites: 'CS101 - Introduction to Computer Science',
                    objectives: '1. Master fundamental data structures\n2. Understand algorithm complexity\n3. Implement efficient algorithms\n4. Analyze algorithm performance',
                    status: 'Active',
                    majorId: majors[0].id
                }
            }),
            // Software Engineering Subjects
            prisma.subject.upsert({
                where: { code: 'SE201' },
                update: {},
                create: {
                    code: 'SE201',
                    name: 'Software Engineering Fundamentals',
                    description: 'Introduction to software engineering principles and methodologies.',
                    credits: 3,
                    hours: 45,
                    semester: 'Fall 2024',
                    syllabus: 'Week 1-2: Software Development Life Cycle\nWeek 3-4: Requirements Engineering\nWeek 5-6: System Design\nWeek 7-8: Implementation\nWeek 9-10: Testing\nWeek 11-12: Maintenance\nWeek 13-14: Project Management\nWeek 15: Final Project',
                    prerequisites: 'CS102 - Data Structures and Algorithms',
                    objectives: '1. Understand software development process\n2. Learn requirements engineering\n3. Master system design principles\n4. Apply testing methodologies',
                    status: 'Active',
                    majorId: majors[1].id
                }
            }),
            // Information Systems Subjects
            prisma.subject.upsert({
                where: { code: 'IS301' },
                update: {},
                create: {
                    code: 'IS301',
                    name: 'Database Management Systems',
                    description: 'Comprehensive study of database design, implementation, and management.',
                    credits: 3,
                    hours: 45,
                    semester: 'Fall 2024',
                    syllabus: 'Week 1-2: Database Concepts\nWeek 3-4: ER Modeling\nWeek 5-6: Relational Model\nWeek 7-8: SQL Programming\nWeek 9-10: Normalization\nWeek 11-12: Transaction Management\nWeek 13-14: Database Security\nWeek 15: Final Project',
                    prerequisites: 'IS201 - Information Systems Fundamentals',
                    objectives: '1. Design effective database schemas\n2. Master SQL programming\n3. Understand transaction management\n4. Implement database security',
                    status: 'Active',
                    majorId: majors[2].id
                }
            }),
            // Data Science Subjects
            prisma.subject.upsert({
                where: { code: 'DS401' },
                update: {},
                create: {
                    code: 'DS401',
                    name: 'Machine Learning',
                    description: 'Introduction to machine learning algorithms and applications.',
                    credits: 3,
                    hours: 45,
                    semester: 'Spring 2024',
                    syllabus: 'Week 1-2: Introduction to ML\nWeek 3-4: Supervised Learning\nWeek 5-6: Unsupervised Learning\nWeek 7-8: Neural Networks\nWeek 9-10: Deep Learning\nWeek 11-12: Model Evaluation\nWeek 13-14: Practical Applications\nWeek 15: Final Project',
                    prerequisites: 'DS301 - Statistics for Data Science',
                    objectives: '1. Understand ML algorithms\n2. Implement ML models\n3. Evaluate model performance\n4. Apply ML to real problems',
                    status: 'Active',
                    majorId: majors[3].id
                }
            }),
            // Mechanical Engineering Subjects
            prisma.subject.upsert({
                where: { code: 'ME501' },
                update: {},
                create: {
                    code: 'ME501',
                    name: 'Mechanical Design',
                    description: 'Principles and practices of mechanical system design.',
                    credits: 4,
                    hours: 60,
                    semester: 'Fall 2024',
                    syllabus: 'Week 1-2: Design Process\nWeek 3-4: Materials Selection\nWeek 5-6: Stress Analysis\nWeek 7-8: Fatigue Analysis\nWeek 9-10: CAD Modeling\nWeek 11-12: Prototyping\nWeek 13-14: Design Optimization\nWeek 15: Final Design Project',
                    prerequisites: 'ME401 - Mechanics of Materials',
                    objectives: '1. Master design principles\n2. Select appropriate materials\n3. Perform stress analysis\n4. Create CAD models',
                    status: 'Active',
                    majorId: majors[4].id
                }
            }),
            // Electrical Engineering Subjects
            prisma.subject.upsert({
                where: { code: 'EE601' },
                update: {},
                create: {
                    code: 'EE601',
                    name: 'Circuit Analysis',
                    description: 'Analysis of electrical circuits and networks.',
                    credits: 4,
                    hours: 60,
                    semester: 'Fall 2024',
                    syllabus: 'Week 1-2: Basic Circuit Laws\nWeek 3-4: Nodal Analysis\nWeek 5-6: Mesh Analysis\nWeek 7-8: Thevenin and Norton Theorems\nWeek 9-10: AC Circuits\nWeek 11-12: Power Analysis\nWeek 13-14: Three-Phase Circuits\nWeek 15: Final Exam',
                    prerequisites: 'EE501 - Electrical Fundamentals',
                    objectives: '1. Analyze DC circuits\n2. Analyze AC circuits\n3. Apply circuit theorems\n4. Calculate power in circuits',
                    status: 'Active',
                    majorId: majors[5].id
                }
            })
        ])
        console.log(`✓ Created ${subjects.length} subjects\n`)

        // 7. Create Lecturer-Subject relationships
        console.log('7. Creating Lecturer-Subject relationships...')
        const lecturerSubjects = await Promise.all([
            // Assign lecturers to subjects
            prisma.lecturerSubject.upsert({
                where: {
                    lecturerId_subjectId: {
                        lecturerId: lecturers[0].id,
                        subjectId: subjects[0].id
                    }
                },
                update: {},
                create: {
                    role: 'Instructor',
                    lecturerId: lecturers[0].id,
                    subjectId: subjects[0].id
                }
            }),
            prisma.lecturerSubject.upsert({
                where: {
                    lecturerId_subjectId: {
                        lecturerId: lecturers[0].id,
                        subjectId: subjects[1].id
                    }
                },
                update: {},
                create: {
                    role: 'Instructor',
                    lecturerId: lecturers[0].id,
                    subjectId: subjects[1].id
                }
            }),
            prisma.lecturerSubject.upsert({
                where: {
                    lecturerId_subjectId: {
                        lecturerId: lecturers[1].id,
                        subjectId: subjects[2].id
                    }
                },
                update: {},
                create: {
                    role: 'Instructor',
                    lecturerId: lecturers[1].id,
                    subjectId: subjects[2].id
                }
            }),
            prisma.lecturerSubject.upsert({
                where: {
                    lecturerId_subjectId: {
                        lecturerId: lecturers[2].id,
                        subjectId: subjects[3].id
                    }
                },
                update: {},
                create: {
                    role: 'Instructor',
                    lecturerId: lecturers[2].id,
                    subjectId: subjects[3].id
                }
            }),
            prisma.lecturerSubject.upsert({
                where: {
                    lecturerId_subjectId: {
                        lecturerId: lecturers[3].id,
                        subjectId: subjects[5].id
                    }
                },
                update: {},
                create: {
                    role: 'Instructor',
                    lecturerId: lecturers[3].id,
                    subjectId: subjects[5].id
                }
            })
        ])
        console.log(`✓ Created ${lecturerSubjects.length} lecturer-subject relationships\n`)

        // Summary
        const summary = await prisma.$queryRaw`
      SELECT 
        (SELECT COUNT(*) FROM universities) as universities,
        (SELECT COUNT(*) FROM schools) as schools,
        (SELECT COUNT(*) FROM faculties) as faculties,
        (SELECT COUNT(*) FROM majors) as majors,
        (SELECT COUNT(*) FROM lecturers) as lecturers,
        (SELECT COUNT(*) FROM subjects) as subjects,
        (SELECT COUNT(*) FROM lecturer_subjects) as lecturer_subjects
    `

        console.log('🎉 Data seeding completed successfully!')
        console.log('📊 Summary:')
        console.log(`   Universities: ${summary[0].universities}`)
        console.log(`   Schools: ${summary[0].schools}`)
        console.log(`   Faculties: ${summary[0].faculties}`)
        console.log(`   Majors: ${summary[0].majors}`)
        console.log(`   Lecturers: ${summary[0].lecturers}`)
        console.log(`   Subjects: ${summary[0].subjects}`)
        console.log(`   Lecturer-Subject relationships: ${summary[0].lecturer_subjects}`)
        console.log('\n✅ You can now use the course management functionality!')

    } catch (error) {
        console.error('❌ Error seeding data:', error)
    } finally {
        await prisma.$disconnect()
    }
}

seedCompleteData()

