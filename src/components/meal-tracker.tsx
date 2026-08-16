'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { addMealItem, deleteMealItem } from '@/app/actions/meal'
import { Plus, Trash2, Check, Utensils } from 'lucide-react'

type Food = {
  id: string
  name: string
  calories: number
  servingSize: string
  protein: number
  carbs: number
  fat: number
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
  const [activeMealType, setActiveMealType] = useState<string | null>(null)
  const [selectedFoodId, setSelectedFoodId] = useState<string>('')
  const [multiplier, setMultiplier] = useState<number>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack']

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedFoodId || !activeMealType) return

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('foodId', selectedFoodId)
    formData.append('mealType', activeMealType)
    formData.append('servingMultiplier', multiplier.toString())
    formData.append('date', dateStr)

    try {
      await addMealItem(formData)
      setActiveMealType(null)
      setSelectedFoodId('')
      setMultiplier(1)
    } catch (err) {
      console.error(err)
      alert('Failed to add food')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {mealTypes.map(type => {
        const meal = meals.find(m => m.mealType === type)
        const items = meal?.mealItems || []
        const totalCalories = items.reduce((sum, item) => sum + item.computedCalories, 0)
        
        return (
          <div key={type} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-950/50">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Utensils className="w-4 h-4 text-zinc-400" />
                {type}
              </h3>
              <div className="text-sm font-semibold text-zinc-500">{totalCalories} kcal</div>
            </div>
            
            <div className="p-4 sm:p-5 space-y-4">
              {items.length > 0 ? (
                <ul className="space-y-3">
                  {items.map(item => (
                    <li key={item.id} className="flex justify-between items-center group">
                      <div>
                        <div className="font-medium text-sm">{item.food.name}</div>
                        <div className="text-xs text-zinc-500 mt-0.5">
                          {item.servingMultiplier} x {item.food.servingSize} • {(item.food.protein * item.servingMultiplier).toFixed(1)}g P / {(item.food.carbs * item.servingMultiplier).toFixed(1)}g C / {(item.food.fat * item.servingMultiplier).toFixed(1)}g F
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-sm">{item.computedCalories} kcal</span>
                        <button 
                          onClick={() => confirm('Remove this food?') && deleteMealItem(item.id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Remove food"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-zinc-400 dark:text-zinc-600 italic">No food logged yet.</div>
              )}

              {activeMealType === type ? (
                <form onSubmit={handleAdd} className="mt-4 p-4 border border-teal-100 dark:border-teal-900/50 bg-teal-50/30 dark:bg-teal-900/10 rounded-xl space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-zinc-500 mb-1 block">Select Food</label>
                      <select 
                        value={selectedFoodId} 
                        onChange={e => setSelectedFoodId(e.target.value)}
                        className="w-full text-sm p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 h-10"
                        required
                      >
                        <option value="" disabled>-- Choose Food --</option>
                        {allFoods.map(f => (
                          <option key={f.id} value={f.id}>{f.name} ({f.calories} kcal)</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-zinc-500 mb-1 block">Servings</label>
                      <input 
                        type="number" 
                        min="0.1" 
                        step="0.1" 
                        value={multiplier}
                        onChange={e => setMultiplier(parseFloat(e.target.value))}
                        className="w-full text-sm p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 h-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setActiveMealType(null)}>Cancel</Button>
                    <Button type="submit" size="sm" disabled={isSubmitting || !selectedFoodId} className="bg-teal-600 hover:bg-teal-700 text-white">
                      <Check className="w-4 h-4 mr-2" /> Save
                    </Button>
                  </div>
                </form>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-teal-400 hover:text-teal-600 dark:hover:border-teal-600 dark:hover:text-teal-400"
                  onClick={() => setActiveMealType(type)}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Food to {type}
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
