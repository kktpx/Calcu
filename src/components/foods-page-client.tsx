'use client'

import { useLanguage } from '@/components/language-provider'
import { FoodForm } from '@/components/food-form'
import { FoodDeleteButton } from '@/components/food-delete-button'

type Food = {
  id: string
  name: string
  servingSize: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export function FoodsPageClient({ foods }: { foods: Food[] }) {
  const { t } = useLanguage()

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6 space-y-6">
      <header className="flex flex-col items-start bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
        <h1 className="text-xl font-bold tracking-tight">{t('foodDatabase')}</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          {t('foodDbDesc')}
        </p>
      </header>

      <FoodForm />
      
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-xl font-bold">{t('yourFoods')}</h2>
        </div>
        
        {foods.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-sm italic">
            {t('noFoodsYet')}
          </div>
        ) : (
          <>
            {/* Desktop: Table view */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-500 bg-zinc-50 dark:bg-zinc-950/50 uppercase border-b border-zinc-100 dark:border-zinc-800">
                  <tr>
                    <th className="px-6 py-4 font-medium">{t('food')}</th>
                    <th className="px-6 py-4 font-medium">{t('serving')}</th>
                    <th className="px-6 py-4 font-medium">{t('calories')}</th>
                    <th className="px-6 py-4 font-medium">{t('macros')}</th>
                    <th className="px-6 py-4 font-medium text-right">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {foods.map((food) => (
                    <tr key={food.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                      <td className="px-6 py-4 font-medium">{food.name}</td>
                      <td className="px-6 py-4 text-zinc-500">{food.servingSize}</td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-teal-600 dark:text-teal-400">{food.calories}</span> kcal
                      </td>
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

            {/* Mobile: Card view */}
            <div className="sm:hidden divide-y divide-zinc-100 dark:divide-zinc-800">
              {foods.map((food) => (
                <div key={food.id} className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-base">{food.name}</div>
                      <div className="text-xs text-zinc-500">{food.servingSize}</div>
                    </div>
                    <FoodDeleteButton id={food.id} />
                  </div>
                  <div className="flex gap-4 text-xs text-zinc-500 pt-1">
                    <span className="font-semibold text-teal-600 dark:text-teal-400">{food.calories} kcal</span>
                    <span>P: {food.protein}g</span>
                    <span>C: {food.carbs}g</span>
                    <span>F: {food.fat}g</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
