'use client'

import { useLanguage } from './language-provider'

export function LanguageSelector() {
  const { locale, setLocale } = useLanguage()

  return (
    <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
      <button
        onClick={() => setLocale('th')}
        className={`px-3 py-1 text-sm rounded-md transition-colors ${
          locale === 'th' 
            ? 'bg-white dark:bg-zinc-700 shadow-sm font-medium' 
            : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
        }`}
      >
        ไทย
      </button>
      <button
        onClick={() => setLocale('en')}
        className={`px-3 py-1 text-sm rounded-md transition-colors ${
          locale === 'en' 
            ? 'bg-white dark:bg-zinc-700 shadow-sm font-medium' 
            : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
        }`}
      >
        Eng
      </button>
    </div>
  )
}
