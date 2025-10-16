const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedAllData() {
    try {
        console.log('🚀 Starting complete data seeding...\n')

        // 1. Seed complete basic data
        console.log('1️⃣ Seeding basic data (universities, schools, faculties, majors, lecturers, subjects)...')
        const { seedCompleteData } = require('./seed-complete-data.js')
        await seedCompleteData()
        console.log('✅ Basic data seeded successfully\n')

        // 2. Seed courses
        console.log('2️⃣ Seeding courses...')
        const { seedCourses } = require('./seed-courses.js')
        await seedCourses()
        console.log('✅ Courses seeded successfully\n')

        // 3. Seed knowledge blocks
        console.log('3️⃣ Seeding knowledge blocks...')
        const { seedKnowledgeBlocks } = require('./seed-knowledge-blocks-fixed.js')
        await seedKnowledgeBlocks()
        console.log('✅ Knowledge blocks seeded successfully\n')

        // Final summary
        console.log('🎉 All data seeding completed successfully!')
        console.log('\n📊 Final Summary:')

        const summary = await prisma.$queryRaw`
            SELECT 
                (SELECT COUNT(*) FROM universities) as universities,
                (SELECT COUNT(*) FROM schools) as schools,
                (SELECT COUNT(*) FROM faculties) as faculties,
                (SELECT COUNT(*) FROM majors) as majors,
                (SELECT COUNT(*) FROM lecturers) as lecturers,
                (SELECT COUNT(*) FROM subjects) as subjects,
                (SELECT COUNT(*) FROM courses) as courses,
                (SELECT COUNT(*) FROM knowledge_blocks) as knowledge_blocks
        `

        console.log(`   🏛️  Universities: ${summary[0].universities}`)
        console.log(`   🏫 Schools: ${summary[0].schools}`)
        console.log(`   👥 Faculties: ${summary[0].faculties}`)
        console.log(`   📚 Majors: ${summary[0].majors}`)
        console.log(`   👨‍🏫 Lecturers: ${summary[0].lecturers}`)
        console.log(`   📖 Subjects: ${summary[0].subjects}`)
        console.log(`   🎓 Courses: ${summary[0].courses}`)
        console.log(`   📋 Knowledge Blocks: ${summary[0].knowledge_blocks}`)

        console.log('\n✅ Your university management system is ready to use!')
        console.log('🌐 Start the development server with: npm run dev')

    } catch (error) {
        console.error('❌ Error during seeding:', error)
    } finally {
        await prisma.$disconnect()
    }
}

// Run if called directly
if (require.main === module) {
    seedAllData()
}

module.exports = { seedAllData }




