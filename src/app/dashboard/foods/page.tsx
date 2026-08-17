import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { FoodsPageClient } from '@/components/foods-page-client'

export default async function FoodsPage() {
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

  const foods = await prisma.food.findMany({
    orderBy: { name: 'asc' }
  })

  return <FoodsPageClient foods={foods} />
}
