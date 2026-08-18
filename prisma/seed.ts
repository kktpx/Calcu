import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL
const adapter = connectionString ? new PrismaPg({ connectionString }) : null
const prisma = new PrismaClient(adapter ? { adapter } : ({} as any))

async function main() {
  console.log('Start seeding...')

  // Seed initial food items
  const foods = [
    // วัตถุดิบพื้นฐาน (Basic Ingredients)
    { name: 'ข้าวสวย (White Rice)', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, servingSize: '100g' },
    { name: 'ข้าวกล้อง (Brown Rice)', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8, servingSize: '100g' },
    { name: 'อกไก่ต้ม (Boiled Chicken Breast)', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, servingSize: '100g' },
    { name: 'ไข่ต้ม (Boiled Egg)', calories: 78, protein: 6, carbs: 0.6, fat: 5, fiber: 0, servingSize: '1 ฟอง (50g)' },
    { name: 'ไข่ดาว (Fried Egg)', calories: 110, protein: 6, carbs: 0.6, fat: 9, fiber: 0, servingSize: '1 ฟอง (50g)' },
    
    // เมนูอาหารจานเดียว (Single Dish Meals)
    { name: 'ข้าวกะเพราหมูสับ (Rice with Holy Basil and Minced Pork)', calories: 580, protein: 22, carbs: 60, fat: 25, fiber: 2, servingSize: '1 จาน (350g)' },
    { name: 'ข้าวกะเพราไก่ (Rice with Holy Basil and Chicken)', calories: 530, protein: 25, carbs: 60, fat: 20, fiber: 2, servingSize: '1 จาน (350g)' },
    { name: 'ผัดไทยกุ้งสด (Pad Thai with Shrimp)', calories: 550, protein: 18, carbs: 75, fat: 20, fiber: 3, servingSize: '1 จาน (300g)' },
    { name: 'ข้าวมันไก่ (Hainanese Chicken Rice)', calories: 596, protein: 20, carbs: 65, fat: 26, fiber: 1, servingSize: '1 จาน (300g)' },
    { name: 'ข้าวหมูแดง (Rice with Roasted Pork)', calories: 540, protein: 20, carbs: 75, fat: 15, fiber: 1, servingSize: '1 จาน (300g)' },
    { name: 'ข้าวขาหมู (Rice with Stewed Pork Leg)', calories: 690, protein: 22, carbs: 60, fat: 38, fiber: 1, servingSize: '1 จาน (300g)' },
    { name: 'ข้าวผัดหมู (Pork Fried Rice)', calories: 550, protein: 20, carbs: 65, fat: 20, fiber: 2, servingSize: '1 จาน (300g)' },
    { name: 'สุกี้น้ำทะเล (Seafood Suki Soup)', calories: 250, protein: 15, carbs: 35, fat: 5, fiber: 3, servingSize: '1 ชาม (400g)' },
    { name: 'สุกี้แห้งหมู (Stir-fried Suki with Pork)', calories: 400, protein: 18, carbs: 40, fat: 18, fiber: 3, servingSize: '1 จาน (300g)' },
    
    // เส้น (Noodles)
    { name: 'ก๋วยเตี๋ยวเส้นเล็กน้ำใสหมู (Pork Noodle Soup)', calories: 350, protein: 18, carbs: 45, fat: 10, fiber: 2, servingSize: '1 ชาม (400g)' },
    { name: 'บะหมี่เกี๊ยวหมูแดง (Egg Noodle with Wonton & Red Pork)', calories: 450, protein: 22, carbs: 55, fat: 15, fiber: 2, servingSize: '1 ชาม (350g)' },
    { name: 'ราดหน้าหมู (Noodles in Thick Gravy with Pork)', calories: 400, protein: 18, carbs: 50, fat: 12, fiber: 2, servingSize: '1 จาน (350g)' },
    { name: 'ผัดซีอิ๊วหมู (Stir-fried Noodles in Dark Soy Sauce)', calories: 520, protein: 20, carbs: 55, fat: 22, fiber: 3, servingSize: '1 จาน (300g)' },
    
    // แกง/ต้ม (Curries / Soups - without rice)
    { name: 'ต้มยำกุ้งน้ำใส (Tom Yum Goong - Clear Soup)', calories: 90, protein: 12, carbs: 4, fat: 3, fiber: 1, servingSize: '1 ชาม (250g)' },
    { name: 'ต้มยำกุ้งน้ำข้น (Tom Yum Goong - Creamy Soup)', calories: 250, protein: 15, carbs: 8, fat: 18, fiber: 1, servingSize: '1 ชาม (250g)' },
    { name: 'แกงเขียวหวานไก่ (Green Curry with Chicken)', calories: 350, protein: 15, carbs: 12, fat: 28, fiber: 2, servingSize: '1 ชาม (250g)' },
    { name: 'ต้มจืดเต้าหู้หมูสับ (Clear Soup with Tofu and Minced Pork)', calories: 150, protein: 12, carbs: 5, fat: 8, fiber: 1, servingSize: '1 ชาม (300g)' },
    
    // อาหารอีสาน/ยำ (Isan/Spicy Salads)
    { name: 'ส้มตำไทย (Thai Papaya Salad)', calories: 120, protein: 4, carbs: 20, fat: 4, fiber: 5, servingSize: '1 จาน (150g)' },
    { name: 'ลาบหมู (Spicy Minced Pork Salad)', calories: 160, protein: 18, carbs: 5, fat: 7, fiber: 2, servingSize: '1 จาน (100g)' },
    { name: 'น้ำตกหมู (Spicy Grilled Pork Salad)', calories: 200, protein: 18, carbs: 5, fat: 12, fiber: 1, servingSize: '1 จาน (100g)' },
    { name: 'ยำวุ้นเส้นหมูสับ (Spicy Glass Noodle Salad)', calories: 180, protein: 10, carbs: 25, fat: 4, fiber: 2, servingSize: '1 จาน (150g)' },
    
    // ของว่าง/ขนม (Snacks / Desserts / Beverages)
    { name: 'หมูปิ้ง (Grilled Pork Skewer)', calories: 130, protein: 10, carbs: 5, fat: 8, fiber: 0, servingSize: '1 ไม้' },
    { name: 'ลูกชิ้นปิ้ง (Grilled Meatballs with Sauce)', calories: 150, protein: 10, carbs: 15, fat: 5, fiber: 0, servingSize: '1 ไม้ (4 ลูก)' },
    { name: 'กล้วยแขก (Fried Banana)', calories: 250, protein: 2, carbs: 40, fat: 10, fiber: 2, servingSize: '3 ชิ้น' },
    { name: 'ขนมครก (Coconut Rice Dumplings)', calories: 210, protein: 2, carbs: 30, fat: 9, fiber: 1, servingSize: '1 คู่ (2 ฝา)' },
    { name: 'ขนมปังปิ้งเนยนม (Toast with Butter and Condensed Milk)', calories: 300, protein: 5, carbs: 35, fat: 15, fiber: 1, servingSize: '1 แผ่น' },
    { name: 'ชานมไข่มุก (Boba Milk Tea)', calories: 350, protein: 2, carbs: 60, fat: 10, fiber: 0, servingSize: '1 แก้ว (หวานปกติ)' },
    { name: 'กาแฟเย็น/ชาเย็น (Iced Thai Coffee/Tea)', calories: 250, protein: 2, carbs: 40, fat: 8, fiber: 0, servingSize: '1 แก้ว' },
    { name: 'ถั่วลิสงคั่ว (Roasted Peanuts)', calories: 160, protein: 7, carbs: 5, fat: 14, fiber: 2, servingSize: '1 กำมือ (30g)' },
    { name: 'มันฝรั่งทอดกรอบ (Potato Chips)', calories: 150, protein: 2, carbs: 15, fat: 10, fiber: 1, servingSize: '1 ห่อเล็ก (30g)' },
  ]

  for (const f of foods) {
    const existing = await prisma.food.findFirst({ where: { name: f.name } })
    if (!existing) {
      const food = await prisma.food.create({
        data: f
      })
      console.log(`Created food with id: ${food.id} - ${f.name}`)
    } else {
      console.log(`Food already exists: ${f.name}`)
    }
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
