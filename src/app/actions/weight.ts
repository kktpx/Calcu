'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function logWeight(formData: FormData) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error('Not authenticated')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { profile: true }
  })

  if (!user || !user.profile) {
    throw new Error('User profile not found')
  }

  const weightKgStr = formData.get('weightKg') as string
  const dateStr = formData.get('date') as string

  const weightKg = parseFloat(weightKgStr)
  if (isNaN(weightKg) || weightKg <= 0) {
    throw new Error('Invalid weight')
  }

  let recordDate = new Date()
  if (dateStr) {
    recordDate = new Date(dateStr)
  }
  // normalize to local midnight
  recordDate = new Date(recordDate.getFullYear(), recordDate.getMonth(), recordDate.getDate())

  // Create or update weight record for this date
  const existingRecord = await prisma.weightRecord.findFirst({
    where: {
      userId: user.id,
      recordDate: recordDate
    }
  })

  if (existingRecord) {
    await prisma.weightRecord.update({
      where: { id: existingRecord.id },
      data: { weightKg }
    })
  } else {
    await prisma.weightRecord.create({
      data: {
        userId: user.id,
        weightKg,
        recordDate
      }
    })
  }

  // Update user's current profile weight
  await prisma.userProfile.update({
    where: { id: user.profile.id },
    data: { weightKg }
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/weight')
}

export async function deleteWeightRecord(id: string) {
  const session = await auth()
  if (!session?.user?.email) throw new Error('Not authenticated')
  
  await prisma.weightRecord.delete({
    where: { id }
  })

  revalidatePath('/dashboard/weight')
}
