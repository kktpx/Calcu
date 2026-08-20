'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { Resend } from 'resend'

// Initialize Resend if API key is present
const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

export async function forgotPassword(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  if (!email || !email.includes('@')) {
    return { error: 'Invalid email address' }
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      // Return success anyway to prevent email enumeration
      return { success: 'If an account with that email exists, we sent a password reset link.' }
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 3600000) // 1 hour from now

    await prisma.passwordResetToken.create({
      data: {
        token,
        expires,
        userId: user.id
      }
    })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const resetLink = `${appUrl}/reset-password?token=${token}`

    if (resend) {
      try {
        await resend.emails.send({
          from: 'Acme <onboarding@resend.dev>', // Use verified domain in production
          to: email,
          subject: 'Reset your password',
          html: `<p>Hello,</p><p>Click <a href="${resetLink}">here</a> to reset your password. The link expires in 1 hour.</p><p>If you did not request this, please ignore this email.</p>`
        })
      } catch (err) {
        console.error('Failed to send email via Resend:', err)
        // Fallback to console log in case of email failure during dev
        console.log(`[Forgot Password] Reset link (Email failed): ${resetLink}`)
      }
    } else {
      console.log(`[Forgot Password] No RESEND_API_KEY found. Reset link: ${resetLink}`)
    }

    return { success: 'If an account with that email exists, we sent a password reset link.' }
  } catch (error) {
    console.error(error)
    return { error: 'Something went wrong.' }
  }
}

export async function resetPassword(prevState: any, formData: FormData) {
  const token = formData.get('token') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!token) return { error: 'Missing reset token' }
  if (password.length < 6) return { error: 'Password must be at least 6 characters long' }
  if (password !== confirmPassword) return { error: 'Passwords do not match' }

  try {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true }
    })

    if (!resetToken) return { error: 'Invalid or missing token' }
    if (resetToken.expires < new Date()) return { error: 'Token has expired' }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Update the user's password
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash: hashedPassword }
    })

    // Delete the token so it can't be reused
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id }
    })

    return { success: 'Password reset successfully. You can now log in.' }
  } catch (error) {
    console.error(error)
    return { error: 'Something went wrong.' }
  }
}
