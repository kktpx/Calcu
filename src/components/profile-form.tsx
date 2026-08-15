'use client'

import { useState } from 'react'
import { updateProfile } from '@/app/actions/profile'
import { Button } from '@/components/ui/button'

type ProfileProps = {
  profile: {
    age: number
    gender: string
    heightCm: number
    weightKg: number
    activityLevel: string
    fitnessGoal: string
  }
}

export function ProfileForm({ profile }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function action(formData: FormData) {
    setIsSubmitting(true)
    try {
      await updateProfile(formData)
      setIsEditing(false)
    } catch (error) {
      console.error(error)
      alert('Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isEditing) {
    return (
      <Button onClick={() => setIsEditing(true)} variant="outline">
        Edit Profile
      </Button>
    )
  }

  return (
    <form action={action} className="space-y-4 rounded-xl border p-6 bg-white shadow-sm mt-4">
      <h3 className="text-lg font-semibold border-b pb-2">Update Profile</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="age" className="text-sm font-medium">Age</label>
          <input type="number" id="age" name="age" defaultValue={profile.age} className="w-full rounded-md border p-2 text-sm" required min="10" max="120" />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="gender" className="text-sm font-medium">Gender</label>
          <select id="gender" name="gender" defaultValue={profile.gender} className="w-full rounded-md border p-2 text-sm">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="heightCm" className="text-sm font-medium">Height (cm)</label>
          <input type="number" id="heightCm" name="heightCm" defaultValue={profile.heightCm} className="w-full rounded-md border p-2 text-sm" required min="50" max="300" step="0.1" />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="weightKg" className="text-sm font-medium">Weight (kg)</label>
          <input type="number" id="weightKg" name="weightKg" defaultValue={profile.weightKg} className="w-full rounded-md border p-2 text-sm" required min="20" max="500" step="0.1" />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="activityLevel" className="text-sm font-medium">Activity Level</label>
          <select id="activityLevel" name="activityLevel" defaultValue={profile.activityLevel} className="w-full rounded-md border p-2 text-sm">
            <option value="sedentary">Sedentary (little to no exercise)</option>
            <option value="light">Light (exercise 1-3 days/week)</option>
            <option value="moderate">Moderate (exercise 3-5 days/week)</option>
            <option value="active">Active (exercise 6-7 days/week)</option>
            <option value="very_active">Very Active (hard exercise/sports)</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="fitnessGoal" className="text-sm font-medium">Fitness Goal</label>
          <select id="fitnessGoal" name="fitnessGoal" defaultValue={profile.fitnessGoal} className="w-full rounded-md border p-2 text-sm">
            <option value="lose">Lose Weight (Cutting)</option>
            <option value="maintain">Maintain Weight</option>
            <option value="gain">Gain Muscle (Bulking)</option>
          </select>
        </div>
      </div>
      
      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="ghost" onClick={() => setIsEditing(false)} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </form>
  )
}
