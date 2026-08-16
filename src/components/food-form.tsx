'use client'

import { useState, useRef } from 'react'
import { createFood } from '@/app/actions/food'
import { analyzeFoodImage } from '@/app/actions/ai-food'
import { Button } from '@/components/ui/button'
import { Camera, Loader2, Image as ImageIcon } from 'lucide-react'

export function FoodForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const nameRef = useRef<HTMLInputElement>(null)
  const servingRef = useRef<HTMLInputElement>(null)
  const calRef = useRef<HTMLInputElement>(null)
  const proteinRef = useRef<HTMLInputElement>(null)
  const carbsRef = useRef<HTMLInputElement>(null)
  const fatRef = useRef<HTMLInputElement>(null)
  const fiberRef = useRef<HTMLInputElement>(null)

  async function action(formData: FormData) {
    setIsSubmitting(true)
    try {
      await createFood(formData)
      formRef.current?.reset()
      setPreviewImage(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (error) {
      console.error(error)
      alert('Failed to add food')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    const objectUrl = URL.createObjectURL(file)
    setPreviewImage(objectUrl)

    setIsAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const result = await analyzeFoodImage(formData)
      
      if (result.success && result.data) {
        const { name, servingSize, calories, protein, carbs, fat, fiber } = result.data
        
        // Auto-fill the form
        if (nameRef.current) nameRef.current.value = name || ''
        if (servingRef.current) servingRef.current.value = servingSize || ''
        if (calRef.current) calRef.current.value = calories || 0
        if (proteinRef.current) proteinRef.current.value = protein || 0
        if (carbsRef.current) carbsRef.current.value = carbs || 0
        if (fatRef.current) fatRef.current.value = fat || 0
        if (fiberRef.current) fiberRef.current.value = fiber || 0
      } else {
        alert(result.error || 'Failed to analyze image')
      }
    } catch (error) {
      console.error('Image analysis error:', error)
      alert('Error analyzing image. Make sure your Gemini API key is set in .env')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Camera className="w-5 h-5 text-teal-500" />
          AI Food Recognition
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
          ถ่ายรูปหรืออัปโหลดรูปอาหารเพื่อให้ AI ช่วยวิเคราะห์และกรอกข้อมูลโภชนาการให้โดยอัตโนมัติ
        </p>
        
        <input 
          type="file" 
          accept="image/*" 
          capture="environment"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageUpload}
        />
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full sm:w-auto flex-1 h-12"
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> กำลังวิเคราะห์รูปภาพ...</>
            ) : (
              <><ImageIcon className="w-4 h-4 mr-2" /> ถ่ายรูป / อัปโหลดอาหาร</>
            )}
          </Button>
          
          {previewImage && (
            <div className="w-16 h-16 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 shrink-0">
              <img src={previewImage} alt="Food preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      <form ref={formRef} action={action} className="space-y-4 rounded-xl border border-zinc-100 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900 shadow-sm">
        <h3 className="text-lg font-semibold border-b border-zinc-100 dark:border-zinc-800 pb-2">Add New Food</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Food Name</label>
            <input ref={nameRef} type="text" id="name" name="name" className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent p-2 text-sm" required placeholder="e.g. ข้าวมันไก่" />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="servingSize" className="text-sm font-medium">Serving Size</label>
            <input ref={servingRef} type="text" id="servingSize" name="servingSize" className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent p-2 text-sm" required placeholder="e.g. 1 จาน" />
          </div>

          <div className="space-y-2">
            <label htmlFor="calories" className="text-sm font-medium">Calories (kcal)</label>
            <input ref={calRef} type="number" id="calories" name="calories" className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent p-2 text-sm" required min="0" step="1" />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="protein" className="text-sm font-medium">Protein (g)</label>
            <input ref={proteinRef} type="number" id="protein" name="protein" className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent p-2 text-sm" required min="0" step="0.1" />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="carbs" className="text-sm font-medium">Carbs (g)</label>
            <input ref={carbsRef} type="number" id="carbs" name="carbs" className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent p-2 text-sm" required min="0" step="0.1" />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="fat" className="text-sm font-medium">Fat (g)</label>
            <input ref={fatRef} type="number" id="fat" name="fat" className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent p-2 text-sm" required min="0" step="0.1" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="fiber" className="text-sm font-medium">Fiber (g)</label>
            <input ref={fiberRef} type="number" id="fiber" name="fiber" className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent p-2 text-sm" required min="0" step="0.1" defaultValue={0} />
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting || isAnalyzing}>
            {isSubmitting ? 'Saving...' : 'Save Food'}
          </Button>
        </div>
      </form>
    </div>
  )
}
