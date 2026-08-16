'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createFood(formData: FormData) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error('Not authenticated')
  }

  const name = formData.get('name') as string
  const calories = parseInt(formData.get('calories') as string)
  const protein = parseFloat(formData.get('protein') as string)
  const carbs = parseFloat(formData.get('carbs') as string)
  const fat = parseFloat(formData.get('fat') as string)
  const fiber = parseFloat(formData.get('fiber') as string)
  const servingSize = formData.get('servingSize') as string

  if (!name || isNaN(calories) || isNaN(protein) || isNaN(carbs) || isNaN(fat) || isNaN(fiber) || !servingSize) {
    throw new Error('Missing required fields')
  }

  await prisma.food.create({
    data: {
      name,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      servingSize
    }
  })

  revalidatePath('/dashboard/foods')
}

export async function deleteFood(id: string) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error('Not authenticated')
  }

  await prisma.food.delete({
    where: { id }
  })

  revalidatePath('/dashboard/foods')
}
