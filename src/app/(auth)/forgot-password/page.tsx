'use client'

import { useActionState } from 'react'
import { forgotPassword } from '@/app/actions/reset-password'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [state, dispatch, isPending] = useActionState(
    forgotPassword,
    undefined,
  )

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-6 sm:p-10 shadow-md mx-4 sm:mx-0">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Forgot Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email to receive a password reset link.
          </p>
        </div>
        
        {state?.success ? (
          <div className="rounded-md bg-green-50 p-4 mt-8">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{state.success}</p>
                <div className="mt-4">
                  <Link href="/login" className="text-sm font-medium text-green-600 hover:text-green-500">
                    &larr; Back to login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form action={dispatch} className="mt-8 space-y-6">
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full justify-center"
                disabled={isPending}
              >
                {isPending ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-sm">
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Back to login
                </Link>
              </div>
            </div>

            <div
              className="flex items-end space-x-1"
              aria-live="polite"
              aria-atomic="true"
            >
              {state?.error && (
                <p className="text-sm text-red-500">{state.error}</p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
