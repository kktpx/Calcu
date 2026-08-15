'use server'

import { signIn, signOut } from '@/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { AuthError } from 'next-auth'
import { z } from 'zod'

const RegisterSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
})

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', Object.fromEntries(formData))
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.'
        default:
          return 'Something went wrong.'
      }
    }
    throw error
  }
}

export async function register(
  prevState: string | undefined,
  formData: FormData,
) {
  const parsed = RegisterSchema.safeParse(Object.fromEntries(formData))
  
  if (!parsed.success) {
    return 'Invalid form data. Email must be valid and password > 6 characters.'
  }
  
  const { email, password } = parsed.data
  
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return 'User already exists.'
    }
    
    const hashedPassword = await bcrypt.hash(password, 10)
    
    await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        profile: {
          create: {
            age: 25,
            gender: 'other',
            heightCm: 170,
            weightKg: 70,
            activityLevel: 'sedentary',
            fitnessGoal: 'maintain',
            dailyCalorieTarget: 2000,
            targetProtein: 150,
            targetCarbs: 200,
            targetFat: 65,
          }
        }
      }
    })
    
    // Attempt sign-in right after registration
    await signIn('credentials', { email, password })
  } catch (error) {
    if (error instanceof AuthError) {
      return 'Registration succeeded but login failed.'
    }
    console.error(error)
    throw error
  }
}

export async function logout() {
  await signOut()
}
