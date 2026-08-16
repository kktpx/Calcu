'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Flame, Scale, Brain } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { LanguageSelector } from '@/components/language-selector'

export default function Home() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col">
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-7xl mx-auto w-full border-b border-zinc-100 dark:border-zinc-900/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">CalWise</span>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <Link href="/login">
            <Button variant="ghost" size="sm" className="hidden sm:flex">{t('signIn')}</Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-6">{t('getStarted')}</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 pt-12 md:pt-24 pb-16 md:pb-24 w-full">
        <section className="text-center md:text-left md:flex items-center justify-between gap-12">
          <div className="flex-1 space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              CalWise AI is live
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.15] md:leading-[1.1]">
              {t('heroTitle')} <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-400">
                {t('heroHighlight')}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto md:mx-0 leading-relaxed">
              {t('heroDesc')}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start pt-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 px-8 h-12 text-base">
                  {t('getStarted')} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto rounded-full h-12 px-8 text-base">
                  {t('signIn')}
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex-1 mt-16 md:mt-0 relative hidden sm:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-emerald-400/20 rounded-[3rem] blur-3xl" />
            <div className="relative bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 rounded-[2rem] shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <div>
                    <div className="text-sm font-medium text-zinc-500">{t('todaysSummary')}</div>
                    <div className="text-2xl font-bold">1,250 / 2,000 kcal</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold">
                    62%
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">{t('protein')}</span>
                      <span className="text-zinc-500">80g / 150g</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 w-[53%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">{t('carbs')}</span>
                      <span className="text-zinc-500">140g / 250g</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[56%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 md:mt-32 grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <div className="flex flex-col items-start p-6 md:p-8 rounded-2xl md:rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700 flex items-center justify-center mb-6">
              <Brain className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t('aiRecognition')}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm md:text-base">
              Snap a photo of your meal and let our AI instantly analyze calories and macros with high accuracy.
            </p>
          </div>
          <div className="flex flex-col items-start p-6 md:p-8 rounded-2xl md:rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700 flex items-center justify-center mb-6">
              <Flame className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t('todaysSummary')}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm md:text-base">
              Monitor your daily intake against your personalized targets. Beautiful charts make it easy to stay on track.
            </p>
          </div>
          <div className="flex flex-col items-start p-6 md:p-8 rounded-2xl md:rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 sm:col-span-2 md:col-span-1">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700 flex items-center justify-center mb-6">
              <Scale className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t('weightProgress')}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm md:text-base">
              Log your weight daily and visualize your progress over time. See how your diet directly impacts your body.
            </p>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-500 border-t border-zinc-100 dark:border-zinc-900">
        <p>&copy; {new Date().getFullYear()} CalWise. All rights reserved.</p>
      </footer>
    </div>
  )
}
