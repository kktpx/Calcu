import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { FoodForm } from '@/components/food-form'
import { FoodDeleteButton } from '@/components/food-delete-button'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function FoodsPage() {
  const session = await auth()
  
  if (!session?.user?.email) {
    return <div>Not authenticated</div>
  }

  // Fetch all foods
  const foods = await prisma.food.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="rounded-full">
                  &larr; Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold tracking-tight">Food Database</h1>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">
              Manage the food items available for meal tracking.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area - Food List */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
                <h2 className="text-xl font-bold">Food Items</h2>
              </div>
              
              {foods.length === 0 ? (
                <div className="text-center p-8 text-zinc-500 bg-zinc-50 dark:bg-zinc-900">
                  No foods found. Add one to get started.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800">
                      <tr>
                        <th className="px-6 py-4 font-medium">Name</th>
                        <th className="px-6 py-4 font-medium">Serving</th>
                        <th className="px-6 py-4 font-medium">Calories</th>
                        <th className="px-6 py-4 font-medium">Macros (P/C/F)</th>
                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {foods.map((food) => (
                        <tr key={food.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                          <td className="px-6 py-4 font-medium">{food.name}</td>
                          <td className="px-6 py-4 text-zinc-500">{food.servingSize}</td>
                          <td className="px-6 py-4">{food.calories} kcal</td>
                          <td className="px-6 py-4 text-zinc-500">
                            {food.protein}g / {food.carbs}g / {food.fat}g
                          </td>
                          <td className="px-6 py-4 text-right">
                            <FoodDeleteButton id={food.id} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar Area - Add Food Form */}
          <div className="space-y-8">
            <FoodForm />
          </div>
        </div>
      </div>
    </div>
  )
}
