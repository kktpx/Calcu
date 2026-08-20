'use client'

import { useActionState } from 'react'
import { resetPassword } from '@/app/actions/reset-password'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ResetPasswordForm() {
  const [state, dispatch, isPending] = useActionState(
    resetPassword,
    undefined,
  )
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <p className="text-red-500">Invalid or missing reset token.</p>
        <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
          Request a new link
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Reset Password</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your new password below.
        </p>
      </div>
      
      {state?.success ? (
        <div className="rounded-md bg-green-50 p-4 mt-8">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{state.success}</p>
              <div className="mt-4">
                <Link href="/login" className="text-sm font-medium text-green-600 hover:text-green-500">
                  &larr; Go to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form action={dispatch} className="mt-8 space-y-6">
          <input type="hidden" name="token" value={token} />
          
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="password" className="sr-only">New Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                placeholder="New Password (min 6 chars)"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={6}
                className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                placeholder="Confirm New Password"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full justify-center"
              disabled={isPending}
            >
              {isPending ? 'Resetting...' : 'Reset Password'}
            </Button>
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
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-6 sm:p-10 shadow-md mx-4 sm:mx-0">
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
