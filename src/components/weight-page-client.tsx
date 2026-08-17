'use client'

import { useLanguage } from '@/components/language-provider'
import { WeightTracker } from '@/components/weight-tracker'

type WeightRecord = {
  id: string
  weightKg: number
  recordDate: Date
  userId: string
}

export function WeightPageClient({ weightRecords }: { weightRecords: WeightRecord[] }) {
  const { t } = useLanguage()

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6 space-y-6">
      <header className="flex flex-col items-start bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
        <h1 className="text-xl font-bold tracking-tight">{t('weightTracking')}</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          {t('weightTrackDesc')}
        </p>
      </header>

      <WeightTracker records={weightRecords} />
    </div>
  )
}
