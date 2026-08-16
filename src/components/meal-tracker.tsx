'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { addMealItem, deleteMealItem } from '@/app/actions/meal'
import { useLanguage } from './language-provider'

type Food = {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  servingSize: string
}

type MealItem = {
  id: string
  servingMultiplier: number
  computedCalories: number
  food: Food
}

type Meal = {
  id: string
  mealType: string
  mealItems: MealItem[]
}

export function MealTracker({ meals, allFoods, dateStr }: { meals: Meal[], allFoods: Food[], dateStr: string }) {
  const [selectedMealType, setSelectedMealType] = useState('breakfast')
  const [selectedFoodId, setSelectedFoodId] = useState('')
  const [servingMultiplier, setServingMultiplier] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { t } = useLanguage()

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack']

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedFoodId) return
    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('mealType', selectedMealType)
    formData.append('foodId', selectedFoodId)
    formData.append('servingMultiplier', servingMultiplier.toString())
    formData.append('date', dateStr)

    try {
      await addMealItem(formData)
      setSelectedFoodId('')
      setServingMultiplier(1)
    } catch (err) {
      console.error(err)
      alert('Failed to add meal')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
        <h2 className="font-bold mb-4 text-lg">{t('logMeal')}</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {mealTypes.map(type => (
              <label 
                key={type} 
                className={`flex items-center justify-center p-3 rounded-xl border text-sm font-medium cursor-pointer transition-colors ${
                  selectedMealType === type 
                    ? 'bg-teal-50 dark:bg-teal-900/30 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-400' 
                    : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <input 
                  type="radio" 
                  name="mealType" 
                  value={type} 
                  checked={selectedMealType === type}
                  onChange={(e) => setSelectedMealType(e.target.value)}
                  className="sr-only"
                />
                <span className="capitalize">{type}</span>
              </label>
            ))}
          </div>

          <div className="space-y-3">
            <select
              value={selectedFoodId}
              onChange={(e) => setSelectedFoodId(e.target.value)}
              className="w-full p-3 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
              required
            >
              <option value="">Select a food...</option>
              {allFoods.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.calories} kcal / {f.servingSize})
                </option>
              ))}
            </select>

            <div className="flex gap-3">
              <input 
                type="number" 
                step="0.1" 
                min="0.1"
                value={servingMultiplier}
                onChange={(e) => setServingMultiplier(Number(e.target.value))}
                className="w-24 p-3 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
              />
              <Button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-xl h-[46px]" disabled={isSubmitting}>
                <Plus className="w-4 h-4 mr-2" /> {t('add')}
              </Button>
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {mealTypes.map(type => {
          const mealForType = meals.find(m => m.mealType === type)
          const items = mealForType?.mealItems || []
          if (items.length === 0) return null

          const typeCalories = items.reduce((sum, item) => sum + item.computedCalories, 0)

          return (
            <div key={type} className="bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold capitalize">{type}</h3>
                <span className="text-sm font-semibold text-teal-600 dark:text-teal-400">{typeCalories} kcal</span>
              </div>
              <div className="space-y-3 divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center pt-3 first:pt-0 group">
                    <div>
                      <div className="font-medium text-sm">{item.food.name}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">
                        {item.servingMultiplier}x {item.food.servingSize} • P:{Math.round(item.food.protein * item.servingMultiplier)} C:{Math.round(item.food.carbs * item.servingMultiplier)} F:{Math.round(item.food.fat * item.servingMultiplier)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pl-2">
                      <span className="text-sm font-semibold">{item.computedCalories}</span>
                      <button 
                        onClick={() => deleteMealItem(item.id)}
                        className="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                        title="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
