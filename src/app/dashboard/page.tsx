import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { MealTracker } from '@/components/meal-tracker'
import { DashboardCharts } from '@/components/dashboard-charts'
import { CalorieRing } from '@/components/calorie-ring'
import { MacroBars } from '@/components/macro-bars'
import { QuickScan } from '@/components/quick-scan'

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { profile: true }
  })

  if (!user) {
    redirect('/login')
  }

  // Today's date logic
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  // Local date string for forms
  const dateStr = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0]

  // Fetch meals for today
  const meals = await prisma.meal.findMany({
    where: {
      userId: user.id,
      logDate: {
        gte: today,
        lt: tomorrow
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

  // Fetch all foods for dropdown
  const allFoods = await prisma.food.findMany({
    orderBy: { name: 'asc' }
  })

  // Calculate totals
  let totalCalories = 0
  let totalProtein = 0
  let totalCarbs = 0
  let totalFat = 0

  meals.forEach((meal: any) => {
    meal.mealItems.forEach((item: any) => {
      totalCalories += item.computedCalories
      totalProtein += item.food.protein * item.servingMultiplier
      totalCarbs += item.food.carbs * item.servingMultiplier
      totalFat += item.food.fat * item.servingMultiplier
    })
  })

  // BMR & TDEE Calculation
  let tdee = 2000 // default
  let proteinTarget = 150
  let carbsTarget = 250
  let fatTarget = 65

  if (user.profile) {
    const { age, gender, heightCm, weightKg, activityLevel, fitnessGoal } = user.profile
    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age
    bmr += gender === 'male' ? 5 : -161

    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    }
    tdee = Math.round(bmr * (activityMultipliers[activityLevel] || 1.2))

    if (fitnessGoal === 'lose') tdee -= 500
    if (fitnessGoal === 'gain') tdee += 500

    proteinTarget = Math.round(weightKg * 2.2) // 2.2g per kg
    fatTarget = Math.round((tdee * 0.25) / 9) // 25% of calories from fat
    carbsTarget = Math.round((tdee - (proteinTarget * 4 + fatTarget * 9)) / 4)
  }

  // Generate chart data for the last 7 days
  const chartData = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    d.setHours(0,0,0,0)
    const nextD = new Date(d)
    nextD.setDate(d.getDate() + 1)
    
    const dayMeals = await prisma.meal.findMany({
      where: {
        userId: user.id,
        logDate: { gte: d, lt: nextD }
      },
      include: { mealItems: { include: { food: true } } }
    })

    let cals = 0, p = 0, c = 0, f = 0
    dayMeals.forEach((m: any) => {
      m.mealItems.forEach((item: any) => {
        cals += item.computedCalories
        p += item.food.protein * item.servingMultiplier
        c += item.food.carbs * item.servingMultiplier
        f += item.food.fat * item.servingMultiplier
      })
    })

    chartData.push({
      date: d.toLocaleDateString('en-US', { weekday: 'short' }),
      calories: Math.round(cals),
      protein: Math.round(p),
      carbs: Math.round(c),
      fat: Math.round(f)
    })
  }

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6 space-y-6">
      <header className="flex justify-between items-center bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="font-extrabold text-xl tracking-tight text-teal-600 dark:text-teal-400">Calcu</h1>
        </div>
        <div className="text-sm font-medium text-zinc-500">
          {new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </header>

      {/* Quick Scan */}
      <QuickScan />

      {/* Main Stats Card */}
      <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-center">
        <CalorieRing consumed={Math.round(totalCalories)} target={tdee} />
      </section>

      {/* Macros Card */}
      <section className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800">
        <MacroBars 
          protein={{ consumed: totalProtein, target: proteinTarget }}
          carbs={{ consumed: totalCarbs, target: carbsTarget }}
          fat={{ consumed: totalFat, target: fatTarget }}
        />
      </section>

      {/* Weekly Charts */}
      <DashboardCharts data={chartData} />

      {/* Meals */}
      <MealTracker meals={meals} allFoods={allFoods} dateStr={dateStr} />
    </div>
  )
}
