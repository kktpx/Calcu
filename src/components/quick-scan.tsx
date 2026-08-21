'use client'

import { useState, useRef } from 'react'
import { Camera, Loader2, X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { analyzeFoodImage, createFood } from '@/app/actions/food'
import { useLanguage } from './language-provider'

export function QuickScan() {
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { t } = useLanguage()

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsScanning(true)
    setResult(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const data = await analyzeFoodImage(formData)
      setResult(data)
    } catch (error) {
      console.error(error)
      alert('Failed to analyze food image')
    } finally {
      setIsScanning(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleSave() {
    if (!result) return
    setIsSaving(true)
    try {
      const formData = new FormData()
      formData.append('name', result.name)
      formData.append('calories', String(result.calories))
      formData.append('protein', String(result.protein))
      formData.append('carbs', String(result.carbs))
      formData.append('fat', String(result.fat))
      formData.append('fiber', String(result.fiber || 0))
      formData.append('servingSize', result.servingSize || '1 serving')
      const res = await createFood(formData)
      if (res?.error) {
        alert('Failed to save food: ' + res.error)
      } else {
        setResult(null)
        alert('Food added!')
      }
    } catch (err) {
      console.error(err)
      alert('Failed to save food')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isScanning}
        className="w-full relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all active:scale-[0.98]"
      >
        <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-[15px] py-4 px-6">
          {isScanning ? (
            <>
              <Loader2 className="w-6 h-6 text-white animate-spin" />
              <span className="text-white font-bold text-lg">{t('analyzing')}</span>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
              <span className="text-white font-bold text-base block leading-tight">{t('quickScan')}</span>
                <span className="text-white/70 text-xs">{t('uploadPhoto')}</span>
              </div>
            </>
          )}
        </div>
      </button>

      {result && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-base">{result.name}</h3>
              <p className="text-xs text-zinc-500 mt-0.5">{result.servingSize}</p>
            </div>
            <button onClick={() => setResult(null)} className="p-1 text-zinc-400 hover:text-zinc-600 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-teal-50 dark:bg-teal-950/30 rounded-xl p-2.5 text-center">
              <div className="text-lg font-bold text-teal-600 dark:text-teal-400">{result.calories}</div>
              <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">kcal</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-2.5 text-center">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{result.protein}g</div>
              <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">{t('protein')}</div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-2.5 text-center">
              <div className="text-lg font-bold text-amber-600 dark:text-amber-400">{result.carbs}g</div>
              <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">{t('carbs')}</div>
            </div>
            <div className="bg-rose-50 dark:bg-rose-950/30 rounded-xl p-2.5 text-center">
              <div className="text-lg font-bold text-rose-600 dark:text-rose-400">{result.fat}g</div>
              <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">{t('fat')}</div>
            </div>
          </div>

          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl h-11 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" /> {isSaving ? t('loading') : t('saveToFoods')}
          </Button>
        </div>
      )}
    </>
  )
}
