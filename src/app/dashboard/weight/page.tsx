import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { WeightTracker } from '@/components/weight-tracker'

export default async function WeightPage() {
  const session = await auth()
  
  if (!session?.user?.email) {
    return <div>Not authenticated</div>
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return <div>User not found.</div>
  }

  const weightRecords = await prisma.weightRecord.findMany({
    where: { userId: user.id },
    orderBy: { recordDate: 'asc' }
  })

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6 space-y-6">
      <header className="flex flex-col items-start bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
        <h1 className="text-xl font-bold tracking-tight">Weight Tracking</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Log your daily weight and track your progress over time.
        </p>
      </header>

      <WeightTracker records={weightRecords} />
    </div>
  )
}
