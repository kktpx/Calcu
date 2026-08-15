import { auth } from '@/auth'
import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const session = await auth()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between border-b pb-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <form action={logout}>
            <Button variant="outline" type="submit">
              Log out
            </Button>
          </form>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Welcome, {session?.user?.name || session?.user?.email}!</h2>
          <p className="mt-2 text-gray-600">
            This is your Calwise dashboard. You are successfully authenticated.
          </p>
          <div className="mt-6 rounded-lg bg-gray-100 p-4">
            <pre className="text-sm">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
