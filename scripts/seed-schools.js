const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedSchools() {
    try {
        console.log('🏫 Starting to seed schools data...\n')

        // First, check if we have a university to attach schools to
        const university = await prisma.university.findFirst()

        if (!university) {
            console.log('❌ No university found. Please run seed-complete-data.js first or create a university manually.')
            return
        }

        console.log(`✓ Found university: ${university.name}`)

        // Check existing schools
        const existingSchools = await prisma.school.findMany({
            where: { universityId: university.id }
        })

        if (existingSchools.length > 0) {
            console.log(`\n📚 Found ${existingSchools.length} existing schools:`)
            existingSchools.forEach((school, index) => {
                console.log(`   ${index + 1}. ${school.name}`)
                console.log(`      Dean: ${school.dean}`)
                console.log(`      Email: ${school.email}`)
                console.log(`      Address: ${school.address}`)
                console.log('')
            })
        } else {
            console.log('\n🏫 No schools found. Creating new schools...')

            // Create Schools
            const schools = await Promise.all([
                prisma.school.create({
                    data: {
                        name: 'School of Information Technology',
                        description: 'Leading school in IT education and research',
                        dean: 'Prof. Dr. Nguyen Van A',
                        phone: '+84 24 3209 6700',
                        email: 'it@phenikaa.edu.vn',
                        address: 'Building A1, Phenikaa University',
                        universityId: university.id
                    }
                }),
                prisma.school.create({
                    data: {
                        name: 'School of Engineering',
                        description: 'Advanced engineering education and research',
                        dean: 'Prof. Dr. Tran Thi B',
                        phone: '+84 24 3209 6701',
                        email: 'engineering@phenikaa.edu.vn',
                        address: 'Building B1, Phenikaa University',
                        universityId: university.id
                    }
                }),
                prisma.school.create({
                    data: {
                        name: 'School of Business Administration',
                        description: 'Business education and management studies',
                        dean: 'Prof. Dr. Le Thi C',
                        phone: '+84 24 3209 6702',
                        email: 'business@phenikaa.edu.vn',
                        address: 'Building C1, Phenikaa University',
                        universityId: university.id
                    }
                }),
                prisma.school.create({
                    data: {
                        name: 'School of Economics',
                        description: 'Economics and finance education',
                        dean: 'Prof. Dr. Pham Van D',
                        phone: '+84 24 3209 6703',
                        email: 'economics@phenikaa.edu.vn',
                        address: 'Building D1, Phenikaa University',
                        universityId: university.id
                    }
                }),
                prisma.school.create({
                    data: {
                        name: 'School of Languages',
                        description: 'Language studies and linguistics',
                        dean: 'Prof. Dr. Hoang Thi E',
                        phone: '+84 24 3209 6704',
                        email: 'languages@phenikaa.edu.vn',
                        address: 'Building E1, Phenikaa University',
                        universityId: university.id
                    }
                })
            ])

            console.log(`✓ Created ${schools.length} schools:`)
            schools.forEach((school, index) => {
                console.log(`   ${index + 1}. ${school.name}`)
            })
        }

        // Summary
        const totalSchools = await prisma.school.count()
        console.log(`\n📊 Total schools in database: ${totalSchools}`)
        console.log('🎉 Schools seeding completed successfully!')

    } catch (error) {
        console.error('❌ Error seeding schools:', error)
    } finally {
        await prisma.$disconnect()
    }
}

// Run if called directly
if (require.main === module) {
    seedSchools()
}

module.exports = { seedSchools }
