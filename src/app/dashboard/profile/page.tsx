import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { ProfileForm } from '@/components/profile-form'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { LanguageSelector } from '@/components/language-selector'

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.email) return null

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { profile: true }
  })

  if (!user) return null

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6 space-y-6">
      <header className="flex justify-between items-center bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-400 rounded-full flex items-center justify-center text-xl font-bold">
            {user.email[0].toUpperCase()}
          </div>
          <div>
            <h1 className="font-bold text-lg">{user.email.split('@')[0]}</h1>
            <p className="text-sm text-zinc-500">{user.email}</p>
          </div>
        </div>
      </header>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-4">
        <h2 className="font-bold text-lg border-b border-zinc-100 dark:border-zinc-800 pb-2">Settings</h2>
        
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-medium">Language</span>
          <LanguageSelector />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
        <h2 className="font-bold text-lg mb-4">Profile Information</h2>
        {user.profile ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <div className="text-zinc-500 dark:text-zinc-400 text-xs mb-1">Goal</div>
                <div className="font-semibold capitalize">{user.profile.fitnessGoal}</div>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <div className="text-zinc-500 dark:text-zinc-400 text-xs mb-1">Activity</div>
                <div className="font-semibold capitalize">{user.profile.activityLevel}</div>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <div className="text-zinc-500 dark:text-zinc-400 text-xs mb-1">Height</div>
                <div className="font-semibold">{user.profile.heightCm} cm</div>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <div className="text-zinc-500 dark:text-zinc-400 text-xs mb-1">Current Weight</div>
                <div className="font-semibold">{user.profile.weightKg} kg</div>
              </div>
            </div>
            <ProfileForm profile={user.profile} />
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-zinc-500 text-sm mb-4">You haven't set up your profile yet.</p>
            <ProfileForm profile={{ age: 25, gender: 'male', heightCm: 170, weightKg: 70, activityLevel: 'moderate', fitnessGoal: 'maintain' }} />
          </div>
        )}
      </div>

      <div className="pt-4">
        <form action={logout}>
          <Button variant="outline" type="submit" className="w-full text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30">
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </form>
      </div>
    </div>
  )
}
