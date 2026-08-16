'use client'

import { useLanguage } from './language-provider'

type CalorieRingProps = {
  consumed: number
  target: number
}

export function CalorieRing({ consumed, target }: CalorieRingProps) {
  const { t } = useLanguage()
  const percentage = target > 0 ? Math.min((consumed / target) * 100, 100) : 0
  const remaining = Math.max(target - consumed, 0)
  
  // SVG circle math
  const radius = 80
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48 sm:w-56 sm:h-56">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle cx="100" cy="100" r={radius} fill="none" 
            stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" 
            strokeWidth="12" />
          {/* Progress circle */}
          <circle cx="100" cy="100" r={radius} fill="none"
            stroke="url(#gradient)" strokeWidth="12" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out" />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0d9488" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl sm:text-4xl font-black tracking-tight">
            {consumed.toLocaleString()}
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            / {target.toLocaleString()} kcal
          </span>
        </div>
      </div>
      <div className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        {t('remaining')}: <span className="font-semibold text-teal-600 dark:text-teal-400">{remaining}</span> kcal
      </div>
    </div>
  )
}
