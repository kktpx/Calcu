'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { createFood, analyzeFoodImage } from '@/app/actions/food'
import { Plus, Camera, Loader2 } from 'lucide-react'
import { useLanguage } from './language-provider'

export function FoodForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { t } = useLanguage()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    if (!formData.get('fiber')) {
      formData.append('fiber', '0')
    }
    try {
      const res = await createFood(formData)
      if (res?.error) {
        alert('Failed to add food: ' + res.error)
      } else {
        e.currentTarget.reset()
      }
    } catch (err) {
      console.error(err)
      alert('Failed to add food')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsScanning(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const result = await analyzeFoodImage(formData)
      
      // Populate form
      if (formRef.current) {
        const form = formRef.current
        ;(form.elements.namedItem('name') as HTMLInputElement).value = result.name || ''
        ;(form.elements.namedItem('servingSize') as HTMLInputElement).value = result.servingSize || ''
        ;(form.elements.namedItem('calories') as HTMLInputElement).value = result.calories || ''
        ;(form.elements.namedItem('protein') as HTMLInputElement).value = result.protein || ''
        ;(form.elements.namedItem('carbs') as HTMLInputElement).value = result.carbs || ''
        ;(form.elements.namedItem('fat') as HTMLInputElement).value = result.fat || ''
      }
    } catch (error) {
      console.error(error)
      alert('Failed to analyze food image')
    } finally {
      setIsScanning(false)
      // Reset file input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
      
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <Button 
        type="button" 
        className="w-full h-16 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow-lg shadow-teal-500/25 text-base sm:text-lg font-bold transition-transform hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center mb-2"
        onClick={() => fileInputRef.current?.click()}
        disabled={isScanning}
      >
        {isScanning ? (
          <><Loader2 className="w-6 h-6 mr-3 animate-spin" /> {t('analyzing')}</>
        ) : (
          <><Camera className="w-6 h-6 mr-3" /> {t('aiRecognition')}</>
        )}
      </Button>

      <div className="relative flex items-center py-5">
        <div className="flex-grow border-t border-zinc-100 dark:border-zinc-800"></div>
        <span className="flex-shrink-0 mx-4 text-zinc-400 dark:text-zinc-500 text-xs font-semibold tracking-wider uppercase">{t('orEnterManually')}</span>
        <div className="flex-grow border-t border-zinc-100 dark:border-zinc-800"></div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input 
            type="text" 
            name="name" 
            placeholder={t('foodNamePlaceholder')}
            className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-teal-500" 
            required 
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input 
              type="text" 
              name="servingSize" 
              placeholder={t('servingPlaceholder')}
              className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-teal-500" 
              required 
            />
          </div>
          <div>
            <input 
              type="number" 
              name="calories" 
              placeholder={t('caloriesPlaceholder')}
              className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-teal-500" 
              required 
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <input 
              type="number" 
              name="protein"
              step="0.1" 
              placeholder={t('proteinG')}
              className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-teal-500" 
              required 
            />
          </div>
          <div>
            <input 
              type="number" 
              name="carbs"
              step="0.1" 
              placeholder={t('carbsG')}
              className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-teal-500" 
              required 
            />
          </div>
          <div>
            <input 
              type="number" 
              name="fat"
              step="0.1" 
              placeholder={t('fatG')}
              className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-teal-500" 
              required 
            />
          </div>
        </div>

        <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl h-[46px] mt-1" disabled={isSubmitting}>
          <Plus className="w-4 h-4 mr-2" /> {t('addCustomFood')}
        </Button>
      </form>
    </div>
  )
}
