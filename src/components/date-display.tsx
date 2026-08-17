'use client'
import { useLanguage } from './language-provider'
export function DateDisplay() {
  const { locale } = useLanguage()
  return (
    <div className="text-sm font-medium text-zinc-500">
      {new Date().toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
    </div>
  )
}
