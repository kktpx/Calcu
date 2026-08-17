'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useLanguage } from './language-provider'

type ChartData = {
  date: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export function DashboardCharts({ data }: { data: ChartData[] }) {
  const [activeChart, setActiveChart] = useState<'calories' | 'macros'>('calories')
  const { t } = useLanguage()

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold">{t('weeklyOverview')}</h2>
        <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
          <button 
            onClick={() => setActiveChart('calories')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${activeChart === 'calories' ? 'bg-white dark:bg-zinc-700 shadow-sm font-medium' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
          >
            {t('calories')}
          </button>
          <button 
            onClick={() => setActiveChart('macros')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${activeChart === 'macros' ? 'bg-white dark:bg-zinc-700 shadow-sm font-medium' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
          >
            {t('macros')}
          </button>
        </div>
      </div>

      <div className="h-48 sm:h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {activeChart === 'calories' ? (
            <BarChart data={data} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" strokeOpacity={0.5} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#71717a' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#71717a' }} />
              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="calories" name={t('calories')} fill="#0d9488" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          ) : (
            <BarChart data={data} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" strokeOpacity={0.5} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#71717a' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#71717a' }} />
              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="circle" />
              <Bar dataKey="carbs" name={t('carbs')} stackId="a" fill="#f59e0b" maxBarSize={40} />
              <Bar dataKey="protein" name={t('protein')} stackId="a" fill="#f43f5e" maxBarSize={40} />
              <Bar dataKey="fat" name={t('fat')} stackId="a" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
