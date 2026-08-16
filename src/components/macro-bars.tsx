'use client'

import { useLanguage } from './language-provider'

type MacroBarsProps = {
  protein: { consumed: number; target: number }
  carbs: { consumed: number; target: number }
  fat: { consumed: number; target: number }
}

export function MacroBars({ protein, carbs, fat }: MacroBarsProps) {
  const { t } = useLanguage()
  
  const macros = [
    { label: t('protein'), ...protein, color: 'bg-rose-500', textColor: 'text-rose-500' },
    { label: t('carbs'), ...carbs, color: 'bg-amber-500', textColor: 'text-amber-500' },
    { label: t('fat'), ...fat, color: 'bg-sky-500', textColor: 'text-sky-500' },
  ]

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {macros.map(({ label, consumed, target, color, textColor }) => {
        const pct = target > 0 ? Math.min((consumed / target) * 100, 100) : 0
        return (
          <div key={label} className="bg-zinc-100 dark:bg-zinc-800/60 rounded-xl p-3 sm:p-4">
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">{label}</div>
            <div className="text-sm font-bold">{Math.round(consumed)}g <span className="text-zinc-400 font-normal">/ {target}g</span></div>
            <div className="mt-2 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
            </div>
            <div className={`text-xs font-semibold mt-1 ${textColor}`}>{Math.round(pct)}%</div>
          </div>
        )
      })}
    </div>
  )
}
