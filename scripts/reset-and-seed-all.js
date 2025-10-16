const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function resetAndSeedAll() {
    try {
        console.log('🧹 Resetting database...')

        // Delete all data in reverse order of dependencies
        await prisma.lecturerSubject.deleteMany()
        await prisma.subject.deleteMany()
        await prisma.course.deleteMany()
        await prisma.knowledgeBlock.deleteMany()
        await prisma.lecturer.deleteMany()
        await prisma.major.deleteMany()
        await prisma.faculty.deleteMany()
        await prisma.school.deleteMany()
        await prisma.university.deleteMany()

        console.log('✅ Database reset completed\n')

        // Now seed all data
        console.log('🌱 Starting fresh data seeding...')
        const { seedAllData } = require('./seed-all-data.js')
        await seedAllData()

    } catch (error) {
        console.error('❌ Error during reset and seed:', error)
    } finally {
        await prisma.$disconnect()
    }
}

// Run if called directly
if (require.main === module) {
    resetAndSeedAll()
}

module.exports = { resetAndSeedAll }




