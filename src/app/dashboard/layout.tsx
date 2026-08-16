import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { BottomTabBar } from '@/components/bottom-tab-bar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user?.email) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20">
      {children}
      <BottomTabBar />
    </div>
  )
}
