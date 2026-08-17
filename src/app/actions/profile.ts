'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { calculateBMR, calculateTDEE, calculateMacroTargets } from '@/lib/nutrition'
import { profileUpdateSchema } from '@/lib/validation'

export async function updateProfile(formData: FormData) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error('Not authenticated')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })
  
  if (!user) {
    throw new Error('User not found')
  }

  const parsed = profileUpdateSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    throw new Error('Invalid form data')
  }

  const data = parsed.data
  
  // Calculate nutrition targets
  const bmr = calculateBMR(data.gender, data.weightKg, data.heightCm, data.age)
  const tdee = calculateTDEE(bmr, data.activityLevel)
  const targets = calculateMacroTargets(tdee, data.fitnessGoal)

  await prisma.userProfile.update({
    where: { userId: user.id },
    data: {
      age: data.age,
      gender: data.gender,
      heightCm: data.heightCm,
      weightKg: data.weightKg,
      activityLevel: data.activityLevel,
      fitnessGoal: data.fitnessGoal,
      dailyCalorieTarget: targets.calories,
      targetProtein: targets.protein,
      targetCarbs: targets.carbs,
      targetFat: targets.fat
    }
  })

  revalidatePath('/dashboard')
  return { success: true }
}
