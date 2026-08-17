import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL
const adapter = connectionString ? new PrismaPg({ connectionString }) : null
const prisma = new PrismaClient(adapter ? { adapter } : ({} as any))

async function main() {
  console.log('Start seeding...')

  // Seed initial food items
  const foods = [
    { name: 'Apple', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, servingSize: '1 medium (182g)' },
    { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, servingSize: '100g' },
    { name: 'Brown Rice', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8, servingSize: '100g cooked' },
  ]

  for (const f of foods) {
    const food = await prisma.food.create({
      data: f
    })
    console.log(`Created food with id: ${food.id}`)
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
