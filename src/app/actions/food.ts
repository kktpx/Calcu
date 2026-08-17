'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'

const foodSchema = z.object({
  name: z.string().min(1),
  calories: z.number().min(0),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fat: z.number().min(0),
  fiber: z.number().min(0),
  servingSize: z.string().min(1)
})

export async function createFood(formData: FormData) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error('Not authenticated')
  }

  const data = foodSchema.parse({
    name: formData.get('name'),
    calories: parseInt(formData.get('calories') as string) || 0,
    protein: parseFloat(formData.get('protein') as string) || 0,
    carbs: parseFloat(formData.get('carbs') as string) || 0,
    fat: parseFloat(formData.get('fat') as string) || 0,
    fiber: parseFloat(formData.get('fiber') as string) || 0,
    servingSize: formData.get('servingSize')
  })

  await prisma.food.create({
    data
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

import { analyzeFoodWithGemini } from '@/lib/gemini'

export async function analyzeFoodImage(formData: FormData) {
  const session = await auth()
  if (!session?.user?.email) throw new Error('Not authenticated')

  const rl = rateLimit(`ai-food-${session.user.email}`, 5, 60000)
  if (!rl.success) {
    throw new Error('Rate limit exceeded. Try again later.')
  }

  const file = formData.get('file') as File
  if (!file) throw new Error('No file provided')

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const base64Image = buffer.toString('base64')
  const mimeType = file.type || 'image/jpeg'

  const prompt = `Analyze this image and identify the food.
Return ONLY a valid JSON object matching this schema without any markdown formatting like \`\`\`json:
{
  "name": "Food Name",
  "calories": 100,
  "protein": 10.5,
  "carbs": 5.2,
  "fat": 3.1,
  "fiber": 1.0,
  "servingSize": "100g"
}`

  const result = await analyzeFoodWithGemini(prompt, base64Image, mimeType)
  try {
    // clean up any potential markdown wrapper
    let cleanJson = result.trim()
    if (cleanJson.startsWith('\`\`\`json')) cleanJson = cleanJson.replace(/^\`\`\`json/, '')
    if (cleanJson.startsWith('\`\`\`')) cleanJson = cleanJson.replace(/^\`\`\`/, '')
    if (cleanJson.endsWith('\`\`\`')) cleanJson = cleanJson.replace(/\`\`\`$/, '')
    
    return JSON.parse(cleanJson.trim())
  } catch (err) {
    console.error("Failed to parse AI JSON: ", result)
    throw new Error('Failed to parse AI result')
  }
}
