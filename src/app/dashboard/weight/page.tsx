import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { WeightTracker } from '@/components/weight-tracker'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold tracking-tight">Weight Tracking</h1>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm ml-11">
              Log your daily weight and track your progress over time.
            </p>
          </div>
        </header>

        {/* Tracker Component */}
        <WeightTracker records={weightRecords} />
        
      </div>
    </div>
  )
}
