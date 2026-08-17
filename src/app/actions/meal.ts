'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { mealItemSchema } from '@/lib/validation'

export async function addMealItem(formData: FormData) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error('Not authenticated')
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) throw new Error('User not found')

  const parsedData = mealItemSchema.parse({
    foodId: formData.get('foodId'),
    mealType: formData.get('mealType'),
    servingMultiplier: parseFloat(formData.get('servingMultiplier') as string) || 0
  })

  const { foodId, mealType, servingMultiplier } = parsedData
  
  // Date to local midnight
  const now = new Date()
  const logDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const food = await prisma.food.findUnique({ where: { id: foodId } })
  if (!food) throw new Error('Food not found')

  // Find or create the meal for this user, date, and mealType
  let meal = await prisma.meal.findFirst({
    where: {
      userId: user.id,
      logDate: logDate,
      mealType: mealType
    }
  })

  if (!meal) {
    meal = await prisma.meal.create({
      data: {
        userId: user.id,
        logDate: logDate,
        mealType: mealType
      }
    })
  }

  const computedCalories = Math.round(food.calories * servingMultiplier)

  await prisma.mealItem.create({
    data: {
      mealId: meal.id,
      foodId: food.id,
      servingMultiplier,
      computedCalories
    }
  })

  revalidatePath('/dashboard')
}

export async function deleteMealItem(mealItemId: string) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error('Not authenticated')
  }

  await prisma.mealItem.delete({
    where: { id: mealItemId }
  })
  
  revalidatePath('/dashboard')
}
