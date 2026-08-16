import { auth } from '@/auth'
import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { ProfileForm } from '@/components/profile-form'
import { MealTracker } from '@/components/meal-tracker'
import { DashboardCharts } from '@/components/dashboard-charts'
import Link from 'next/link'

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

  // Get 7 days data
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayEnd = new Date(todayStart)
  todayEnd.setDate(todayEnd.getDate() + 1)
  
  const sevenDaysAgo = new Date(todayStart)
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6) // Last 7 days including today
  
  const dateStr = todayStart.toISOString().split('T')[0]

  const pastMeals = await prisma.meal.findMany({
    where: {
      userId: userWithProfile.id,
      logDate: {
        gte: sevenDaysAgo,
        lt: todayEnd
      }
    },
    include: {
      mealItems: {
        include: {
          food: true
        }
      }
    }
  })

  const allFoods = await prisma.food.findMany({
    orderBy: { name: 'asc' }
  })

  // chartData generation
  const chartData = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo)
    d.setDate(d.getDate() + i)
    
    // For weekday abbreviation (e.g. 'Mon')
    const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' })
    
    // filter meals for this date
    const dayMeals = pastMeals.filter(m => {
      const mDate = new Date(m.logDate)
      return mDate.getDate() === d.getDate() && mDate.getMonth() === d.getMonth()
    })

    let cal = 0, pro = 0, car = 0, fat = 0
    dayMeals.forEach(m => {
      m.mealItems.forEach(item => {
        cal += item.computedCalories
        pro += item.food.protein * item.servingMultiplier
        car += item.food.carbs * item.servingMultiplier
        fat += item.food.fat * item.servingMultiplier
      })
    })

    chartData.push({
      date: dayStr,
      calories: Math.round(cal),
      protein: Math.round(pro),
      carbs: Math.round(car),
      fat: Math.round(fat)
    })
  }

  // today's meals are just dayMeals for today
  const meals = pastMeals.filter(m => {
    const mDate = new Date(m.logDate)
    return mDate.getDate() === todayStart.getDate() && mDate.getMonth() === todayStart.getMonth()
  })

  // consumed targets are basically chartData[6]
  const todayData = chartData[6]
  const consumedCalories = todayData.calories
  const consumedProtein = todayData.protein
  const consumedCarbs = todayData.carbs
  const consumedFat = todayData.fat

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
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <Link href="/dashboard/weight">
              <Button variant="secondary" className="rounded-full">
                Weight Tracking
              </Button>
            </Link>
            <Link href="/dashboard/foods">
              <Button variant="secondary" className="rounded-full">
                Food Database
              </Button>
            </Link>
            <form action={logout}>
              <Button variant="outline" type="submit" className="rounded-full">
                Log out
              </Button>
            </form>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
              <h2 className="text-xl font-bold mb-6">Today&apos;s Nutrition</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Calories</div>
                  <div className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">{Math.round(consumedCalories)} <span className="text-sm font-normal text-zinc-400">/ {profile.dailyCalorieTarget}</span></div>
                  <div className="text-xs text-zinc-400 mt-1">kcal</div>
                </div>
                
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Protein</div>
                  <div className="text-2xl font-black text-rose-500 dark:text-rose-400 mt-1">{Math.round(consumedProtein)} <span className="text-sm font-normal text-zinc-400">/ {profile.targetProtein}</span></div>
                  <div className="text-xs text-zinc-400 mt-1">grams</div>
                </div>
                
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Carbs</div>
                  <div className="text-2xl font-black text-amber-500 dark:text-amber-400 mt-1">{Math.round(consumedCarbs)} <span className="text-sm font-normal text-zinc-400">/ {profile.targetCarbs}</span></div>
                  <div className="text-xs text-zinc-400 mt-1">grams</div>
                </div>
                
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Fats</div>
                  <div className="text-2xl font-black text-sky-500 dark:text-sky-400 mt-1">{Math.round(consumedFat)} <span className="text-sm font-normal text-zinc-400">/ {profile.targetFat}</span></div>
                  <div className="text-xs text-zinc-400 mt-1">grams</div>
                </div>
              </div>
            </section>
            <DashboardCharts data={chartData} />
            
            <section>
              <h2 className="text-xl font-bold mb-4">Log a Meal</h2>
              <MealTracker meals={meals} allFoods={allFoods} dateStr={dateStr} />
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
