import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { WeightPageClient } from '@/components/weight-page-client'

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

  return <WeightPageClient weightRecords={weightRecords} />
}
