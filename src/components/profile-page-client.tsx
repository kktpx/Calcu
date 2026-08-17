'use client'

import { ProfileForm } from '@/components/profile-form'
import { ProfileAvatar } from '@/components/profile-avatar'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { LanguageSelector } from '@/components/language-selector'
import { useLanguage } from '@/components/language-provider'

type UserData = {
  email: string
  name: string | null
  image: string | null
}

type ProfileData = {
  age: number
  gender: string
  heightCm: number
  weightKg: number
  activityLevel: string
  fitnessGoal: string
} | null

export function ProfilePageClient({ user, profile }: { user: UserData; profile: ProfileData }) {
  const { t } = useLanguage()

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6 space-y-6">
      <header className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
        <ProfileAvatar user={user} />
      </header>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-4">
        <h2 className="font-bold text-lg border-b border-zinc-100 dark:border-zinc-800 pb-2">{t('settings')}</h2>
        
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-medium">{t('language')}</span>
          <LanguageSelector />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
        <h2 className="font-bold text-lg mb-4">{t('profileInfo')}</h2>
        {profile ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <div className="text-zinc-500 dark:text-zinc-400 text-xs mb-1">{t('goalLabel')}</div>
                <div className="font-semibold capitalize">{t(profile.fitnessGoal === 'lose' ? 'loseWeight' : profile.fitnessGoal === 'gain' ? 'gainWeight' : 'maintainWeight')}</div>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <div className="text-zinc-500 dark:text-zinc-400 text-xs mb-1">{t('activityLevel')}</div>
                <div className="font-semibold capitalize">
                  {profile.activityLevel === 'sedentary' ? t('sedentary') :
                   profile.activityLevel === 'light' ? t('lightActivity') :
                   profile.activityLevel === 'moderate' ? t('moderateActivity') :
                   profile.activityLevel === 'active' ? t('activeLevel') :
                   t('veryActive')}
                </div>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <div className="text-zinc-500 dark:text-zinc-400 text-xs mb-1">{t('height')}</div>
                <div className="font-semibold">{profile.heightCm} cm</div>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <div className="text-zinc-500 dark:text-zinc-400 text-xs mb-1">{t('currentWeight')}</div>
                <div className="font-semibold">{profile.weightKg} kg</div>
              </div>
            </div>
            <ProfileForm profile={profile} />
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-zinc-500 text-sm mb-4">{t('noProfileYet')}</p>
            <ProfileForm profile={{ age: 25, gender: 'male', heightCm: 170, weightKg: 70, activityLevel: 'moderate', fitnessGoal: 'maintain' }} />
          </div>
        )}
      </div>

      <div className="pt-4">
        <form action={logout}>
          <Button variant="outline" type="submit" className="w-full text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30">
            <LogOut className="w-4 h-4 mr-2" />
            {t('logout')}
          </Button>
        </form>
      </div>
    </div>
  )
}
