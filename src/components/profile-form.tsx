'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { updateProfile } from '@/app/actions/profile'
import { Save } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

type Profile = {
  age: number
  gender: string
  heightCm: number
  weightKg: number
  activityLevel: string
  fitnessGoal: string
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    try {
      await updateProfile(formData)
      alert('Profile updated successfully!')
    } catch (err) {
      console.error(err)
      alert('Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-zinc-500 mb-1 block">{t('age')}</label>
          <input 
            type="number" 
            name="age" 
            defaultValue={profile.age} 
            className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
            required 
          />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-500 mb-1 block">{t('gender')}</label>
          <select 
            name="gender" 
            defaultValue={profile.gender}
            className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
          >
            <option value="male">{t('male')}</option>
            <option value="female">{t('female')}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-zinc-500 mb-1 block">{t('heightCm')}</label>
          <input 
            type="number" 
            name="heightCm" 
            defaultValue={profile.heightCm} 
            className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
            required 
          />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-500 mb-1 block">{t('weightKg')}</label>
          <input 
            type="number" 
            name="weightKg" 
            step="0.1" 
            defaultValue={profile.weightKg} 
            className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
            required 
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-zinc-500 mb-1 block">{t('activityLevel')}</label>
        <select 
          name="activityLevel" 
          defaultValue={profile.activityLevel}
          className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
        >
          <option value="sedentary">{t('sedentary')}</option>
          <option value="light">{t('lightActivity')}</option>
          <option value="moderate">{t('moderateActivity')}</option>
          <option value="active">{t('activeLevel')}</option>
          <option value="very_active">{t('veryActive')}</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-zinc-500 mb-1 block">{t('goalLabel')}</label>
        <select 
          name="fitnessGoal" 
          defaultValue={profile.fitnessGoal}
          className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
        >
          <option value="lose">{t('loseWeight')}</option>
          <option value="maintain">{t('maintainWeight')}</option>
          <option value="gain">{t('gainWeight')}</option>
        </select>
      </div>

      <Button type="submit" className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl h-[46px] mt-2" disabled={isSubmitting}>
        <Save className="w-4 h-4 mr-2" /> {t('saveChanges')}
      </Button>
    </form>
  )
}
