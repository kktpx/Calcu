'use server'

import { auth } from '@/auth'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function analyzeFoodImage(formData: FormData) {
  const session = await auth()
  if (!session?.user?.email) {
    return { success: false, error: 'Not authenticated' }
  }

  const file = formData.get('image') as File
  if (!file) {
    return { success: false, error: 'No image provided' }
  }

  const apiKey = process.env.GEMINI_API_KEY
  
  // If no API key is configured, provide a mock response for testing purposes
  if (!apiKey || apiKey === '') {
    console.warn('GEMINI_API_KEY is not set. Using mock data for demonstration.')
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    return {
      success: true,
      data: {
        name: 'ข้าวกะเพราหมูสับไข่ดาว (Mock AI)',
        servingSize: '1 จาน',
        calories: 580,
        protein: 25.5,
        carbs: 55.0,
        fat: 28.0,
        fiber: 2.0
      }
    }
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' })

    const buffer = await file.arrayBuffer()
    const base64String = Buffer.from(buffer).toString('base64')

    const prompt = `You are an expert nutritionist specializing in Thai food and general cuisine.
Carefully analyze this food image. Identify the specific dish, visible ingredients, and cooking method (e.g., stir-fried with heavy oil, deep-fried, boiled).
Provide a highly accurate estimate of its nutritional value for the ENTIRE portion shown in the image.
Account for hidden calories like cooking oils, sauces, and sugar commonly used in street food or restaurants.

Respond ONLY with a valid JSON object using the following structure, with no markdown formatting or backticks:
{
  "name": "Specific Food Name (in Thai, e.g., 'ข้าวกะเพราหมูกรอบไข่ดาว')",
  "servingSize": "Realistic portion size shown (e.g., 1 จาน, 1 ชาม)",
  "calories": number (integer, total kcal),
  "protein": number (float, grams),
  "carbs": number (float, grams),
  "fat": number (float, grams),
  "fiber": number (float, grams)
}`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64String,
          mimeType: file.type
        }
      }
    ])

    const text = result.response.text()
    
    // Clean up any markdown code blocks
    const cleanedText = text.replace(/```json/gi, '').replace(/```/g, '').trim()
    const data = JSON.parse(cleanedText)
    
    return { success: true, data }
  } catch (error: any) {
    console.error('AI Analysis Error:', error)
    return { success: false, error: error.message || 'Failed to analyze image' }
  }
}
