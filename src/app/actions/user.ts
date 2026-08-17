'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateUserInfo(formData: FormData) {
  const session = await auth()
  if (!session?.user?.email) throw new Error('Not authenticated')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })
  if (!user) throw new Error('User not found')

  const name = formData.get('name') as string | null
  const file = formData.get('image') as File | null

  let image: string | undefined = undefined

  if (file && file.size > 0) {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Limit to 5MB
    if (buffer.length > 5 * 1024 * 1024) {
      throw new Error('Image too large. Maximum 5MB.')
    }
    
    const mimeType = file.type || 'image/jpeg'
    image = `data:${mimeType};base64,${buffer.toString('base64')}`
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      ...(name !== null && { name }),
      ...(image !== undefined && { image }),
    }
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/profile')
  return { success: true }
}
