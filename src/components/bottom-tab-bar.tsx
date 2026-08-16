'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Utensils, Scale, User } from 'lucide-react'
import { useLanguage } from './language-provider'

const tabs = [
  { key: 'home', href: '/dashboard', icon: Home, labelKey: 'home' },
  { key: 'foods', href: '/dashboard/foods', icon: Utensils, labelKey: 'foods' },
  { key: 'weight', href: '/dashboard/weight', icon: Scale, labelKey: 'weight' },
  { key: 'profile', href: '/dashboard/profile', icon: User, labelKey: 'profile' },
] as const

export function BottomTabBar() {
  const pathname = usePathname()
  const { t } = useLanguage()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 
      bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl 
      border-t border-zinc-200 dark:border-zinc-800
      safe-area-bottom pb-env-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map(({ key, href, icon: Icon, labelKey }) => {
          const isActive = pathname === href || 
            (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={key}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-[64px]
                ${isActive 
                  ? 'text-teal-600 dark:text-teal-400' 
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600'
                }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] font-medium">{t(labelKey as any)}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
