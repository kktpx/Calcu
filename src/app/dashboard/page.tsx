import { auth } from '@/auth'
import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { ProfileForm } from '@/components/profile-form'

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user?.email) {
    return <div>Not authenticated</div>
  }

  const userWithProfile = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { profile: true }
  })

  const profile = userWithProfile?.profile

  if (!profile) {
    return <div>Profile not found. Please contact support.</div>
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">
              Welcome back, {session.user.name || session.user.email}
            </p>
          </div>
          <form action={logout} className="mt-4 sm:mt-0">
            <Button variant="outline" type="submit" className="rounded-full">
              Log out
            </Button>
          </form>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
              <h2 className="text-xl font-bold mb-6">Today&apos;s Nutrition Targets</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Calories</div>
                  <div className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">{profile.dailyCalorieTarget}</div>
                  <div className="text-xs text-zinc-400 mt-1">kcal</div>
                </div>
                
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Protein</div>
                  <div className="text-2xl font-black text-rose-500 dark:text-rose-400 mt-1">{profile.targetProtein}</div>
                  <div className="text-xs text-zinc-400 mt-1">grams</div>
                </div>
                
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Carbs</div>
                  <div className="text-2xl font-black text-amber-500 dark:text-amber-400 mt-1">{profile.targetCarbs}</div>
                  <div className="text-xs text-zinc-400 mt-1">grams</div>
                </div>
                
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Fats</div>
                  <div className="text-2xl font-black text-sky-500 dark:text-sky-400 mt-1">{profile.targetFat}</div>
                  <div className="text-xs text-zinc-400 mt-1">grams</div>
                </div>
              </div>
            </section>
            
            {/* Future Placeholder for Daily Tracking / AI Food Recognition */}
            <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
              <h2 className="text-xl font-bold mb-4">Log a Meal</h2>
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-8 text-center">
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                  Meal tracking and AI food recognition features will appear here.
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
              <h2 className="text-xl font-bold mb-4">Your Profile</h2>
              
              <ul className="space-y-3 mb-6">
                <li className="flex justify-between items-center text-sm border-b border-zinc-100 dark:border-zinc-800 pb-2">
                  <span className="text-zinc-500 dark:text-zinc-400">Goal</span>
                  <span className="font-medium capitalize">{profile.fitnessGoal} Weight</span>
                </li>
                <li className="flex justify-between items-center text-sm border-b border-zinc-100 dark:border-zinc-800 pb-2">
                  <span className="text-zinc-500 dark:text-zinc-400">Activity</span>
                  <span className="font-medium capitalize">{profile.activityLevel.replace('_', ' ')}</span>
                </li>
                <li className="flex justify-between items-center text-sm border-b border-zinc-100 dark:border-zinc-800 pb-2">
                  <span className="text-zinc-500 dark:text-zinc-400">Height</span>
                  <span className="font-medium">{profile.heightCm} cm</span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">Weight</span>
                  <span className="font-medium">{profile.weightKg} kg</span>
                </li>
              </ul>

              <ProfileForm profile={profile} />
            </section>
          </div>
          
        </div>
      </div>
    </div>
  )
}
