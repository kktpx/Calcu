'use server'

import { signIn, signOut } from '@/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { AuthError } from 'next-auth'
import { loginSchema, registerSchema } from '@/lib/validation'
import { rateLimit } from '@/lib/rate-limit'

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const data = Object.fromEntries(formData)
    const parsed = loginSchema.safeParse(data)
    
    if (!parsed.success) {
      return 'Invalid email or password format.'
    }

    const rl = rateLimit(`login-${parsed.data.email}`, 5, 60000)
    if (!rl.success) {
      return 'Too many login attempts. Try again later.'
    }

    await signIn('credentials', { ...parsed.data, redirectTo: '/dashboard' })
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
  const data = Object.fromEntries(formData)
  const parsed = registerSchema.safeParse(data)
  
  if (!parsed.success) {
    return 'Invalid form data. Email must be valid and password > 6 characters.'
  }
  
  const { email, password } = parsed.data
  
  const rl = rateLimit(`register-${email}`, 3, 3600000) // 3 per hour
  if (!rl.success) {
    return 'Too many registration attempts. Try again later.'
  }
  
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
    await signIn('credentials', { email, password, redirectTo: '/dashboard' })
  } catch (error) {
    if (error instanceof AuthError) {
      return 'Registration succeeded but login failed.'
    }
    console.error(error)
    throw error
  }
}

export async function logout() {
  await signOut({ redirectTo: '/' })
}
