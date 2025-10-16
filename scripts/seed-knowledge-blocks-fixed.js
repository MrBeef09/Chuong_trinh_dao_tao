const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedKnowledgeBlocks() {
    try {
        console.log('🌱 Seeding knowledge blocks...')

        // Lấy danh sách majors
        const majors = await prisma.major.findMany()
        console.log(`📚 Found ${majors.length} majors`)

        // Dữ liệu khối kiến thức mẫu
        const knowledgeBlocksData = [
            {
                name: 'Kiến thức đại cương',
                code: 'GD',
                minCredits: 40,
                maxCredits: 50,
                order: 1
            },
            {
                name: 'Kiến thức cơ sở ngành',
                code: 'CS',
                minCredits: 55,
                maxCredits: 65,
                order: 2
            },
            {
                name: 'Kiến thức chuyên ngành',
                code: 'CN',
                minCredits: 70,
                maxCredits: 80,
                order: 3
            },
            {
                name: 'Kiến thức bổ trợ',
                code: 'BT',
                minCredits: 10,
                maxCredits: 20,
                order: 4
            },
            {
                name: 'Thực tập và tốt nghiệp',
                code: 'TT',
                minCredits: 10,
                maxCredits: 20,
                order: 5
            }
        ]

        // Tạo knowledge blocks
        const createdBlocks = []
        for (const blockData of knowledgeBlocksData) {
            try {
                const knowledgeBlock = await prisma.knowledgeBlock.upsert({
                    where: { code: blockData.code },
                    update: {},
                    create: blockData
                })
                createdBlocks.push(knowledgeBlock)
                console.log(`✓ Created knowledge block: ${knowledgeBlock.name} (${knowledgeBlock.code})`)
            } catch (error) {
                console.log(`❌ Error creating knowledge block ${blockData.name}: ${error.message}`)
            }
        }

        // Display summary
        const totalBlocks = await prisma.knowledgeBlock.count()
        console.log(`\n🎉 Successfully created ${createdBlocks.length} knowledge blocks!`)
        console.log(`📊 Total knowledge blocks in database: ${totalBlocks}`)

        // Hiển thị danh sách knowledge blocks
        console.log('\n📋 Knowledge Blocks:')
        const allBlocks = await prisma.knowledgeBlock.findMany({
            orderBy: { order: 'asc' }
        })

        allBlocks.forEach((block, index) => {
            console.log(`   ${index + 1}. ${block.name} (${block.code})`)
            console.log(`      Credits: ${block.minCredits}-${block.maxCredits}`)
            console.log('')
        })

    } catch (error) {
        console.error('❌ Seeding failed:', error)
    } finally {
        await prisma.$disconnect()
    }
}

// Run if called directly
if (require.main === module) {
    seedKnowledgeBlocks()
}

module.exports = { seedKnowledgeBlocks }
